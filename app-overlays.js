// ▓▓▓ OVERLAYS — POI렌더러·교통·팝업헬퍼·레지스트리·제네릭·바이브 ▓▓▓ (app-core→app-overlays→app-ui 순서 로드. 전역 스코프 공유; 뒤 파일이 앞 심볼 참조)
// ═══════════════ POI 공통 — 7색 팔레트 · 카테고리 기호 · 줌기반 점↔기호 ═══════════════
// 팔레트 규칙: 앞으로 모든 핀 색은 이 7색 안에서만 지정. 오버레이별 하위타입은 순차 배정.
const PALETTE=['#f87171','#fb923c','#facc15','#4ade80','#22d3ee','#60a5fa','#c084fc']; // 빨 주 노 초 시안 파 보
// 카테고리 기호(흰색 currentColor) — 볼드 솔리드 + 미세 악센트. 교통은 기호 없이 원만.
const GLYPHS={
  hospital:'<rect fill="currentColor" x="9.2" y="4" width="5.6" height="16" rx="1.6"/><rect fill="currentColor" x="4" y="9.2" width="16" height="5.6" rx="1.6"/>',
  school:'<path fill="currentColor" d="M12 5.2 21.2 9.8 12 14.4 2.8 9.8Z"/><path fill="currentColor" d="M7.4 11.7v3.4c0 1.3 2.06 2.35 4.6 2.35s4.6-1.05 4.6-2.35v-3.4L12 14Z"/><path fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" d="M21.2 10.2v4.3"/><circle fill="currentColor" cx="21.2" cy="15.2" r="1.2"/>',
  mart:'<path fill="currentColor" d="M7 8.4H20a1 1 0 0 1 .97 1.26l-1.42 5.4A1.5 1.5 0 0 1 18.1 16.2H9.4Z"/><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M3.6 5h2.2l3.6 11.2"/><circle fill="currentColor" cx="10.4" cy="18.8" r="1.55"/><circle fill="currentColor" cx="17.4" cy="18.8" r="1.55"/>',
  shopping:'<path fill="currentColor" d="M6.4 8h11.2a1 1 0 0 1 1 .92l.8 9.5A1.4 1.4 0 0 1 18 20H6a1.4 1.4 0 0 1-1.4-1.58l.8-9.5A1 1 0 0 1 6.4 8Z"/><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M9 8V6.6a3 3 0 0 1 6 0V8"/>',
  landmark:'<path fill="currentColor" fill-rule="evenodd" d="M9 4.8 7.8 7H4.5A1.5 1.5 0 0 0 3 8.5v9A1.5 1.5 0 0 0 4.5 19h15A1.5 1.5 0 0 0 21 17.5v-9A1.5 1.5 0 0 0 19.5 7h-3.3L15 4.8ZM12 16.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Z"/>',
  facility:'<path fill="currentColor" d="M12 3.4 3.2 8.1V10h17.6V8.1Z"/><path fill="currentColor" d="M5 11h2v6.4H5zM9.2 11h2v6.4h-2zM13.4 11h2v6.4h-2zM17.6 11h2v6.4h-2z"/><rect fill="currentColor" x="3.2" y="18.1" width="17.6" height="2.3" rx="0.5"/>',
  restaurant:'<path fill="currentColor" d="M6.3 3a.62.62 0 0 1 1.24 0v3.4a1.35 1.35 0 0 0 2.7 0V3a.62.62 0 0 1 1.24 0v3.4a2.6 2.6 0 0 1-1.97 2.52V21H8.27V8.92A2.6 2.6 0 0 1 6.3 6.4Z"/><path fill="currentColor" d="M15.7 3c1.27 0 1.97 1.9 1.97 4.8 0 2.1-.6 3.3-1.5 3.7V21h-1.24V3.08c.24-.05.5-.08.77-.08Z"/>',
  cafe:'<path fill="currentColor" d="M4 8.5h12.5v4.5a4.2 4.2 0 0 1-4.2 4.2H8.2A4.2 4.2 0 0 1 4 13Z"/><path fill="none" stroke="currentColor" stroke-width="1.7" d="M16.5 9.8h1.6a2.3 2.3 0 0 1 0 4.6h-1.6"/><rect fill="currentColor" x="4.2" y="18.6" width="12.1" height="1.9" rx="0.6"/><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M7.5 5.5V3.6M11 5.5V3.6"/>',
  pub:'<path fill="currentColor" d="M6 6.5h8.2v12.4a1.6 1.6 0 0 1-1.6 1.6H7.6A1.6 1.6 0 0 1 6 18.9Z"/><path fill="none" stroke="currentColor" stroke-width="1.7" d="M14.4 9h2.4a1.6 1.6 0 0 1 1.6 1.6v3.6a1.6 1.6 0 0 1-1.6 1.6h-2.4"/><path fill="currentColor" d="M6 6.5c0-1.7 1.8-2.9 4.1-2.9s4.1 1.2 4.1 2.9Z"/>',
  park:'<path fill="currentColor" d="M12 3 6.4 11.6h11.2L12 3Z"/><path fill="currentColor" d="M12 8.2 6.8 16.4h10.4L12 8.2Z"/><rect fill="currentColor" x="10.9" y="15.6" width="2.2" height="5" rx="0.6"/>',
  admin:'<path fill="currentColor" d="M12 3 2.8 7.5h18.4Z"/><rect fill="currentColor" x="4.4" y="9" width="1.9" height="7"/><rect fill="currentColor" x="8.2" y="9" width="1.9" height="7"/><rect fill="currentColor" x="13.9" y="9" width="1.9" height="7"/><rect fill="currentColor" x="17.7" y="9" width="1.9" height="7"/><rect fill="currentColor" x="3" y="17.4" width="18" height="2.3" rx="0.5"/>'
};
const ZOOM_GLYPH=13; // 이상이면 기호핀, 미만이면 작은 점. 전 오버레이 공통(핀 사이즈 균일) — 12로 내리면 z12 기호 재빌드 ~2.8s 프리즈(실측)라 13 통일(2026-07-18)
const DOT_R=6.5; // POI 점 반경 단일값(대중교통 제외 전 오버레이 통일)
// POI 렌더러 = 단일 벡터 캔버스(VEC_CANVAS). 점·기호 모두 캔버스 — DOM 마커 제로, 다중 캔버스 이벤트 차단 문제 회피
// 기호(흰 글리프)만 사전 래스터(cat별 1장, 3배 해상도) — 원·테두리는 캔버스 벡터로 직접 그림(DPR 무관 선명, dash 상태 무영향)
const GLYPH_IMGS={};
function glyphImgFor(cat){
  if(GLYPH_IMGS[cat])return GLYPH_IMGS[cat];
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" color="#ffffff">${GLYPHS[cat]}</svg>`;
  const img=new Image();
  img._pend=[];
  img.onload=()=>{if(img._pend)img._pend.forEach(l=>{try{l.redraw();}catch(e){}});img._pend=null;};
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  return GLYPH_IMGS[cat]=img;
}
// CircleMarker 서브클래스: 캔버스에 원 대신 기호핀을 그림(히트테스트·팝업·격리는 원과 동일)
const GlyphMarker=L.CircleMarker.extend({_updatePath:function(){this._renderer._updateGlyph(this);}});
L.Canvas.include({_updateGlyph:function(layer){
  if(!this._drawing||layer._empty())return;
  const o=layer.options;
  if(!o.opacity&&!o.fillOpacity)return; // 격리 숨김
  const p=layer._point,ctx=this._ctx,r=o.glyphD/2;
  ctx.save();
  ctx.setLineDash([]); // 서버브 점선 등 이전 경로의 dash 상태 차단
  ctx.beginPath();ctx.arc(p.x,p.y,r-0.8,0,Math.PI*2);
  ctx.fillStyle=o.glyphColor;ctx.fill();
  ctx.lineWidth=1.6;ctx.strokeStyle='#ffffff';ctx.stroke();
  const img=o.glyphImg,s=Math.round(o.glyphD*0.62);
  if(img.complete&&img.naturalWidth)ctx.drawImage(img,p.x-s/2,p.y-s/2,s,s);
  else if(img._pend)img._pend.push(layer);
  ctx.restore();
}});
function poiMarker(ll,o){
  let mk;
  if(map.getZoom()>=(o.zoomGlyph||ZOOM_GLYPH)){
    const d=o.glyph||22;
    mk=new GlyphMarker(ll,{renderer:VEC_CANVAS,radius:d/2,fill:true,fillOpacity:1,opacity:1,glyphImg:glyphImgFor(o.cat),glyphColor:o.color,glyphD:d});
  }else{
    mk=L.circleMarker(ll,{renderer:VEC_CANVAS,radius:o.dot||DOT_R,color:'#0c0f14',weight:1.1,fillColor:o.color,fillOpacity:1});
  }
  if(o.tooltip&&!(NO_HOVER&&o.popup))mk.bindTooltip(o.tooltip,{direction:'top',className:'sub-tip',opacity:1}); // 터치 기기: 팝업 있으면 툴팁 생략
  if(o.popup)mk.bindPopup(o.popup,{maxWidth:o.maxWidth||240});
  return mk;
}
function dimMarker(mk,visible,front){ // 격리: 비선택은 완전 숨김+비인터랙티브, 선택은 맨 앞으로
  if(mk instanceof L.CircleMarker){
    mk.setStyle({opacity:visible?1:0,fillOpacity:visible?1:0});
    mk.options.interactive=visible; // 캔버스 렌더러는 기하 히트테스트라 투명해도 탭 가로챔 → 차단
    if(mk._path)mk._path.style.pointerEvents=visible?'':'none'; // SVG 경로(교통 등)
    if(visible&&front)mk.bringToFront();
  }else{
    mk.setOpacity(visible?1:0);
    if(mk._icon)mk._icon.style.pointerEvents=visible?'':'none';
    if(mk.setZIndexOffset)mk.setZIndexOffset(visible&&front?1000:0);
  }
}
// 줌 임계 넘으면 켜져있는 POI 레이어만 재생성(점↔기호 전환), 필터 상태 보존
let _poiGlyph=null;
function refreshPoiZoom(){
  const z=map.getZoom();
  Object.values(POI_REG).forEach(r=>{ // 항목별 임계(zoomGlyph, 기본 ZOOM_GLYPH) 교차한 것만 재생성
    const g=z>=(r.zoomGlyph||ZOOM_GLYPH);
    if(r.on&&r.layer&&g!==r._g){const f=r.filter;map.removeLayer(r.layer);ovBuild(r);r.layer.addTo(map);r.filter=f;ovApply(r);}
    r._g=g;
  });
  const g=z>=ZOOM_GLYPH;
  if(g===_poiGlyph)return;
  _poiGlyph=g;
  if(shopOn&&shopLayer){map.removeLayer(shopLayer);shopLayer=null;buildShopLayer();shopLayer.addTo(map);}
  if(sightOn&&sightLayer){const f=sightFilter;map.removeLayer(sightLayer);sightLayer=null;buildSightLayer();sightLayer.addTo(map);sightFilter=f;applyMarkerFilter(sightMarks,sightFilter);}
  if(facOn&&facLayer){const f=facFilter;map.removeLayer(facLayer);facLayer=null;buildFacLayer();facLayer.addTo(map);facFilter=f;applyMarkerFilter(facMarks,facFilter);}
}

