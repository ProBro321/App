package com.probro.wallet;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.ExistingWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

/**
 * Checks AniList in the background for new episodes of the shows being watched and posts a
 * notification when one comes out. Runs every couple of hours, plus once right after the next
 * known air time, so most alerts arrive within minutes.
 */
public class AiringWorker extends Worker {
    static final String PREFS = "airing";
    static final String CHANNEL = "new_episodes";

    public AiringWorker(@NonNull Context c, @NonNull WorkerParameters p) { super(c, p); }

    /** Saves the watch list from the app and makes sure the checks are scheduled. */
    static void update(Context ctx, String json) {
        SharedPreferences sp = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        SharedPreferences.Editor ed = sp.edit().putString("list", json);
        long next = Long.MAX_VALUE;
        try {
            JSONArray a = new JSONArray(json);
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.getJSONObject(i);
                int id = o.getInt("id");
                int aired = o.optInt("aired", -1);
                // Episodes the app already showed never trigger a notification.
                if (aired > sp.getInt("last_" + id, -1)) ed.putInt("last_" + id, aired);
                long at = o.optLong("at", 0);
                if (at > 0 && at < next) next = at;
            }
        } catch (Exception ignored) { }
        ed.apply();
        Constraints net = new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();
        WorkManager wm = WorkManager.getInstance(ctx);
        wm.enqueueUniquePeriodicWork("airing-check", ExistingPeriodicWorkPolicy.KEEP,
                new PeriodicWorkRequest.Builder(AiringWorker.class, 2, TimeUnit.HOURS).setConstraints(net).build());
        scheduleExact(ctx, next);
    }

    /** Saves the manga / manhwa being read, as JSON [{mu, title, n}], for the chapter checks. */
    static void updateReading(Context ctx, String json) {
        SharedPreferences sp = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        SharedPreferences.Editor ed = sp.edit().putString("mlist", json);
        try {
            JSONArray a = new JSONArray(json);
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.getJSONObject(i);
                String mu = o.optString("mu", "");
                int n = o.optInt("n", -1);
                // Chapters the app already showed never trigger a notification.
                if (!mu.isEmpty() && n > sp.getInt("mlast_" + mu, -1)) ed.putInt("mlast_" + mu, n);
            }
        } catch (Exception ignored) { }
        ed.apply();
        Constraints net = new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();
        WorkManager.getInstance(ctx).enqueueUniquePeriodicWork("airing-check", ExistingPeriodicWorkPolicy.KEEP,
                new PeriodicWorkRequest.Builder(AiringWorker.class, 2, TimeUnit.HOURS).setConstraints(net).build());
    }

    static final String MU = "https://api.mangaupdates.com/v1/";

    /** One request to the MangaUpdates API. Returns {status, body}. */
    static String[] mu(String method, String path, String body) {
        HttpURLConnection c = null;
        try {
            if (path == null || path.contains("://") || path.contains("..")) return new String[]{"0", ""};
            c = (HttpURLConnection) new URL(MU + path).openConnection();
            c.setConnectTimeout(15000);
            c.setReadTimeout(15000);
            c.setRequestMethod("POST".equals(method) ? "POST" : "GET");
            c.setRequestProperty("Accept", "application/json");
            if ("POST".equals(method)) {
                c.setDoOutput(true);
                c.setRequestProperty("Content-Type", "application/json");
                try (OutputStream o = c.getOutputStream()) { o.write((body == null ? "{}" : body).getBytes(StandardCharsets.UTF_8)); }
            }
            int code = c.getResponseCode();
            InputStream in = code >= 400 ? c.getErrorStream() : c.getInputStream();
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            if (in != null) {
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) > 0) b.write(buf, 0, n);
                in.close();
            }
            return new String[]{String.valueOf(code), b.toString("UTF-8")};
        } catch (Exception e) {
            return new String[]{"0", ""};
        } finally { if (c != null) c.disconnect(); }
    }

    private void checkChapters(Context ctx, SharedPreferences sp) {
        try {
            JSONArray list = new JSONArray(sp.getString("mlist", "[]"));
            SharedPreferences.Editor ed = sp.edit();
            for (int i = 0; i < list.length() && i < 40; i++) {
                JSONObject o = list.getJSONObject(i);
                String mu = o.optString("mu", "");
                if (!mu.matches("\\d+")) continue;
                String[] r = mu("GET", "series/" + mu, null);
                if (!"200".equals(r[0])) continue;
                int latest = (int) Math.floor(new JSONObject(r[1]).optDouble("latest_chapter", 0));
                if (latest < 1) continue;
                int last = sp.getInt("mlast_" + mu, -1);
                if (last < 0) { ed.putInt("mlast_" + mu, latest); continue; }
                if (latest > last) {
                    String what = latest - last == 1 ? "Chapter " + latest + " is out" : "Chapters " + (last + 1) + "–" + latest + " are out";
                    notify(ctx, (int) (Long.parseLong(mu) % 1000000000L), o.optString("title", "New chapter"), what + " 📖");
                    ed.putInt("mlast_" + mu, latest);
                }
                Thread.sleep(1200);
            }
            ed.apply();
        } catch (Exception ignored) { }
    }

    static void scheduleExact(Context ctx, long airingAtSec) {
        if (airingAtSec == Long.MAX_VALUE || airingAtSec <= 0) return;
        long delay = Math.max(60_000L, airingAtSec * 1000L - System.currentTimeMillis() + 10 * 60_000L);
        Constraints net = new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();
        WorkManager.getInstance(ctx).enqueueUniqueWork("airing-exact", ExistingWorkPolicy.REPLACE,
                new OneTimeWorkRequest.Builder(AiringWorker.class).setInitialDelay(delay, TimeUnit.MILLISECONDS)
                        .setConstraints(net).build());
    }

    @NonNull
    @Override
    public Result doWork() {
        Context ctx = getApplicationContext();
        SharedPreferences sp = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        checkChapters(ctx, sp);
        try {
            JSONArray list = new JSONArray(sp.getString("list", "[]"));
            if (list.length() == 0) return Result.success();
            JSONArray ids = new JSONArray();
            JSONObject titles = new JSONObject();
            for (int i = 0; i < list.length(); i++) {
                JSONObject o = list.getJSONObject(i);
                ids.put(o.getInt("id"));
                titles.put(String.valueOf(o.getInt("id")), o.optString("title", ""));
            }
            JSONObject body = new JSONObject();
            body.put("query", "query($ids:[Int]){Page(perPage:50){media(id_in:$ids){id episodes status title{english romaji} nextAiringEpisode{episode airingAt}}}}");
            body.put("variables", new JSONObject().put("ids", ids));
            JSONObject res = new JSONObject(post("https://graphql.anilist.co", body.toString()));
            JSONArray media = res.getJSONObject("data").getJSONObject("Page").getJSONArray("media");
            SharedPreferences.Editor ed = sp.edit();
            long next = Long.MAX_VALUE;
            for (int i = 0; i < media.length(); i++) {
                JSONObject m = media.getJSONObject(i);
                int id = m.getInt("id");
                JSONObject na = m.optJSONObject("nextAiringEpisode");
                int aired = -1;
                if (na != null) {
                    aired = na.getInt("episode") - 1;
                    long at = na.getLong("airingAt");
                    if (at < next) next = at;
                } else if ("FINISHED".equals(m.optString("status")) && !m.isNull("episodes")) {
                    aired = m.getInt("episodes");
                }
                if (aired < 1) continue;
                int last = sp.getInt("last_" + id, -1);
                if (last < 0) { ed.putInt("last_" + id, aired); continue; }
                if (aired > last) {
                    String title = titles.optString(String.valueOf(id), "");
                    if (title.isEmpty()) {
                        JSONObject t = m.getJSONObject("title");
                        title = t.isNull("english") ? t.optString("romaji") : t.optString("english");
                    }
                    String what = aired - last == 1 ? "Episode " + aired + " is out" : "Episodes " + (last + 1) + "–" + aired + " are out";
                    notify(ctx, id, title, what + " 🎉");
                    ed.putInt("last_" + id, aired);
                }
            }
            ed.apply();
            scheduleExact(ctx, next);
            return Result.success();
        } catch (Exception e) {
            return Result.success();   // try again on the next scheduled check
        }
    }

    private static String post(String url, String json) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(15000);
        c.setReadTimeout(15000);
        c.setRequestMethod("POST");
        c.setDoOutput(true);
        c.setRequestProperty("Content-Type", "application/json");
        c.setRequestProperty("Accept", "application/json");
        try (OutputStream o = c.getOutputStream()) { o.write(json.getBytes(StandardCharsets.UTF_8)); }
        try (InputStream in = c.getInputStream()) {
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) b.write(buf, 0, n);
            return b.toString("UTF-8");
        } finally { c.disconnect(); }
    }

    static void notify(Context ctx, int id, String title, String text) {
        if (Build.VERSION.SDK_INT >= 33 && ctx.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return;
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 26 && nm.getNotificationChannel(CHANNEL) == null) {
            nm.createNotificationChannel(new NotificationChannel(CHANNEL, "New episodes and chapters", NotificationManager.IMPORTANCE_HIGH));
        }
        Intent open = new Intent(ctx, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(ctx, id, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        android.app.Notification.Builder b = Build.VERSION.SDK_INT >= 26
                ? new android.app.Notification.Builder(ctx, CHANNEL)
                : new android.app.Notification.Builder(ctx);
        b.setSmallIcon(R.drawable.ic_notif).setContentTitle(title).setContentText(text)
                .setAutoCancel(true).setContentIntent(pi).setColor(0xFFEC4899);
        nm.notify(id, b.build());
    }
}
