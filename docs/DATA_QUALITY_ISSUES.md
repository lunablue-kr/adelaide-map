# 데이터 품질 이슈 — 3차 패스 (2026-07-20) · **1~2단계 완료**

## ✅ 처리 결과 (커밋 5521e7d·3ed213a·8d26101·cf22449·ec12485)
**근본원인 중 2개는 데이터가 아니라 코드 버그였음:**
- `hospitals` 레지스트리 data 매퍼만 spread를 안 써서 **pid를 흘림** → 의료 333곳이 좌표링크로 열림. 사용자가 "핀 위치가 달라 매칭 안 됨"으로 인지한 증상의 실체. **Place Details 대조 결과 좌표 60m 초과 0건 = 핀 위치는 원래 정확했음.**
- 서버브는 `nearestSub()` 중심점최근접 → **point-in-polygon(even-odd)** 교체로 해결.

**Place Details 전수조회 4,054건 전부 성공. 적용:** 정식명칭 788 · 서브타입 768 · 요리 575 · 오버레이 이동 188 · 중복마커 삭제 88 · 의심pid 제거 115 · 과매칭pid 11 · 폐업 2.
- 의심 pid = 1·2차 이름검색 오매칭(`Café Bang Bang`→힌들리st 경찰서, `Tram Time Coffee`→Entertainment Centre). 제거해 엉뚱한 장소 링크 차단.
- 중복 마커 88건은 OSM 단계부터 있던 것(좌표·이름 동일). 이번에 발견·정리.
- 아포스트로피 이름 손상은 **이스케이프 인식 정규식**(`"(?:[^"\\]|\\.)*"`)으로 원천 차단 — 과거 버그 재발 없음 확인.

## ⛔ 남은 것 + API 한도 주의
**Text Search 무료한도(5,000/월) 이미 초과**: 1차 4,922 + 2차 607 = 5,529. 추가 Text Search는 **과금**(~$32/1000) → 사용자 승인 필요. Place Details는 별도 SKU라 4,054/5,000 사용, ~946 무료 잔여(단 place_id 있어야 씀).
1. **pid 없는 항목 재매칭** — Seaford Homestyle Roadhouse(폐업인데 잔존)·Olive Grove Wetlands 등. Text Search 필요 → **다음 달 한도 리셋 후** 또는 승인 후.
2. **명소 확장** — 페스티벌 센터·Moana Drive-On Beach 누락. 근본 원인은 명소·시설 데이터가 `data-lga.js` MARKERS **15개뿐**이고 스키마가 달라(`name/lat/lng`) 1~3차 배치가 아예 건너뜀. 관광명소 타입 스윕으로 확장 필요(Text Search/Nearby → 과금 대상).

---
# (원본 작업지시 — 2026-07-20 사용자 실기기 점검)

사용자가 실기기로 스팟체크해 발견. **"내가 찾은 건 일부"** — 전수 재처리 필요.

## 발견 사례 (재현·검증용)
| # | 우리 맵 | 구글 | 문제 |
|---|---|---|---|
| 1 | AdelaideVet Goodwood Road (동물병원) | 같은 이름 존재 | 핀 오차로 미매칭 → gmap이 좌표(-34.97373,138.59179)로만 열림 |
| 2 | Nammi Vietnamese Sturt Road = **카페** | 베트남 음식점 | 분류 오류(카페→식당·베트남) |
| 3 | BWS Ascot Park 팝업 서버브 = **Park Holme** | 729 Marion Rd, **Ascot Park** 5043 | 서버브 오표기(지도 라벨도 Ascot Park) |
| 4 | (없음) | 애들레이드 페스티벌 센터(아트센터, 3122리뷰) | 명소 누락 |
| 5 | 대학교 마커 | Flinders University City Campus 바로 옆 | 좌표 오류로 미매칭 |
| 6 | Seaford Homestyle **Bakery** | Seaford Homestyle **Roadhouse** · **폐업함** | 개명 미반영 + 폐업 미삭제 |
| 7 | (없음) | Moana Drive-On Beach(관광명소 4.8) | 해변 명소 누락 |
| 8 | Sip'n Save | Sip'n Save O'Sullivan Beach Liquor Store | 개명 미반영 |
| 9 | Ocean Garden Chinese Restaurant = **기타** | Ocean Garden · **중국 음식점** | 요리분류 오류(이름에 Chinese 있는데도) |
| 10 | Olive Grove | Olive Grove Wetlands | 개명 미반영 |

## 근본 원인
1. **매칭 전략** — 1·2차는 좌표 반경(120m/60m)+이름일치. 좌표 오차 큰 것·이름 다른 것 영구 미매칭.
2. **분류** — OSM 태그 의존. 구글 `primaryType`/`types` 미사용 → 카페/식당·요리종류 오분류.
3. **서버브** — `nearestSub()`가 폴리곤 **중심점 최근접**. 불규칙 형상서 오답. point-in-polygon 아님.
4. **개명 규칙 과보수** — startswith·ratio≥0.82·길이제한으로 정당한 개명 다수 탈락.
5. **폐업 검사가 이름검색 기반** — 이름 다르면 폐업 못 잡음.
6. **명소 커버리지** — OSM 큐레이트 한정, 구글 관광명소 타입 스윕 미실시.

## 3차 패스 계획 (핵심: 추측 검색 → place_id 직접조회)
1. **pid 보유 전수 Place Details 재조회**(≈3,900건, 무료한도 5,000/월 내). FieldMask: `id,displayName,businessStatus,formattedAddress,location,primaryType,types`(Pro tier — rating/reviews 절대 금지).
   → 폐업 자동삭제 · 정식명칭 · 좌표보정 · **서버브(formattedAddress)** · **분류(primaryType)** 한 번에 해결.
2. **pid 미보유 재매칭** — 반경 의존 버리고 **"이름 + 서버브/도로명" 텍스트쿼리**로 전환. 여전히 안 되면 수동 리스트.
3. **서버브 로직 교체** — 중심점최근접 → **point-in-polygon**(`_places-batch/cliplib.py` 재사용), 실패 시 최근접 폴백. 매칭된 곳은 구글 주소 우선.
4. **분류 매핑표 작성** — 구글 primaryType → 우리 오버레이·서브타입·요리(cuisine). 예: `vietnamese_restaurant`→식당/아시안/베트남, `chinese_restaurant`→식당/아시안/중국, `cafe`→카페.
5. **누락 명소 스윕** — searchNearby 타입별(`tourist_attraction`,`performing_arts_theater`,`beach`,`art_gallery`,`museum` 등) LGA 범위 훑어 미보유 발굴 → 검토 후 추가.

## 주의 (기존 교훈 준수)
- 이름 일괄치환 후 **전 data-*.js `jsc` 문법검사 필수**(아포스트로피 버그).
- 좌표 교체 정규식은 **키 따옴표 보존**(`"ll":` vs `ll:` — data-shops.js 형식 다름).
- 구글 '폐업함'이면 **삭제**(사용자 철칙).
- 파이프라인·스크립트는 `_places-batch/`(HANDOFF.md 참조).