// ═══════════════ 대중교통 레이어 (SVG — 클릭 통과, 원 기호만) ═══════════════
const TRANSIT_COLOR={train:PALETTE[0],tram:PALETTE[1],bus:PALETTE[5]}; // 기차 빨·트램 주·버스 파랑(고빈도라 노랑→파랑, 쏠림 방지)
const TRANSIT_BASE_OP={train:0.9,tram:0.9,bus:0.9};
const TRANSIT_W=2.6,TRANSIT_R=4; // 선 굵기·역/정류장 크기 3종 통일
let transitLayer=null,transitOn=false,busStopGroup=null;
let transitMarkers={train:[],tram:[],bus:[]},transitFilter=null;
function applyTransitFilter(){
  Object.entries(transitMarkers).forEach(([t,arr])=>{
    const on=(!transitFilter||transitFilter===t);
    const op=transitFilter===t?0.9:(TRANSIT_BASE_OP[t]||0.9); // 격리 시 또렷하게
    arr.forEach(m=>{m.setStyle({opacity:on?op:0.07,fillOpacity:on?1:0.07});if(on&&transitFilter&&m.bringToFront)m.bringToFront();});
  });
}
function setTransitFilter(t){transitFilter=(transitFilter===t)?null:t;applyTransitFilter();renderMiniLegend();if(transitFilter===t)track('sub-transit-'+t);}
function buildTransitLayer(){
  transitLayer=L.layerGroup();
  transitMarkers={train:[],tram:[],bus:[]};transitFilter=null;
  // 버스 간선(Go Zone 코리도 대표 8노선) — 노선당 멀티폴리라인 1개, 얇고 흐리게
  BUS_TRUNK.forEach(rt=>{
    const pl=L.polyline(rt.segs,{renderer:VEC_CANVAS,color:TRANSIT_COLOR.bus,weight:TRANSIT_W,opacity:TRANSIT_BASE_OP.bus,lineCap:'round',lineJoin:'round',interactive:false});
    transitMarkers.bus.push(pl);pl.addTo(transitLayer);
  });
  // 간선 정류장 603곳 — 항상 표시
  busStopGroup=L.layerGroup();
  BUS_STOPS.forEach(s=>{
    const mk=L.circleMarker(s.ll,{renderer:VEC_CANVAS,radius:TRANSIT_R,color:'#0c0f14',weight:1,fillColor:TRANSIT_COLOR.bus,fillOpacity:1})
      .bindTooltip(`${s.n}<br><span style="font-size:9px;color:#5b6377">${T().busStop}</span>`,{direction:'top',className:'sub-tip',opacity:1});
    transitMarkers.bus.push(mk);mk.addTo(busStopGroup);
  });
  busStopGroup.addTo(transitLayer);
  TRANSIT.lines.forEach(l=>{
    const pl=L.polyline(l.c,{renderer:VEC_CANVAS,color:TRANSIT_COLOR[l.t],weight:TRANSIT_W,opacity:0.9,lineCap:'round',lineJoin:'round',interactive:false});
    (transitMarkers[l.t]||transitMarkers.train).push(pl);pl.addTo(transitLayer);
  });
  TRANSIT.stations.forEach(s=>{
    const isTram=s.t==='tram';
    const mk=L.circleMarker(s.ll,{renderer:VEC_CANVAS,radius:TRANSIT_R,color:'#0c0f14',weight:1,fillColor:TRANSIT_COLOR[s.t],fillOpacity:1})
      .bindTooltip(`${s.n}<br><span style="font-size:9px;color:#5b6377">${isTram?T().tram:T().train}</span>`,{direction:'top',className:'sub-tip',opacity:1});
    (transitMarkers[s.t]||transitMarkers.train).push(mk);mk.addTo(transitLayer);
  });
}
function setTransitLayer(on){
  if(on&&!transitLayer){
    const p=ensureOvData('transit');
    if(p){
      transitOn=true;renderMiniLegend();syncOverlayRows();
      p.then(()=>{if(transitOn&&!transitLayer){buildTransitLayer();transitLayer.addTo(map);}renderMiniLegend();syncOverlayRows();})
       .catch(()=>{transitOn=false;renderMiniLegend();syncOverlayRows();loadFailToast();});
      return;
    }
  }
  transitOn=on;
  if(on){if(!transitLayer)buildTransitLayer();transitLayer.addTo(map);}
  else if(transitLayer){map.removeLayer(transitLayer);}
  renderMiniLegend();syncOverlayRows();
}

