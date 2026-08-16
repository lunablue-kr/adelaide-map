# 배경 타일 교체 준비 (STEP I) — 사용자 결정 필요

현재: `basemaps.cartocdn.com` (CARTO light_all). 판정: 무료 이용 조건 밖(grantee 한정) → 교체 필요. 마감 사안 아님.

## 왜 지금 안 바꿨나
무료 대안 전부 **사용자 본인 계정의 API 키**가 필요하다 (계정 생성은 본인이 해야 함).

## 선택지 (권장순)

| 제공자 | 무료 한도 | 키 | 룩앤필 | 작업량 |
|---|---|---|---|---|
| **Stadia Maps** (Alidade Smooth) | 20만 크레딧/월, 비상업 | 필요 — stadiamaps.com 가입 | CARTO light와 유사한 밝은 톤 | URL 1줄 |
| **MapTiler** (Basic/Bright) | 10만 타일/월 | 필요 — maptiler.com 가입 | 유사 | URL 1줄 |
| Protomaps 자체 호스팅 | 무제한(자체) | 불필요 | 스타일 직접 재현 | 반나절+ |

## 키 발급 후 교체 방법 (Stadia 예)

`app-core.js`의 L.tileLayer URL만 교체:
```js
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=YOUR_KEY',{
  attribution:'... © <a href="https://stadiamaps.com/">Stadia Maps</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom:19
}).addTo(map);
```
어트리뷰션의 CARTO 표기를 새 제공자로 바꾸고, LICENSE-DATA.md의 배경지도 절도 갱신할 것.
GitHub Pages는 키가 코드에 노출되므로 **도메인 제한(referrer restriction)을 키 설정에서 반드시 걸 것**.
