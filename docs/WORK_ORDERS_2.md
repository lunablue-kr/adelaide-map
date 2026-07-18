# 작업지시서 2 — E → D → F → G

> 규칙: 순서대로 진행. 각 작업 = 별도 세션 + 별도 커밋. 이전 작업 배포 검증 후 다음 착수.
> 공통 제약: 데이터·핀 수 축소 금지. 지시 범위 밖 변경 금지.
> 시각 디자인(팔레트 보정, 기호핀 테두리, 아이콘 등)은 이번 지시서에서 다루지 않음 —
> 페르소나 1차 구현 후 디자인 단계에서 일괄 진행 예정. 관련 수정 제안 금지.

---

## E. 성능 마감

1. 점 모드 렌더러 canvas 전환: circleMarker에 `L.canvas()` renderer 적용
   (POI pane별 캔버스). DOM 마커 → 캔버스 렌더로 팬/줌 성능 개선 목적.
2. ovCull 최적화: moveend/zoomend 핸들러 150ms 디바운스 + 새 bounds가
   직전 계산 bounds에 완전히 포함되면 재계산 스킵.
3. 컬링 패딩 pad(1) → pad(0.5).
4. 좌표 절삭: 전 data-*.js 위경도 소수점 5자리(±1m) 일괄 절삭.
   스크립트로 처리, 수동 편집 금지. 처리 후 파일 크기 감소 보고.
5. index.html의 data-geo.js에 `?v=` 캐시버스팅 추가 (다른 데이터 파일과 통일).
6. 어트리뷰션: `map.attributionControl.setPrefix(false)`로 Leaflet 접두어 제거.
   © OpenStreetMap © CARTO 표기는 유지(라이선스 의무), 폰트 크기 축소·반투명으로
   최소화만 허용.

검증: 식당+공원 동시 ON, CBD 팬/줌 버벅임 개선 체감. 줌 전환·격리·필터 회귀 없음.
콘솔 에러 0.

---

## D. 팝업 업그레이드

1. 제네릭 팝업 생성기에 하단 버튼 2개 추가 (전 POI 오버레이 공통, 커스텀 팝업 포함):
   - "구글맵": https://www.google.com/maps/search/?api=1&query=
     encodeURIComponent(이름 + ' ' + (서버브명 || 'Adelaide SA'))
   - "길찾기": https://www.google.com/maps/dir/?api=1&destination=lat,lng
   - target=_blank, rel=noopener. 모바일 바텀시트에도 동일 적용.
2. 데이터 스키마에 선택 필드 desc 지원 (한/영):
   - 항목에 desc 있으면 팝업 이름 아래 표시, 없으면 생략(레이아웃 변화 없음).
3. desc 시범 작성: 쇼핑 11곳 + Service SA 지점
   (Service SA desc 예: "면허 전환·차량 등록 필수 방문처 — 정착 1주차").
   Service SA가 검색에서 "Service SA"로 즉시 검색되는지 확인, 안 되면 별칭 추가.
4. 애널리틱스: 구글맵/길찾기 클릭 시 track('gmap-'+오버레이id).

검증: 오버레이 5종에서 버튼 동작(모바일 구글맵 앱 연결 포함),
desc 유/무 팝업 정상, 이벤트 집계 확인.

---

## F. 데이터 확장

전 신규 데이터에 기존 원칙 적용: OSM Overpass 추출 → 18개 LGA 경계 클립 →
구글맵/공식 소스 교차검증. 대량 추가 파일은 지연 로딩 체계에 편입.

1. 쇼핑 오버레이 3분할 (기존 단일 → 하위 3종):
   - 쇼핑센터: 기존 11곳 유지
   - 대형 리테일(정착 셋업): Bunnings·Kmart·Big W·Target·IKEA·Harvey Norman·
     JB Hi-Fi·Officeworks 메트로 지점 큐레이트. 각 체인 성격 desc 필수
     (예: "Kmart — 저가 잡화·주방·수납, 정착 초기 1차").
   - Op Shop(중고): OSM shop=charity (Vinnies·Salvos 등).
2. 공원·레저 하위 추가:
   - BBQ장: OSM amenity=bbq (공공 무료 전기 BBQ).
   - 수영장/아쿠아틱센터: 공공 위주 큐레이트.
   - 놀이터: OSM leisure=playground. 공원 내부 + 대형(regional) 합집합,
     학교 부속·주거단지 내부는 제외.
3. 의료 오버레이:
   - 병원 하위를 응급/일반으로 분리: 응급실 운영 병원에 ed:true
     (SA Health 공식 목록 대조 — RAH·Flinders·Lyell McEwin·Modbury·
     Women's & Children's·Noarlunga 등, 반드시 공식 재확인).
     팝업에 "🚑 24시간 응급실" 뱃지 표시.
   - 동물병원 하위 추가: OSM amenity=veterinary.
4. 생활·행정:
   - 경찰서: 기존 관공서 데이터에 이미 있는지 확인 후, 없으면 하위 추가.
   - 세탁방(laundrette): OSM shop=laundry.

검증: 신규 하위 각각 토글·필터·격리·팝업 정상, 기존 오버레이 회귀 없음,
지연 로딩 편입 확인.

---

## G. 러닝코스 오버레이 (마지막, 반드시 별도 세션)

폴리라인 기반 신규 오버레이. 데이터 가공 비중 큼.

1. 코스 큐레이트 10~15개: Torrens Linear Park(구간 분할 가능)·Coast Park·
   파크랜즈 순환·Sturt River Trail·Marino Rocks Greenway·Westside Bikeway 등.
2. 코스별 속성:
   - 거리(km)
   - 노면: 포장/비포장 (Adelaide City Council "Bike and Pedestrian Paths"
     데이터 + OSM surface 태그)
   - 누적 고저차: ELVIS(elevation.fsdf.org.au) DEM 1회 다운로드 후 오프라인
     산출, 결과 수치만 데이터에 내장
   - 야간/새벽 가능 여부: ACC Public Lighting Network + OSM lit 태그 참고,
     불확실하면 미표기(추후 실사용 검증)
   - 화장실·음수대 인접: 기존 공원·레저 데이터 교차 참조
3. 표현: 폴리라인 + 탭 시 속성 팝업. 줌 라벨·격리 등 기존 문법 준수.
4. 데이터는 별도 파일로 분리, 지연 로딩 편입.

검증: 각 코스 폴리라인 정확성(실제 경로 대조), 속성 팝업, 모바일 탭 동작.