// ═══════════════ 학교 레이어 ═══════════════
const SCHOOL_COLOR={p:PALETTE[0],s:PALETTE[1],u:PALETTE[2],c:PALETTE[3],o:PALETTE[4]}; // 초 중고 대학 칼리지 기타
function uniPopupHtml(u){
  const d=(LANG==='en'&&u.en)?u.en:u;
  return `<div class="popup-inner"><div class="popup-name">${u.n}</div><div class="popup-sub">${d.sub}</div><div class="popup-desc">${d.desc}</div></div>`;
}
function schoolPopupHtml(s){
  return `<div class="popup-inner"><div class="popup-name">${s.n}</div><div class="popup-sub">${T().schoolTypes[s.t]}</div></div>`;
}

// ═══════════════ 병원 레이어 (OSM amenity=hospital → 주요 공공·사립 큐레이트, 2026-07) ═══════════════
// 의료: 병원(큐레이트 14) + 약국·의원·치과(OSM, LGA 클립). 십자 글리프 공유
const MED_COLOR={hos:PALETTE[0],dr:PALETTE[1],de:PALETTE[4],km:PALETTE[6],ph:PALETTE[3]}; // 병원 빨·의원 주·치과 시안·한의원 보라·약국 초
function medPopupHtml(item){
  const t=T();
  if(item.hos){
    const desc=(LANG==='en'&&item.en)?item.en:item.desc;
    const own=t.hospOwn[item.own]||'';
    return `<div class="popup-inner"><div class="popup-name">${item.n}</div><div class="popup-sub">${t.hospTypes.hos}${own?' · '+own:''}</div><div class="popup-desc">${desc}</div></div>`;
  }
  return `<div class="popup-inner"><div class="popup-name">${item.n}</div><div class="popup-sub">${t.hospTypes[item.t]}</div></div>`;
}

