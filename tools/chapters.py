#!/usr/bin/env python3
"""Builds chapters.json: the latest chapter of every manga / manhwa that had a release recently.

Websites can't call MangaUpdates directly (it blocks browsers), so this runs on GitHub every hour,
reads the public "latest releases" feed and saves a small index the Anime List page can load.
Nothing about anyone's personal list is involved: it indexes everything.
"""
import html, json, os, re, sys, time, urllib.request, datetime

OUT = sys.argv[1] if len(sys.argv) > 1 else "chapters.json"
API = "https://api.mangaupdates.com/v1/releases/days?include_metadata=true&perpage=100&page="
KEEP_DAYS = 150          # forget series with no release for this long
BACKFILL_DAYS = 45       # first run: how far back to read
MAX_PAGES = int(os.environ.get("MAX_PAGES", "900"))

def get(page):
    for attempt in range(5):
        try:
            req = urllib.request.Request(API + str(page), headers={"Accept": "application/json", "User-Agent": "anime-list-chapter-index"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:
            print("page", page, "attempt", attempt, e, flush=True)
            time.sleep(5 + attempt * 10)
    return None

def chnum(s):
    m = re.findall(r"\d+(?:\.\d+)?", str(s or ""))
    return int(max(float(x) for x in m)) if m else 0

def main():
    old = {}
    if os.path.exists(OUT):
        try:
            old = {e["i"]: e for e in json.load(open(OUT))["s"]}
        except Exception as e:
            print("could not read old index:", e)
    today = datetime.date.today()
    newest = max((e["d"] for e in old.values()), default="")
    stop = (datetime.date.fromisoformat(newest) - datetime.timedelta(days=2)).isoformat() if newest else (today - datetime.timedelta(days=BACKFILL_DAYS)).isoformat()
    print("have", len(old), "series; reading back to", stop, flush=True)
    pages = rows = 0; per_page = None
    for page in range(1, MAX_PAGES + 1):
        j = get(page)
        if not j or not j.get("results"): break
        pages += 1; per_page = j.get("per_page")
        oldest = "9999"
        for x in j["results"]:
            rec = x.get("record") or {}; ser = ((x.get("metadata") or {}).get("series") or {})
            sid, date, n = ser.get("series_id"), rec.get("release_date") or "", chnum(rec.get("chapter"))
            if date: oldest = min(oldest, date)
            if not sid or not date or not n or n > 5000: continue
            rows += 1
            e = old.setdefault(sid, {"i": sid, "t": "", "n": 0, "d": "", "a": 0, "ad": "", "ds": []})
            e["t"] = html.unescape(ser.get("title") or rec.get("title") or e["t"])
            if n > e["n"] or (n == e["n"] and (not e["d"] or date < e["d"])): e["n"], e["d"] = n, date
            if any("asura" in (g.get("name") or "").lower() for g in rec.get("groups") or []):
                if n > e["a"]: e["a"], e["ad"] = n, date
                e.setdefault("as", [])
                if date not in e["as"]: e["as"] = sorted(set(e["as"] + [date]), reverse=True)[:6]
            if date not in e["ds"]: e["ds"] = sorted(set(e["ds"] + [date]), reverse=True)[:6]
        if oldest < stop: break
        time.sleep(1.1)
    cut = (today - datetime.timedelta(days=KEEP_DAYS)).isoformat()
    series = [e for e in old.values() if e["d"] >= cut and e["t"]]
    series.sort(key=lambda e: e["i"])
    json.dump({"updated": datetime.datetime.utcnow().isoformat(timespec="seconds") + "Z", "pages": pages, "rows": rows, "per_page": per_page, "count": len(series), "s": series},
              open(OUT, "w"), ensure_ascii=False, separators=(",", ":"))
    print("pages", pages, "rows", rows, "series", len(series), "bytes", os.path.getsize(OUT))

main()
