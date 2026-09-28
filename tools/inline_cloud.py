"""Copies web/cloud.js into both apps (between the CLOUD markers) so each works offline on its own.
Run after editing cloud.js:  python3 tools/inline_cloud.py"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = (root / "web/cloud.js").read_text()
for page in ["web/index.html", "web/anime/index.html"]:
    p = root / page
    s = p.read_text()
    block = "<script>/*CLOUD-START*/\n" + src + "/*CLOUD-END*/</script>\n"
    if "/*CLOUD-START*/" in s:
        s = re.sub(r"<script>/\*CLOUD-START\*/.*?/\*CLOUD-END\*/</script>\n", lambda m: block, s, flags=re.S)
    else:
        i = s.index("<script>\n") if "<script>\n" in s else s.index("<script>")
        s = s[:i] + block + s[i:]
    p.write_text(s)
    print("inlined into", page)
