#!/usr/bin/env python3
"""Query-level: May-Jun vs Jul vs Aug — position trajectory + topic clusters (www only)."""
import json
import urllib.request
from urllib.parse import quote

from google.oauth2 import service_account
import google.auth.transport.requests

KEY = "/Users/darrellwang/.claude/ga4_gsc_service_account.json"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

creds = service_account.Credentials.from_service_account_file(KEY, scopes=SCOPES)
creds.refresh(google.auth.transport.requests.Request())
token = creds.token

BASE = "https://www.googleapis.com/webmasters/v3/sites/%s/searchAnalytics/query" % quote(
    "https://www.darrelltw.com/", safe="")


def api(body):
    req = urllib.request.Request(BASE)
    req.add_header("Authorization", "Bearer " + token)
    req.add_header("Content-Type", "application/json")
    req.data = json.dumps(body).encode()
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


def top(start, end):
    resp = api({"startDate": start, "endDate": end,
                "dimensions": ["query"], "rowLimit": 1000})
    return {r["keys"][0]: (r["clicks"], r["impressions"], r["position"])
            for r in resp.get("rows", [])}


WINDOWS = [("A", "2026-05-05", "2026-06-30", 57),
           ("B", "2026-07-01", "2026-07-31", 31),
           ("C", "2026-08-01", "2026-08-17", 17)]
data = {name: top(s, e) for name, s, e, d in WINDOWS}
days = {name: d for name, s, e, d in WINDOWS}


def cluster(q):
    ql = q.lower()
    if "n8n" in ql:
        return "n8n"
    if any(k in ql for k in ("claude", "cowork", "antigravity", "anthropic",
                             "gemini", "gpt", "openai", "chatgpt", "sora",
                             "mcp", "agent", "ai ", " ai", "llm", "grok")):
        return "AI 工具"
    if any(k in ql for k in ("ga4", "gtm", "analytics", "tag manager", "looker",
                             "search console", "utm", "martech", "cookie")):
        return "GA4/MarTech"
    if "apify" in ql or "爬蟲" in ql or "scrap" in ql:
        return "Apify/爬蟲"
    if "line" in ql:
        return "LINE"
    if "darrell" in ql:
        return "品牌"
    return "其他"


all_q = set(data["A"]) | set(data["B"]) | set(data["C"])

# Cluster aggregates
agg = {}
for q in all_q:
    c = cluster(q)
    a = agg.setdefault(c, {w: [0.0, 0.0, 0.0, 0.0] for w in "ABC"})  # clicks, impr, pos*impr, impr(for pos)
    for w in "ABC":
        cl, im, po = data[w].get(q, (0, 0, None))
        a[w][0] += cl
        a[w][1] += im
        if po is not None and im > 0:
            a[w][2] += po * im
            a[w][3] += im

print("CLUSTER  window  clicks/day  impr/day  wavg_pos")
for c, ws in sorted(agg.items(), key=lambda kv: -kv[1]["A"][0]):
    for w in "ABC":
        cl, im, pw, iw = ws[w]
        pos = pw / iw if iw else 0
        print("%-12s %s  %6.1f  %7.0f  %6.1f" % (c, w, cl / days[w], im / days[w], pos))

# Top losing queries: enough volume in A or B, ranked by clicks/day lost A->C
rows = []
for q in all_q:
    ca, ia, pa = data["A"].get(q, (0, 0, None))
    cb, ib, pb = data["B"].get(q, (0, 0, None))
    cc, ic, pc = data["C"].get(q, (0, 0, None))
    if ia / days["A"] < 0.3 and ib / days["B"] < 0.3:
        continue
    rows.append((ca / days["A"] - cc / days["C"], q, cluster(q),
                 ca / days["A"], cb / days["B"], cc / days["C"],
                 pa, pb, pc,
                 ia / days["A"], ib / days["B"], ic / days["C"]))
rows.sort(reverse=True)


def f(x):
    return "-" if x is None else "%.1f" % x


print("\nTOP LOSERS (clicks/day A->B->C | pos A->B->C | impr/day A->B->C)")
for d, q, c, ca, cb, cc, pa, pb, pc, ia, ib, ic in rows[:22]:
    print("%-38s [%s] clk %.2f->%.2f->%.2f | pos %s->%s->%s | impr %.0f->%.0f->%.0f"
          % (q[:38], c, ca, cb, cc, f(pa), f(pb), f(pc), ia, ib, ic))

print("\nTOP GAINERS")
for d, q, c, ca, cb, cc, pa, pb, pc, ia, ib, ic in rows[-8:]:
    print("%-38s [%s] clk %.2f->%.2f->%.2f | pos %s->%s->%s | impr %.0f->%.0f->%.0f"
          % (q[:38], c, ca, cb, cc, f(pa), f(pb), f(pc), ia, ib, ic))
