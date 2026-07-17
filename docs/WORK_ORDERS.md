# 작업지시서 — 다음 버전 (A → B → C)

> 규칙: 순서대로 진행. 각 작업 = 별도 세션 + 별도 커밋. 이전 작업 배포 검증 후 다음 착수.
> 공통 제약: 데이터·핀 수 축소 금지. 지시 범위 밖 변경 금지. PROJECT_BRIEF.md 참조.

---

## A. 버그·소형 UX 3건 — ✅ 완료 (2026-07-17 `fc90c15`, v=20260714o 배포)

버그·소형 UX 수정. 다른 변경 금지.

1. 칩바 스크롤 시 지도 팬 딸림:
   상단 오버레이 칩바와 하위 칩바 컨테이너 요소에
   `L.DomEvent.disableScrollPropagation(el)` + `L.DomEvent.disableClickPropagation(el)` 적용.
   기존 `touch-action:pan-x`는 유지.

2. 하위칩 도트 테두리화 롤백:
   style.css의 `.msub-chip.dim .msub-dot{background:transparent}` 삭제.
   비선택(dim) 상태에서 도트는 채운 색 유지, 흐림 처리는 태그 박스
   (`.msub-tag`의 테두리/색 변경)만 담당.

3. 격리(하위 하나만 보기) 시 비선택 마커 완전 숨김:
   - 현재 dimMarker의 투명도 0.22 처리를 제거하고, 격리 활성 시 비선택
     마커는 지도에서 제거(또는 opacity 0 + 완전 비인터랙티브)로 변경.
   - 비선택 마커가 클릭/터치를 가로채지 않아야 함 — 선택 하위의 마커만
     탭 가능. divIcon 마커와 circleMarker 양쪽 모두 적용.
   - 격리 해제 시 전부 복원, 필터 상태·줌 전환과 충돌 없어야 함.
   - 지도 마커만 변경. 범례/칩의 dim 표현(테두리 방식)은 그대로 유지.

검증: 모바일에서 칩바 가로 스와이프 시 지도 안 움직임,
칩 탭은 정상 동작, dim 도트가 채워진 채 표시.
격리 시 비선택 마커 화면에서 사라지고 선택 마커만 탭 가능,
격리 해제 시 전부 복원.

---

## B. 오버레이 레지스트리 리팩터 — ✅ 완료 (2026-07-18, v=20260718a 배포)

완료 요약: POI 8종(schools/hospitals/marts/restaurant/cafe/pubs/parks/admin)을
`POI_REG` 선언형 레지스트리 + 제네릭 4함수(ovBuild/ovApply/ovSetFilter/ovSetLayer)로 통합.
상태(layer/on/filter/markers)는 항목 내부. 기존 `setXLayer/setXFilter`는 얇은 래퍼로 유지(배선 무변경).
refreshPoiZoom·applyLang 재빌드는 레지스트리 루프. `sub-*` 이벤트명 8종 동일 확인(JS 캡처 검증).
app.js 1276→1173줄. sight/facility/shopping/transit/suburb 특례는 그대로.
검증: 8종 마커수=데이터수, 특례 팝업(uni desc·병원 공공/사립·mart origins·rest cuisine·무명 park/admin),
격리 완전숨김+줌 11↔14 필터보존, 미니범례·모바일 칩바 dim, ko↔en 재빌드, 콘솔 에러 0.

원문 지시 (참고):

**세션 시작 시 커밋 먼저 (되돌릴 지점 확보).**

app.js 리팩터. 기능·외관 변화 0이어야 함. 순수 구조 개선.

현황: 오버레이 11종(schools/hospitals/marts/restaurant/cafe/pubs/parks/
shopping/sight/facility/admin)마다 buildXLayer/setXLayer/applyXFilter/
setXFilter 4종 함수 + 전역변수(xOn/xLayer/xFilter/xMarkers)가 거의 동일
패턴으로 복붙되어 있고, refreshPoiZoom()에 같은 if 블록 11개 반복.

목표:
1. 오버레이 정의를 선언형 레지스트리로 통합. 각 항목:
   `{id, data 소스, colorMap, cat(글리프), pane, popup/tooltip 생성 함수, 하위분류 키 목록}`
2. 제네릭 함수 4개(buildLayer/setLayer/applyFilter/setFilter)가 레지스트리
   항목을 받아 처리. 상태(on/layer/filter/markers)는 레지스트리 항목 안에.
