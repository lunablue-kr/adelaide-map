#!/usr/bin/env python3
# Overture 릴리스 간 소멸 추적 — 월 1회 실행 (LICENSE_REMEDIATION v6 STEP J)
# 우리가 채택한 gers_id가 새 릴리스에서 사라졌는지 확인.
# 3회 연속 부재 → 폐업 후보 (실측: 인접 릴리스 간 ID 이탈 3.5%라 1회 부재는 노이즈).
# 사용: python3 tools/track_vanish.py <릴리스, 예: 2026-08-20.0>
import duckdb, json, sys, os

REL = sys.argv[1] if len(sys.argv) > 1 else None
if not REL:
    sys.exit("사용법: python3 tools/track_vanish.py <release, e.g. 2026-08-20.0>")
STATE = 'docs/vanish-state.json'

mm = json.load(open('docs/migration-map.json', encoding='utf-8'))
gers = {k: v['gers'] for k, v in mm.items() if v.get('gers')}
state = json.load(open(STATE, encoding='utf-8')) if os.path.exists(STATE) else {}

con = duckdb.connect()
con.sql("INSTALL httpfs; LOAD httpfs; SET s3_region='us-west-2';")
con.sql("CREATE TABLE ours(id VARCHAR)")
con.executemany("INSERT INTO ours VALUES (?)", [(g,) for g in gers.values()])
present = {r[0] for r in con.sql(f"""
  SELECT o.id FROM read_parquet(
    's3://overturemaps-us-west-2/release/{REL}/theme=places/type=place/*', hive_partitioning=1) p
  JOIN ours o ON p.id=o.id
  WHERE p.bbox.xmin BETWEEN 138.3 AND 139.1 AND p.bbox.ymin BETWEEN -35.4 AND -34.5
""").fetchall()}

candidates = []
for key, g in gers.items():
    miss = state.get(g, {}).get('miss', 0)
    miss = 0 if g in present else miss + 1
    state[g] = {'miss': miss, 'last': REL}
    if miss >= 3:
        candidates.append(key)

json.dump(state, open(STATE, 'w'), ensure_ascii=False)
print(f"릴리스 {REL}: 존재 {len(present)}/{len(gers)} · 이번 부재 {len(gers)-len(present)}")
print(f"3회 연속 부재(폐업 후보): {len(candidates)}건")
for k in candidates: print(' -', k)
if candidates:
    print("\n→ 후보는 자동 삭제하지 말고 커뮤니티/현장 확인 후 처리할 것.")
