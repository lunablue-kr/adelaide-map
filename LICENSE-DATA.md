# 데이터 라이선스 고지 (Data License Notices)

이 프로젝트(애들레이드 지역 가이드 지도)가 사용하는 외부 데이터의 출처와 라이선스.

## 장소 (Places)

- **Overture Maps Foundation** — Places 테마 (릴리스 2026-07-22.0)
  https://overturemaps.org · 라이선스: [CDLA-Permissive-2.0](https://cdla.dev/permissive-2-0/)
  Overture Places는 다음 소스를 포함한다:
  - Meta 및 Microsoft 제공 데이터 (CDLA-Permissive-2.0)
  - **Foursquare OS Places** — Apache License 2.0
    NOTICE: Copyright 2024 Foursquare Labs, Inc. Licensed under the Apache License, Version 2.0.
    http://www.apache.org/licenses/LICENSE-2.0
  - AllThePlaces (CC0)
- 일부 장소 좌표·명칭은 **OpenStreetMap** 원본을 사용한다 (`docs/migration-map.json`의 `src:'osm'` 항목). © OpenStreetMap contributors, [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/)

## 경계·공원·교통 (Boundaries, Parks, Transit)

- **OpenStreetMap** — LGA·서버브 경계, 공원, 전철·트램·버스 노선과 정류장
  © OpenStreetMap contributors · [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/)
  https://www.openstreetmap.org/copyright
  ODbL 데이터는 자체 제작 콘텐츠와 분리된 파일(data-geo.js, data-core.js, data-transit-bus.js 등)로 유지된다.

## 통계 (Statistics)

- **임대료** — SA Government *Private Rental Report* 2026 Q1 (Rental Bond 등록 기반)
  https://data.sa.gov.au/data/dataset/private-rent-report · CC BY
- **치안** — SA Police 범죄 통계 2025-26
- **화장실** — National Public Toilet Map · CC BY 3.0 AU

## 배경 지도 (Basemap)

- 타일: **CARTO** basemaps (© CARTO) · 스타일 정의: [CartoDB/basemap-styles](https://github.com/CartoDB/basemap-styles) (CC-BY 4.0)
- 지도 라이브러리: [Leaflet](https://leafletjs.com) (BSD-2-Clause)

## 구글 지도 연결 (Google Maps links)

팝업의 구글맵 버튼은 Google `place_id` 를 사용한 **외부 링크**다. Google Maps 콘텐츠(좌표·명칭·평점 등)는 이 프로젝트에 저장·표시되지 않는다. place_id 저장은 Google Maps Platform 약관 §A.3(캐싱 예외)에 따른다.

---
검증 기록: `docs/migration-map.json`(장소별 출처), `docs/review-pending.json`(검수 보류) · 최종 갱신 2026-08-02