// ═══════════════ 마트/장보기 레이어 (OSM shop=supermarket + 국가별 식료품점, LGA 클립) ═══════════════
const MART_COLOR={big:PALETTE[0],local:PALETTE[1],intl:PALETTE[2],liq:PALETTE[3]}; // 대형 지역 국가별 주류

// ═══════════════ 쇼핑 레이어 (주요 쇼핑센터 큐레이트) ═══════════════
const SHOP_COLOR=PALETTE[0]; // 단일
let shopLayer=null,shopOn=false;
function shopPopupHtml(s){
  const d=(LANG==='en'&&s.en)?s.en:s;
  return `<div class="popup-inner"><div class="popup-name">${s.n}</div><div class="popup-sub">${d.sub}</div><div class="popup-desc">${d.desc}</div></div>`;
}
function buildShopLayer(){
  shopLayer=L.layerGroup();
  MALLS.forEach(s=>{
    const sub=((LANG==='en'&&s.en)?s.en:s).sub;
    poiMarker(s.ll,{cat:'shopping',color:SHOP_COLOR,maxWidth:220,
      tooltip:`${s.n}<br><span style="font-size:9px;color:#5b6377">${sub}</span>`,
      popup:shopPopupHtml(s)}).addTo(shopLayer);
  });
}
function setShopLayer(on){
  if(on&&!shopLayer){
    const p=ensureOvData('shopping');
    if(p){
      shopOn=true;renderMiniLegend();syncOverlayRows();
      p.then(()=>{if(shopOn&&!shopLayer){buildShopLayer();shopLayer.addTo(map);}renderMiniLegend();syncOverlayRows();})
       .catch(()=>{shopOn=false;renderMiniLegend();syncOverlayRows();loadFailToast();});
      return;
    }
  }
  shopOn=on;
  if(on){if(!shopLayer)buildShopLayer();shopLayer.addTo(map);}
  else if(shopLayer){map.removeLayer(shopLayer);}
  renderMiniLegend();syncOverlayRows();
}

