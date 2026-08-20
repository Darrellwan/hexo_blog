#!/usr/bin/env python3
"""n8n rescue list: striking-distance queries + owning pages, before vs now."""
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


def qp(start, end):
    resp = api({"startDate": start, "endDate": end,
                "dimensions": ["query", "page"], "rowLimit": 1000,
                "dimensionFilterGroups": [{"filters": [
                    {"dimension": "query", "operator": "contains", "expression": "n8n"}]}]})
    out = {}
    for r in resp.get("rows", []):
        q, p = r["keys"]
        out[(q, p)] = (r["clicks"], r["impressions"], r["position"])
    return out


before = qp("2026-05-05", "2026-06-30")   # 57d
now = qp("2026-07-15", "2026-08-17")      # 34d

# Striking distance: still shown now at pos 4-25, or used to have real volume
print("QUERY | PAGE | before(impr, pos) -> now(impr, pos)")
rows = []
for (q, p), (bc, bi, bp) in before.items():
    nc, ni, np_ = now.get((q, p), (0, 0, None))
    rows.append((bi, q, p, bi, bp, ni, np_))
# add pairs only present now
for (q, p), (nc, ni, np_) in now.items():
    if (q, p) not in before and ni >= 5:
        rows.append((ni, q, p, 0, None, ni, np_))
rows.sort(reverse=True)


def f(x):
    return "-" if x is None else "%.1f" % x


for _, q, p, bi, bp, ni, np_ in rows[:35]:
    if bi < 10 and ni < 5:
        continue
    print("%-32s %-52s %4d @%s -> %4d @%s"
          % (q[:32], p.replace("https://www.darrelltw.com", "")[:52], bi, f(bp), ni, f(np_)))

# Page-level n8n impressions before vs now
pages_b, pages_n = {}, {}
for (q, p), (c, i, pos) in before.items():
    pages_b[p] = pages_b.get(p, 0) + i
for (q, p), (c, i, pos) in now.items():
    pages_n[p] = pages_n.get(p, 0) + i
print("\nPAGE n8n-impr/day before -> now")
for p in sorted(pages_b, key=lambda x: -pages_b[x])[:15]:
    print("%-60s %6.1f -> %6.1f"
          % (p.replace("https://www.darrelltw.com", "")[:60],
             pages_b[p] / 57, pages_n.get(p, 0) / 34))
