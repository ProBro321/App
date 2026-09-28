package com.probro.wallet;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.webkit.WebResourceErrorCompat;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * The Wallet app loads its screens from the GitHub page, so every change pushed to the repo
 * reaches the phone the next time the app is opened — no reinstall. The page keeps an offline
 * copy (service worker), and all money data stays in this phone's storage.
 *
 * Earlier versions ran a bundled copy at appassets.androidplatform.net. On the first launch of
 * this version, that data is read once and moved into the online app automatically.
 */
public class MainActivity extends Activity {
    private static final int REQ_OPEN = 1;
    private static final int REQ_SAVE = 2;
    private static final String APP_HOST = "probro321.github.io";
    private static final String APP_URL = BuildConfig.APP_URL;
    private static final String OLD_URL = "https://appassets.androidplatform.net/assets/index.html";
    private static final String KEY = "darkgames_wallet_v2";

    private WebView web;
    private ValueCallback<Uri[]> fileCallback;
    private String pendingContent;
    private SharedPreferences prefs;
    private String migrateValue;      // old data waiting to be moved, as a JS string literal
    private boolean readingOld;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences("wallet", MODE_PRIVATE);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#0B0B12"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);

        web.setWebViewClient(new WebViewClientCompat() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (APP_HOST.equals(u.getHost()) || "appassets.androidplatform.net".equals(u.getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (readingOld && url != null && url.startsWith(OLD_URL)) {
                    readingOld = false;
                    view.evaluateJavascript("localStorage.getItem('" + KEY + "')", value -> {
                        if (value != null && !"null".equals(value) && value.length() > 2) migrateValue = value;
                        else prefs.edit().putBoolean("migrated", true).apply();
                        view.loadUrl(APP_URL);
                    });
                    return;
                }
                if (migrateValue != null && url != null && url.startsWith(APP_URL)) {
                    String js = "(function(){var k='" + KEY + "';try{var o=JSON.parse(localStorage.getItem(k));"
                            + "if(o&&o.setup&&o.tx&&o.tx.length)return 'kept';}catch(e){}"
                            + "localStorage.setItem(k," + migrateValue + ");return 'moved';})()";
                    view.evaluateJavascript(js, result -> {
                        migrateValue = null;
                        prefs.edit().putBoolean("migrated", true).apply();
                        if ("\"moved\"".equals(result)) view.reload();
                    });
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceErrorCompat error) {
                if (request.isForMainFrame() && request.getUrl().toString().startsWith(APP_URL)) showOffline();
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("*/*");
                try {
                    startActivityForResult(Intent.createChooser(i, null), REQ_OPEN);
                } catch (Exception e) {
                    fileCallback = null;
                    return false;
                }
                return true;
            }
        });

        web.addJavascriptInterface(new Bridge(), "AndroidBridge");
        setContentView(web);

        if (savedInstanceState != null) {
            web.restoreState(savedInstanceState);
        } else if (BuildConfig.MIGRATE_OLD && !prefs.getBoolean("migrated", false)) {
            readingOld = true;          // first launch of this version: pick up the old data
            web.loadUrl(OLD_URL);
        } else {
            web.loadUrl(APP_URL);
        }
    }

    private void showOffline() {
        String html = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1'></head>"
                + "<body style='margin:0;background:#0b0b12;color:#f2f1f6;font-family:sans-serif;display:flex;"
                + "flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;padding:24px;box-sizing:border-box'>"
                + "<div style='font-size:22px;font-weight:800;margin-bottom:10px'>Connect to the internet once</div>"
                + "<div style='color:#8d8ca0;font-size:15px;line-height:1.5;margin-bottom:6px'>The app needs internet the first time it opens after installing or updating. After that it works offline.</div>"
                + "<div dir='rtl' style='color:#8d8ca0;font-size:15px;line-height:1.5;margin-bottom:24px'>האפליקציה צריכה אינטרנט בפתיחה הראשונה. אחר כך היא עובדת גם בלי.</div>"
                + "<a href='" + APP_URL + "' style='background:#7c6cf0;color:#fff;text-decoration:none;font-weight:800;padding:14px 28px;border-radius:14px'>Try again · נסו שוב</a>"
                + "</body></html>";
        web.loadDataWithBaseURL(null, html, "text/html", "utf-8", null);
    }

    /** Called from the web app to save a backup or CSV through Android's Save dialog. */
    public class Bridge {
        @JavascriptInterface
        public void saveFile(final String name, final String content, final String mime) {
            runOnUiThread(() -> {
                String current = web.getUrl();
                if (current == null || !APP_HOST.equals(Uri.parse(current).getHost())) return;
                pendingContent = content;
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType(mime == null || mime.isEmpty() ? "application/octet-stream" : mime);
                i.putExtra(Intent.EXTRA_TITLE, name);
                try {
                    startActivityForResult(i, REQ_SAVE);
                } catch (Exception e) {
                    pendingContent = null;
                    notifySaved(false);
                }
            });
        }
    }

    private void notifySaved(boolean ok) {
        web.evaluateJavascript("window.onFileSaved&&window.onFileSaved(" + ok + ")", null);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_OPEN) {
            if (fileCallback != null) {
                Uri[] result = null;
                if (resultCode == RESULT_OK && data != null && data.getData() != null) {
                    result = new Uri[]{data.getData()};
                }
                fileCallback.onReceiveValue(result);
                fileCallback = null;
            }
        } else if (requestCode == REQ_SAVE) {
            String content = pendingContent;
            pendingContent = null;
            if (resultCode != RESULT_OK || data == null || data.getData() == null || content == null) return;
            boolean ok = false;
            try (OutputStream out = getContentResolver().openOutputStream(data.getData(), "wt")) {
                if (out != null) {
                    out.write(content.getBytes(StandardCharsets.UTF_8));
                    ok = true;
                }
            } catch (Exception ignored) { }
            notifySaved(ok);
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        web.evaluateJavascript("(window.appBack?window.appBack():false)", value -> {
            if (!"true".equals(value)) MainActivity.super.onBackPressed();
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }
}