// ═══════════════ 명소(sight) / 시설(facility) 레이어 ═══════════════
function markerPopupHtml(m){
  return `<div class="popup-inner"><div class="popup-name">${m.name}</div><div class="popup-sub">${markerField(m,'sub')}</div><div class="popup-desc">${markerField(m,'desc')}</div></div>`;
}
const SIGHT_COLOR={beach:PALETTE[4],wine:PALETTE[0],venue:PALETTE[1]};      // 해변 시안·와이너리 빨강·경기장 주황
const FAC_COLOR={air:PALETTE[1],port:PALETTE[4],district:PALETTE[6]}; // 공항 주황·항구 시안·혁신 보라
// 공통 빌더: ov='sight'|'facility'
function buildMarkerLayer(ov,cat,colors){
  const layer=L.layerGroup(),marks={};
  MARKERS.filter(m=>m.ov===ov).forEach(m=>{
    (marks[m.st]=marks[m.st]||[]);
    const mk=poiMarker([m.lat,m.lng],{cat,color:colors[m.st],maxWidth:260,
      tooltip:`${m.name}<br><span style="font-size:9px;color:#5b6377">${markerField(m,'sub')}</span>`,
      popup:markerPopupHtml(m)});
    marks[m.st].push(mk);mk.addTo(layer);
  });
  return {layer,marks};
}
function applyMarkerFilter(marks,filter){
  Object.entries(marks).forEach(([t,arr])=>{const on=(!filter||filter===t);arr.forEach(mk=>dimMarker(mk,on,!!filter));});
}
// 명소
let sightLayer=null,sightOn=false,sightMarks={},sightFilter=null;
function buildSightLayer(){const r=buildMarkerLayer('sight','landmark',SIGHT_COLOR);sightLayer=r.layer;sightMarks=r.marks;sightFilter=null;}
function setSightFilter(t){sightFilter=(sightFilter===t)?null:t;applyMarkerFilter(sightMarks,sightFilter);renderMiniLegend();if(sightFilter===t)track('sub-sight-'+t);}
function setSightLayer(on){sightOn=on;if(on){if(!sightLayer)buildSightLayer();sightLayer.addTo(map);}else if(sightLayer){map.removeLayer(sightLayer);}renderMiniLegend();syncOverlayRows();}
// 시설
let facLayer=null,facOn=false,facMarks={},facFilter=null;
function buildFacLayer(){const r=buildMarkerLayer('facility','facility',FAC_COLOR);facLayer=r.layer;facMarks=r.marks;facFilter=null;}
function setFacFilter(t){facFilter=(facFilter===t)?null:t;applyMarkerFilter(facMarks,facFilter);renderMiniLegend();if(facFilter===t)track('sub-facility-'+t);}
function setFacLayer(on){facOn=on;if(on){if(!facLayer)buildFacLayer();facLayer.addTo(map);}else if(facLayer){map.removeLayer(facLayer);}renderMiniLegend();syncOverlayRows();}

