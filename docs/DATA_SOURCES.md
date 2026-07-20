# 지도 데이터 소스 맵 (교차대조용) — 2026-07-20 조사

철칙: **단일 소스 신뢰 금지.** OSM도 구글도 단독 금지. 접근 가능한 신뢰 소스를 최대한 교차대조해 신뢰도를 높인다. 소스가 엇갈리면 "무엇에 어느 소스가 권위 있나"로 판정.

## 지금 바로 무료로 쓸 수 있는 것 (전부 CC BY 계열 → 공개 웹지도 게시 가능, 출처표기 의무)

| 소스 | 용도 | 접근 | 라이선스 | 실측 |
|---|---|---|---|---|
| **National Public Toilet Map** | 화장실·음수대 정본 | data.gov.au/data/dataset/national-public-toilet-map (CSV 11.9MB) | CC BY 3.0 AU (공개게시 명시 허용) | SA **2,163건 전건 lat/lon**, DrinkingWater 플래그 |
| **SA Gov Education Sites** | 학교 정본(공립) | dptiapps.com.au/dataportal/GovernmentEducationSites_geojson.zip (386KB, 인증X) | CC BY 4.0 | **1,259 Point**, 매일 갱신, site_type/closed_date |
| **SA Public/Private Hospitals** | 병원·응급실 정본 | dptiapps.com.au/dataportal/PublicHospitals_geojson.zip (+ PrivateHospitals) | CC BY 4.0 | 공립73+사립50=**123**, emergency 플래그 |
| **Overture Maps places** | 구글 교차검증(전역) | S3 `s3://overturemaps-us-west-2/release/<REL>/theme=places/type=place/*` (익명 200) | CDLA Permissive 2.0 (share-alike 없음) | confidence·operating_status·sources 필드. duckdb+httpfs로 bbox 쿼리 |
| **data.sa.gov.au (CoA POI)** | 음수대124·화장실25·BBQ43·놀이터 등 | CKAN `data.sa.gov.au/data/api/3/action/package_search` (경로에 /data/ 필수) | CC BY 4.0 | ⚠️ CSV는 EPSG:3857 — SHP/KMZ 써야 좌표 안 깨짐 |
| **ABS ASGS SAL/SA2 경계** | 서버브 경계 정본 | abs.gov.au ASGS digital boundary files (SHP zip) | CC BY 4.0 | ⚠️ **Ed.4가 2026-07-22부터 순차공개** — SAL 갱신 시 우리 폴리곤 영향 |
| **G-NAF (전체, data.gov.au)** | 주소·서버브 검증 | data.gov.au G-NAF (SA_ 파일만 로드) | CC BY 4.0 기반 EULA(우편용도 제한) | 5GB, 주소 15M+, 4개 지오코드 테이블 |
| **Wikidata SPARQL** | 명소 확장·한국어명 | query.wikidata.org/sparql (무료·인증X, 200 확인) | CC0 | 애들레이드 광역 명소 44(해변 12), 일부 한국어 라벨 |
| **OSM Overpass** | 대량 베이스·명소 보완 | overpass.kumi.systems 등 (overpass-api.de는 504 잦음) | ODbL(출처표기+share-alike) | 명소류 123(attraction63·museum41) |

## 못 쓰거나 유료
- **ACARA / My School** — School Location에 좌표 있으나 약관 6.4가 **공개 웹사이트 게시 금지**. 사용 불가.
- **ATDW / SATC** — 유료(셋업 A$165~660, 관광업계 자격 게이팅). 명소는 OSM+Overture+Wikidata 조합으로 대체.
- **AIHW MyHospitals** — Cloudflare 봇차단, 확인 실패(SA Health로 충분).
- **opendata.adelaidecitycouncil.com** 403.

## 우리 약점 → 정본 매핑
- 화장실·음수대(현 OSM단독) → **National Public Toilet Map** 정본, CoA drinking-fountains로 도심 보완
- 학교 → **SA 교육부**(공립). 사립·가톨릭은 별도 보완 필요
- 병원·응급실 → **SA Health** 공립+사립. 기존 수동 `ed:1` 7곳과 대조 검증
- 명소(현 15개) → OSM `tourism=*` + Overture 관광카테고리 + Wikidata
- 구글 오매칭·폐업 → **Overture** confidence/operating_status로 교차검증

## 구현 주의
1. **출처표기 필수** — 통합 시 지도에 CC BY 표기 추가(현 어트리뷰션에 SA Gov / Commonwealth / SA Health / Dept for Education).
2. **CoA CSV 좌표 EPSG:3857** — 변환 없으면 깨짐. SHP/KMZ 우선.
3. **정본 vs 구글 대조** — 학교·병원은 정부가 정본. BBQ·화장실 등 시설물의 폐쇄 여부는 구글 대조가 여전히 유용.
4. Overture 읽기엔 `duckdb`+httpfs+spatial 필요(이 프로젝트에 설치됨).