3. refreshPoiZoom()은 레지스트리 순회 한 개 루프로 축소.
4. 기존 OVERLAYS 배열(좌측 패널용)도 이 레지스트리로 흡수하거나 참조.
5. 특례 유지: 대중교통(원 기호, 별도 로직), 서버브 경계, 큐레이트 대학
   팝업(uniPopupHtml) 등 오버레이별 커스텀 팝업은 레지스트리의 함수 필드로
   주입 — 하드코딩 분기 금지.

제약:
- 데이터 파일(data-*.js) 수정 금지.
- 줌 전환 시 필터 상태 보존 동작 유지.
- 격리(dim) 동작, 미니범례, 모바일 칩바 렌더링 동일하게 유지.

검증: 리팩터 전후 각 오버레이 켜기/하위필터/줌 11↔13 전환/격리 표시를
전부 눈으로 대조. 콘솔 에러 0.

### 구현 설계 (2026-07-17 사전 분석 — 다음 세션 시작점)

대상 = POI 오버레이 8종만: schools/hospitals/marts/restaurant/cafe/pubs/parks/admin.
(sight·facility는 이미 buildMarkerLayer/applyMarkerFilter로 반쯤 제네릭 — 그대로 두거나 나중에 흡수.
 shopping=단일 필터없음, suburb·transit=특례 → 손대지 않음.)

**레지스트리 항목 필드**: `{id, cat(글리프), pane, color(색맵), types[], def(기본키), maxWidth?, data:()=>[items], label:(item)=>sub문자열, popup?:(item)=>html, nameOf?:(item)=>표시명}`
- 상태는 항목 내부: `layer,on,filter,markers` (초기화 루프로 주입).
- popup 없으면 제네릭이 `simplePopup(nameOf||item.n, label)` 사용. school/hospital만 popup 함수 필요.
- 오버레이별 특이점(반드시 보존): **school**=SCHOOLS+CURATED_UNIS(uni는 t:'u', 팝업 uniPopupHtml) / **hospital**=HOSPITALS+MEDICAL 병합, medPopupHtml(공공·사립 own) / **mart**=intl+origins 라벨 / **rest**=cuisineLabel 붙는 라벨 / **park·admin**=무명 항목 nameOf=n||라벨.

**제네릭 4함수**: ovBuild(r)/ovApply(r)/ovSetFilter(r,t)/ovSetLayer(r,on). track 이벤트명은 `'sub-'+r.id+'-'+t` — **id를 schools/hospitals/marts/restaurant/cafe/pubs/parks/admin로 두면 현재 이벤트명과 정확히 일치**(애널리틱스 연속성 유지).

**협응 필수(빠뜨리면 깨짐)**:
1. 옛 8종 `let 상태 + buildX + applyX + setXFilter + setXLayer` **삭제**. 단 **`X_COLOR` const·`createPane` 호출·팝업헬퍼(schoolPopupHtml/uniPopupHtml/medPopupHtml/cuisineLabel/CUISINE)는 보존**(인터리브돼 있으니 주의).
2. **명명 충돌**: 옛 `setXLayer/setXFilter` 함수를 지운 뒤라야 동명 얇은 래퍼(const setSchoolLayer=on=>ovSetLayer(POI_REG.schools,on) 등) 선언 가능.
3. **상태 참조 재배선 6곳**: ① OVERLAYS 배열 get/set → `()=>POI_REG.x.on`/래퍼 ② refreshPoiZoom의 if 8개 → `Object.values(POI_REG).forEach(...)` 루프(sight/fac/shop은 별도 유지) ③ renderMiniLegend의 `if(xOn)`·`xFilter` → `POI_REG.x.on`·`.filter` ④ M_SUB의 `getF:()=>xFilter` → `.filter`(setF는 래퍼) ⑤ focusPoi의 `!xOn`·lay맵 `()=>xLayer` → reg ⑥ 언어재빌드 리스트 → reg 루프.
4. **getPois는 무변경**(데이터 배열 직접 참조, 상태 안 읽음).

**검증**: 8종 각각 켜기/팝업(특히 uni·hospital 공공사립·mart origins·rest cuisine)/하위필터/줌11↔14 점↔기호/격리(완전숨김)를 ko·en 양쪽 대조. `sub-*` 이벤트명 동일 확인. 콘솔 0.