// ═══════════════ 식당 (아시아계, OSM cuisine → LGA 클립) ═══════════════
const REST_COLOR={as:PALETTE[0],eu:PALETTE[3],am:PALETTE[5],etc:PALETTE[4]}; // 권역: 아시안 빨·유럽중동 초·아메리카 파·기타 시안
// cuisine 원본키 → [KO,EN] (팝업 국가 표기). 미매핑은 영문 타이틀케이스
const CUISINE={korean:['한식','Korean'],japanese:['일식','Japanese'],chinese:['중식','Chinese'],vietnamese:['베트남','Vietnamese'],thai:['태국','Thai'],indian:['인도','Indian'],italian:['이탈리안','Italian'],pizza:['피자','Pizza'],burger:['버거','Burger'],mexican:['멕시칸','Mexican'],greek:['그리스','Greek'],sushi:['스시','Sushi'],noodle:['면','Noodle'],ramen:['라멘','Ramen'],asian:['아시안','Asian'],sandwich:['샌드위치','Sandwich'],chicken:['치킨','Chicken'],kebab:['케밥','Kebab'],fish_and_chips:['피시앤칩스','Fish & chips'],lebanese:['레바논','Lebanese'],turkish:['터키','Turkish'],malaysian:['말레이시아','Malaysian'],indonesian:['인도네시아','Indonesian'],spanish:['스페인','Spanish'],french:['프렌치','French'],seafood:['해산물','Seafood'],bakery:['베이커리','Bakery'],fusion:['퓨전','Fusion'],modern_australian:['호주식','Modern Australian'],australian:['호주식','Australian'],bbq:['바베큐','BBQ'],breakfast:['브런치','Breakfast'],nepalese:['네팔','Nepalese'],sri_lankan:['스리랑카','Sri Lankan'],american:['아메리칸','American'],mediterranean:['지중해','Mediterranean'],tapas:['타파스','Tapas'],portuguese:['포르투갈','Portuguese'],german:['독일','German'],african:['아프리카','African'],curry:['커리','Curry'],pho:['베트남','Pho'],dumpling:['만두','Dumpling'],taiwanese:['대만','Taiwanese'],cantonese:['중식','Cantonese'],steak_house:['스테이크','Steak'],ice_cream:['아이스크림','Ice cream'],donut:['도넛','Donut'],coffee_shop:['커피','Coffee']};
function cuisineLabel(c){if(!c)return '';const m=CUISINE[c];if(m)return LANG==='en'?m[1]:m[0];return c.replace(/_/g,' ').replace(/\b\w/g,x=>x.toUpperCase());}

// ═══════════════ 카페 (OSM amenity=cafe, 단일) ═══════════════
const CAFE_COLOR={cafe:PALETTE[6],bakery:PALETTE[1],brunch:PALETTE[3]}; // 카페 보라·베이커리 주황·브런치 초록

// ═══════════════ 술집 (OSM amenity=pub/bar → 펍·바) ═══════════════
const PUB_COLOR={pub:PALETTE[2],bar:PALETTE[5],wine:PALETTE[0],brew:PALETTE[1],club:PALETTE[6]}; // 펍노랑·바파랑·와인빨·브루주황·클럽보라

// ═══════════════ 공원·레저 (OSM leisure=park/nature_reserve/garden + drinking_water/toilets/fitness) ═══════════════
const PARK_COLOR={park:PALETTE[3],water:PALETTE[4],toilet:PALETTE[5],fitness:PALETTE[0]}; // 공원 초록·음수대 시안·화장실 파랑·헬스 빨강

// ═══════════════ 생활·행정 (OSM bank/post_office/office=government/mobile_phone) ═══════════════
const ADMIN_COLOR={govt:PALETTE[5],bank:PALETTE[3],post:PALETTE[0],telecom:PALETTE[1],lib:PALETTE[6]}; // 관공서 파랑·은행 초록·우체국 빨강(호주우체국)·통신 주황·도서관 보라
// ═══════════════ POI 오버레이 레지스트리 — 8종 선언형 정의 + 제네릭 빌드·필터·토글 ═══════════════
// 항목: {id(=애널리틱스 sub-* 이벤트명), cat(글리프), pane, color(색맵), def(색·버킷 기본키), types(하위분류),
//        maxWidth?, data:()=>[items], label:(item)=>하위라벨, popup?:(item)=>html(없으면 이름+라벨 기본팝업), nameOf?:(item)=>표시명}
// 상태(layer/on/filter/markers)는 항목 안에 주입.
const POI_REG={
  schools:{id:'schools',cat:'school',color:SCHOOL_COLOR,def:'o',types:['p','s','u','c','o'],
    data:schoolData,
    label:s=>T().schoolTypes[s.t],
    popup:s=>s.uni?uniPopupHtml(s):schoolPopupHtml(s)},
  hospitals:{id:'hospitals',cat:'hospital',color:MED_COLOR,def:'hos',types:['hos','dr','de','km','ph'],
    data:()=>[...HOSPITALS.map(h=>({ll:h.ll,n:h.n,t:'hos',hos:true,own:h.t,desc:h.desc,en:h.en})),...MEDICAL.map(m=>({ll:m.ll,n:m.n,t:m.t}))],
    label:i=>T().hospTypes[i.t],
    popup:medPopupHtml},
  marts:{id:'marts',cat:'mart',color:MART_COLOR,def:'big',types:['big','local','intl','liq'],maxWidth:220,
    data:()=>MARTS,
    label:m=>(m.t==='intl'&&m.o&&T().origins[m.o])?`${T().martTypes.intl} · ${T().origins[m.o]}`:T().martTypes[m.t]},
  restaurant:{id:'restaurant',cat:'restaurant',color:REST_COLOR,def:'etc',types:['as','eu','am','etc'],maxWidth:220,cull:true,
    data:()=>RESTAURANTS,
    label:r=>{const cz=cuisineLabel(r.c);return T().restTypes[r.t]+(cz?' · '+cz:'');}},
  cafe:{id:'cafe',cat:'cafe',color:CAFE_COLOR,def:'cafe',types:['cafe','bakery','brunch'],maxWidth:200,cull:true,
    data:()=>CAFES,label:c=>T().cafeTypes[c.t]},
  pubs:{id:'pubs',cat:'pub',color:PUB_COLOR,def:'pub',types:['pub','bar','wine','brew','club'],maxWidth:200,
    data:()=>PUBS,label:p=>T().pubTypes[p.t]},
  parks:{id:'parks',cat:'park',color:PARK_COLOR,def:'park',types:['park','water','toilet','fitness'],maxWidth:200,cull:true,
    data:()=>PARKS,label:p=>T().parkTypes[p.t],nameOf:p=>p.n||T().parkTypes[p.t]},
  admin:{id:'admin',cat:'admin',color:ADMIN_COLOR,def:'govt',types:['govt','bank','post','telecom','lib'],maxWidth:200,
    data:()=>ADMIN,label:a=>T().adminTypes[a.t],nameOf:a=>a.n||T().adminTypes[a.t]},
};
Object.values(POI_REG).forEach(r=>{r.layer=null;r.on=false;r.filter=null;r.markers={};});
function ovBuild(r){
  r.layer=L.layerGroup();
  r.markers={};r.types.forEach(t=>r.markers[t]=[]);
  r.filter=null;
  r._g=map.getZoom()>=(r.zoomGlyph||ZOOM_GLYPH);
  r.data().forEach(item=>{
    const lab=r.label(item),nm=r.nameOf?r.nameOf(item):item.n;
    const mk=poiMarker(item.ll,{cat:r.cat,color:r.color[item.t]||r.color[r.def],pane:r.pane,maxWidth:r.maxWidth,zoomGlyph:r.zoomGlyph,
      tooltip:`${nm}<br><span style="font-size:9px;color:#5b6377">${lab}</span>`,
      popup:r.popup?r.popup(item):`<div class="popup-inner"><div class="popup-name">${nm}</div><div class="popup-sub">${lab}</div></div>`});
    (r.markers[item.t]||r.markers[r.def]).push(mk);
    if(!r.cull)mk.addTo(r.layer); // 컬링 오버레이는 ovCull이 뷰포트분만 추가
  });
  if(r.cull)ovCull(r);
}
function ovCull(r){ // 뷰포트 컬링: bounds+패딩 반화면분만 지도군에 유지(증분 add/remove, 데이터·마커 전량 보존)
  if(!r.layer)return;
  const b=map.getBounds().pad(0.5);
  r._cb=b; // 직전 계산 범위(핸들러 스킵 판정용)
  Object.entries(r.markers).forEach(([t,arr])=>{
    const vis=(!r.filter||r.filter===t);
    arr.forEach(mk=>{
      if(b.contains(mk.getLatLng())){
        if(!r.layer.hasLayer(mk)){r.layer.addLayer(mk);if(r.filter)dimMarker(mk,vis,true);} // 새로 들어온 마커에 격리 상태 적용
      }else if(r.layer.hasLayer(mk))r.layer.removeLayer(mk);
    });
  });
}
let _cullTimer=null;
map.on('moveend',()=>{ // 150ms 디바운스 + 직전 계산 범위에 뷰가 완전 포함되면 스킵
  clearTimeout(_cullTimer);
  _cullTimer=setTimeout(()=>{
    const v=map.getBounds();
    Object.values(POI_REG).forEach(r=>{
      if(r.cull&&r.on&&r.layer&&!(r._cb&&r._cb.contains(v)))ovCull(r);
    });
  },150);
});
function ovApply(r){
  Object.entries(r.markers).forEach(([t,arr])=>{
    const on=(!r.filter||r.filter===t);
    arr.forEach(mk=>dimMarker(mk,on,!!r.filter));
  });
}
function ovSetFilter(r,t){
  r.filter=(r.filter===t)?null:t;
  ovApply(r);renderMiniLegend();
  if(r.filter===t)track('sub-'+r.id+'-'+t);
}
function ovSetLayer(r,on){
  if(on&&!r.layer){
    const p=ensureOvData(r.id); // 데이터 미로드면 주입 후 재개(칩은 즉시 on+로딩 표시)
    if(p){
      r.on=true;
      renderMiniLegend();syncOverlayRows();
      p.then(()=>{if(r.on&&!r.layer){ovBuild(r);r.layer.addTo(map);}renderMiniLegend();syncOverlayRows();})
       .catch(()=>{r.on=false;renderMiniLegend();syncOverlayRows();loadFailToast();});
      return;
    }
  }
  r.on=on;
  if(on){if(!r.layer)ovBuild(r);r.layer.addTo(map);}
  else if(r.layer){map.removeLayer(r.layer);}
  renderMiniLegend();syncOverlayRows();
}
// 기존 이름 유지 얇은 래퍼(좌측 패널·칩바·검색 배선 공용)
const setSchoolLayer=on=>ovSetLayer(POI_REG.schools,on),   setSchoolFilter=t=>ovSetFilter(POI_REG.schools,t);
const setHospitalLayer=on=>ovSetLayer(POI_REG.hospitals,on),setHospitalFilter=t=>ovSetFilter(POI_REG.hospitals,t);
const setMartLayer=on=>ovSetLayer(POI_REG.marts,on),       setMartFilter=t=>ovSetFilter(POI_REG.marts,t);
const setRestLayer=on=>ovSetLayer(POI_REG.restaurant,on),  setRestFilter=t=>ovSetFilter(POI_REG.restaurant,t);
const setCafeLayer=on=>ovSetLayer(POI_REG.cafe,on),        setCafeFilter=t=>ovSetFilter(POI_REG.cafe,t);
const setPubLayer=on=>ovSetLayer(POI_REG.pubs,on),         setPubFilter=t=>ovSetFilter(POI_REG.pubs,t);
const setParkLayer=on=>ovSetLayer(POI_REG.parks,on),       setParkFilter=t=>ovSetFilter(POI_REG.parks,t);
const setAdminLayer=on=>ovSetLayer(POI_REG.admin,on),      setAdminFilter=t=>ovSetFilter(POI_REG.admin,t);