---

## C. 성능 (B 완료 후) — ✅ 완료 (2026-07-18, v=20260718b 배포)

완료 요약:
1. **지연 로딩**: 초기 로드=data-i18n·data-geo(기본ON 경계)·data-core만(539KB, 이전 ~1047KB의 51%).
   나머지 11파일은 `OV_FILES` 맵 + `loadDataScript`(이중 주입 방지, 기존 ?v= URL 유지)로
   오버레이 첫 토글 시 주입. 칩 로딩 펄스(`.loading`). 실패 시 토스트+칩 원복.
   검색창 포커스 시 `ensureAllData()`로 전체 로드(인덱스 완전성, 로드 후 열린 검색어 재질의).
   딥링크 ?lga=·?color=는 eager 데이터만 사용 — 순서 문제 없음.
2. **뷰포트 컬링**: restaurant·parks·cafe(500+)에 `cull:true` — `ovCull()`이 bounds+패딩 1화면분만
   증분 add/remove(moveend). 격리 상태는 새로 들어온 마커에 즉시 적용. 데이터·마커 전량 보존.
   실측: 식당 z15 CBD 632/1391, 외곽 팬 시 64/1391만 DOM에.
3. **기호 전환 임계 차등**: 레지스트리 `zoomGlyph` — restaurant·parks 14, cafe 13, 나머지 기본 12.
   refreshPoiZoom이 항목별 교차한 것만 재생성. 검색 팝업은 `openRegMarkerAt`(컬링 밖 마커 강제 추가).
4. **좌표 절삭**: 스크립트 검사 결과 전 데이터 파일이 이미 5자리 이하(생성 시 절삭됨) — 무변경.

검증: 초기 네트워크 4파일 539KB(51%), 첫 토글 정상(로딩 표시→표시), 컬링 증분,
임계 차등(z13 식당 점·학교 기호), 격리+컬링 연동, 검색 전체 인덱스(4682)·cuisine 검색·자동 on+팝업,
transit·shopping 지연, ko↔en, 딥링크 — 전부 JS 단언 통과, 콘솔 에러 0.

원문 지시 (참고): 성능 개선. B의 레지스트리 구조 전제.

1. 데이터 지연 로딩:
   - 기본 ON인 것(서버브 경계 = data-geo 일부, data-core)만 초기 로드.
   - 나머지 data-*.js는 해당 오버레이 첫 토글 시 script 태그 동적 주입
     후 buildLayer 실행. 로딩 중 칩에 로딩 표시, 이중 주입 방지.
   - 레지스트리에 `{file:'data-restaurants.js', loaded:false}` 필드 추가.
   - 캐시버스팅 `?v=` 파라미터 동적 주입에도 적용.
   - 딥링크(`?lga=`)로 진입 시 필요한 데이터 로드 순서 보장.

2. 뷰포트 컬링:
   - 마커 수 500 이상인 오버레이(식당·공원·카페 등)는 현재 지도
     bounds(+여유 패딩 1화면분)에 들어오는 마커만 지도에 추가.
   - moveend/zoomend에서 증분 갱신(전체 재생성 금지 — 나간 것 제거,
     들어온 것 추가).
   - 격리(dim)·필터 상태는 컬링과 무관하게 일관 적용.
   - 데이터 자체는 전량 유지. 렌더만 제한.

3. 기호 전환 임계 차등:
   - 현재 전 오버레이 공통 ZOOM_GLYPH=12를 레지스트리 항목별 값으로 전환
     (기본 12 유지).
   - 마커 밀도 높은 오버레이(식당·공원·카페)만 13~14로 상향 — 해당 줌
     구간에서는 점(circleMarker)으로 표시. 데이터·핀 수 변화 없음.
   - refreshPoiZoom은 오버레이별 임계 기준으로 점↔기호 전환.

4. 좌표 절삭: 데이터 파일 위경도 소수점 5자리로 일괄 절삭(±1m).
   스크립트로 처리, 수동 편집 금지.

검증: 초기 로드 네트워크 총량 이전 대비 절반 이하, 식당+공원 동시 ON
상태에서 CBD 팬/줌 버벅임 개선, 오버레이 첫 토글 시 정상 표시,
딥링크 진입 정상.