// ═══════════════ 바이브 라벨 (줌 ≤ 11) ═══════════════
let vibeMarkers=[];
function vibeColor(hex){ // 라이트 지도용: 카테고리색 38% 어둡게(라벨 가독) — 범례·채움은 원색 유지
  const n=parseInt(hex.slice(1),16),f=0.62;
  return `rgb(${Math.round((n>>16&255)*f)},${Math.round((n>>8&255)*f)},${Math.round((n&255)*f)})`;
}
function buildVibes(){
  vibeMarkers.forEach(mk=>map.removeLayer(mk));
  vibeMarkers=[];
  VIBES.forEach(([lat,lng,cat,size],i)=>{
    const c=vibeColor(CAT_META[cat].color);
    const catName=catLabel(CAT_META[cat]);
    const icon=L.divIcon({html:`<div class="vibe-label" style="color:${c};font-size:15px">${T().vibes[i]}<span class="vibe-cat">${catName}</span></div>`,className:'',iconSize:[0,0]});
    vibeMarkers.push(L.marker([lat,lng],{icon,interactive:false}));
  });
  syncVibes();
}
function syncVibes(){
  const show=map.getZoom()<=11;
  vibeMarkers.forEach(mk=>{if(show){mk.addTo(map);}else{map.removeLayer(mk);}});
}
map.on('zoomend',syncVibes);
map.on('zoomend',refreshPoiZoom);

