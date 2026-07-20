// ▓▓▓ CORE — 애널리틱스·i18n헬퍼·지연로딩·MAP·색상/LGA·바텀시트·서버브 ▓▓▓ (app-core→app-overlays→app-ui 순서 로드. 전역 스코프 공유; 뒤 파일이 앞 심볼 참조)
// ═══════════════ 애널리틱스 (GoatCounter + Umami 이중, 안전 래퍼) ═══════════════
(function(){
  var skip=false;
  try{
    if(location.hash==='#skip-analytics'){localStorage.setItem('skip-analytics','1');}
    if(localStorage.getItem('skip-analytics')==='1')skip=true;
  }catch(e){}
  if(/^(localhost|127\.0\.0\.1)$/.test(location.hostname)||location.protocol==='file:')skip=true; // 로컬·파일 직접열기 제외
  if(skip){
    window.goatcounter={no_onload:true};              // GoatCounter 자동집계 차단
    try{localStorage.setItem('umami.disabled','1');}catch(e){} // Umami 자동집계 차단
  }else{
    try{localStorage.removeItem('umami.disabled');}catch(e){}
  }
  window.__ANALYTICS_SKIP__=skip;
})();
function track(path){
  if(window.__ANALYTICS_SKIP__)return;
  if(window.goatcounter&&goatcounter.count)goatcounter.count({path:path,event:true});
  if(window.umami&&umami.track)umami.track(path);
}
// 로드 직후 이벤트용: 스크립트(async) 로드 대기 후 발화(양쪽 각각 한 번)
function trackWhenReady(path){
  if(window.__ANALYTICS_SKIP__)return;
  var n=0,g=false,u=false;
  (function a(){
    if(!g&&window.goatcounter&&goatcounter.count){goatcounter.count({path:path,event:true});g=true;}
    if(!u&&window.umami&&umami.track){umami.track(path);u=true;}
    if((g&&u)||n++>40)return;
    setTimeout(a,150);
  })();
}
// 재방문 근사(로컬 플래그·브라우저 단위. GoatCounter는 영구ID 없어 못 함 → 로컬로 대체)
(function(){
  if(window.__ANALYTICS_SKIP__)return;
  try{
    if(sessionStorage.getItem('av_session'))return; // 세션당 1회만
    sessionStorage.setItem('av_session','1');
    var d=new Date(),today=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    var count=parseInt(localStorage.getItem('av_count')||'0',10),last=localStorage.getItem('av_last');
    if(count===0)trackWhenReady('visitor-new');
    else{trackWhenReady('visitor-returning');if(last===today)trackWhenReady('visit-sameday');}
    localStorage.setItem('av_count',count+1);localStorage.setItem('av_last',today);
  }catch(e){}
})();
// 체류시간 보정: 활성 상태 누적시간이 임계 초를 넘길 때마다 1회씩만 dwell 이벤트 발사.
// umami는 세션 내 이벤트 시간간격으로 duration을 잡는데, SPA라 유휴 중엔 이벤트가 0 → 항상 0~1초로 기록됨.
// 임계값 핑으로 duration이 '도달한 최대 구간'으로 의미있게 잡힘. 백그라운드(탭 숨김) 시간은 미포함.
(function(){
  if(window.__ANALYTICS_SKIP__)return;
  var STEPS=[10,30,60,120,300],i=0,acc=0,t0=performance.now(),timer=null;
  function tick(){
    acc+=(performance.now()-t0)/1000;t0=performance.now();
    while(i<STEPS.length&&acc>=STEPS[i]){track('dwell-'+STEPS[i]+'s');i++;}
    if(i>=STEPS.length){clearInterval(timer);timer=null;}
  }
  function start(){if(!timer&&i<STEPS.length&&document.visibilityState!=='hidden'){t0=performance.now();timer=setInterval(tick,5000);}} // visible일 때만 계수(백그라운드 로드 시간 제외)
  function stop(){if(timer){tick();clearInterval(timer);timer=null;}}
  document.addEventListener('visibilitychange',function(){document.visibilityState==='hidden'?stop():start();});
  start();
})();

// 학교 데이터(지연 로드 대응): 4파일+큐레이트 대학(t:'u') 병합. 미로드 시 빈 배열
function schoolData(){
  if(typeof SCHOOLS_P==='undefined')return[];
  return[...SCHOOLS_P,...SCHOOLS_S,...SCHOOLS_C,...SCHOOLS_O,...CURATED_UNIS.map(u=>({...u,t:'u',uni:true}))];
}
// ═══════════════════════ I18N ═══════════════════════
let LANG='ko';
try{LANG=localStorage.getItem('adelaide-lang')||'ko';}catch{}
try{const u=new URLSearchParams(location.search).get('lang');if(u==='en'||u==='ko')LANG=u;}catch{}

// I18N 은 data-i18n.js 로 분리(app.js보다 먼저 로드)
function T(){return I18N[LANG];}
function catLabel(cm){return LANG==='en'?cm.en:cm.label;}
Object.entries(LGAS).forEach(([id,d])=>{d.id=id;});
function lgaField(d,f){
  if(LANG==='en'&&d.id&&EN_LGAS[d.id]&&EN_LGAS[d.id][f]!==undefined)return EN_LGAS[d.id][f];
  return d[f];
}
function markerField(m,f){
  if(LANG==='en'&&EN_MARKERS[m.id]&&EN_MARKERS[m.id][f]!==undefined)return EN_MARKERS[m.id][f];
  return m[f];
}

// ═══════════════ 데이터 지연 로딩 — 오버레이 첫 토글 시 script 동적 주입 ═══════════════
// 초기 로드는 data-i18n·data-geo(기본ON 경계)·data-core(RENT/CRIME/기차트램)만. 나머지는 여기서.
// URL은 index.html에 있던 ?v= 그대로 유지(기존 방문자 캐시 재사용). 데이터 갱신 시 여기 v를 bump.
const OV_FILES={
  transit:['data-transit-bus.js?v=20260720m'],
  schools:['data-schools-primary.js?v=20260720m','data-schools-secondary.js?v=20260720m','data-schools-tertiary.js?v=20260720m','data-schools-other.js?v=20260720m'],
  hospitals:['data-hospitals.js?v=20260720m','data-medical.js?v=20260720m'],
  marts:['data-shops.js?v=20260720m'],
  shopping:['data-shops.js?v=20260720m'],
  restaurant:['data-restaurants.js?v=20260720m'],
  cafe:['data-cafes.js?v=20260720m'],
  pubs:['data-pubs.js?v=20260720m'],
  parks:['data-parks.js?v=20260720m'],
  admin:['data-admin.js?v=20260720m'],
  runs:['data-runs.js?v=20260720m'],
};
const _dataLoaded={},_dataLoading={};
function loadDataScript(src){
  if(_dataLoaded[src])return Promise.resolve();
  if(_dataLoading[src])return _dataLoading[src]; // 이중 주입 방지
  _dataLoading[src]=new Promise((ok,fail)=>{
    const s=document.createElement('script');
    s.src=src;
    s.onload=()=>{_dataLoaded[src]=true;POIS=null;ok();}; // 검색 인덱스 무효화(새 데이터 반영)
    s.onerror=()=>{delete _dataLoading[src];s.remove();fail(new Error('load fail: '+src));};
    document.head.appendChild(s);
  });
  return _dataLoading[src];
}
function ensureOvData(id){ // 전부 로드돼 있으면 null(동기 경로), 아니면 Promise
  const files=OV_FILES[id];
  if(!files||files.every(f=>_dataLoaded[f]))return null;
  return Promise.all(files.map(loadDataScript));
}
const ovDataPending=id=>!!(OV_FILES[id]&&OV_FILES[id].some(f=>_dataLoading[f]&&!_dataLoaded[f]));
let _allDataP=null;
function ensureAllData(){ // 검색 진입 시 전체 로드(인덱스 완전성)
  if(!_allDataP)_allDataP=Promise.all([...new Set(Object.values(OV_FILES).flat())].map(loadDataScript));
  return _allDataP;
}
function loadFailToast(){toast(LANG==='en'?'Data load failed — check connection':'데이터 로드 실패 — 연결 확인');}

// ═══════════════════════ MAP ═══════════════════════
const map=L.map('map',{
  minZoom:10,maxZoom:17,zoomControl:false,closePopupOnClick:false, // 최대확대 17(2단계↑, 2026-07-19). 팝업 닫기는 click 핸들러가 직접
  maxBounds:[[-35.65,138.1],[-34.3,139.1]],maxBoundsViscosity:0.85,
}).setView([-34.95,138.62],11);
L.control.zoom({position:'bottomright'}).addTo(map);
map.attributionControl.setPrefix(false); // Leaflet 접두어 제거(© OSM © CARTO는 라이선스상 유지)
// 팝업 열릴 때 같은 마커의 호버 툴팁 잠금(팝업 뒤 겹침 방지), 닫히면 복원 — 전 오버레이 공통
let _popupOpen=false; // map._popup은 닫힌 뒤 stale하게 남아 신뢰 불가 → 자체 플래그
map.on('popupopen',e=>{
  _popupOpen=true;
  const s=e.popup&&e.popup._source;
  if(s&&s.getTooltip&&s.getTooltip()){s._ttSaved=s.getTooltip();s.unbindTooltip();}
  // generic POI 팝업: sub 라벨에 최근접 서버브명 표시(정보용). 구글맵 매칭은 gmapFooter가 좌표로 처리(서버브 불필요). 열 때 1회
  if(s&&s.options&&s.options.regionize&&s.getLatLng&&typeof nearestSub==='function'){
    const subEl=e.popup._contentNode&&e.popup._contentNode.querySelector('.popup-sub');
    if(subEl&&!subEl._rgz){
      const ll=s.getLatLng(), sub=nearestSub([ll.lat,ll.lng]);
      if(sub&&subEl.textContent.indexOf(sub)<0)subEl.insertAdjacentHTML('beforeend',` · <span style="color:var(--muted)">${sub}</span>`);
      subEl._rgz=1;
    }
  }
});
map.on('popupclose',e=>{
  _popupOpen=false;
  const s=e.popup&&e.popup._source;
  if(s&&s._ttSaved){s.bindTooltip(s._ttSaved);delete s._ttSaved;}
});
// 단일 벡터 캔버스 — 캔버스를 pane마다 두면 맨 위 캔버스(전면 DOM)가 아래 레이어 이벤트를 전부 가로챔.
// LGA·서버브·교통·POI 전부 이 한 장에 그림. 겹침 순서=추가순(폴리곤 먼저, 선·핀 나중).
map.createPane('vecPane');map.getPane('vecPane').style.zIndex=455;
const VEC_CANVAS=L.canvas({pane:'vecPane'});
const NO_HOVER=matchMedia('(hover: none)').matches; // 터치 기기: 팝업 있는 마커는 호버 툴팁 생략(탭 시 플래시 방지)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{
  attribution:'© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors © <a href="https://carto.com">CARTO</a>',
  subdomains:'abcd',maxZoom:19
}).addTo(map);

// ═══════════════ 색상 모드 & LGA 스타일 ═══════════════
let mapColorMode='category', activeCat='all', selectedLgaId=null;
const RENT_SCALE=['#34d399','#84cc16','#eab308','#f97316','#e11d48'];
const CRIME_SCALE=['#4ade80','#a3e635','#facc15','#fb923c','#ef4444'];
const RENT_MID={};Object.entries(RENT).forEach(([id,r])=>RENT_MID[id]=(r[0]+r[1])/2);
function bucketize(byId,quantile){
  const es=Object.entries(byId),out={};
  if(quantile){const s=[...es].sort((a,b)=>a[1]-b[1]);s.forEach(([id],i)=>out[id]=Math.min(4,Math.floor(i/s.length*5)));}
  else{const vs=es.map(e=>e[1]),mn=Math.min(...vs),mx=Math.max(...vs);es.forEach(([id,v])=>out[id]=mx===mn?0:Math.min(4,Math.floor((v-mn)/(mx-mn)*5)));}
  return out;
}
let rentB=null,crimeB=null;
function lgaColor(id){
  if(mapColorMode==='rent'){if(!rentB)rentB=bucketize(RENT_MID);return RENT_SCALE[rentB[id]??0];}
  if(mapColorMode==='crime'){if(!crimeB)crimeB=bucketize(CRIME,true);return CRIME_SCALE[crimeB[id]??0];}
  return CAT_META[LGAS[id].cat].color;
}
// 치안 순위 (1 = 신고율 최저)
const CRIME_RANK={};
Object.entries(CRIME).sort((a,b)=>a[1]-b[1]).forEach(([id],i)=>CRIME_RANK[id]=i+1);
const MAX_ST=Math.max(...Object.values(LGA_STATS).map(s=>s.st));
const MAX_SCH=Math.max(...Object.values(LGA_STATS).map(s=>s.sch));
const RENT_MIN=Math.min(...Object.values(RENT_MID)),RENT_MAX=Math.max(...Object.values(RENT_MID));

// hex 색 어둡게(선택 경계용) — #rrggbb → 각 채널 factor배. 카테고리/렌트/치안 색과 어울리는 진한 테두리
function darkenHex(hex,f){f=f==null?0.55:f;const n=parseInt(hex.slice(1),16);return `rgb(${Math.round((n>>16&255)*f)},${Math.round((n>>8&255)*f)},${Math.round((n&255)*f)})`;}
function restyleAll(){
  // 라이트 배경 대응: 면 채움을 등급 구분되게(2026-07-19, 다크 때 0.11서 상향). 핀은 라이트 대비 충분해 가독 유지
  const fillBase=0.28, fillDim=0.06, fillSel=0.5, fillOther=0.12;
  Object.entries(lgaLayers).forEach(([id,layer])=>{
    const c=lgaColor(id);
    if(id===selectedLgaId){layer.setStyle({color:darkenHex(c),weight:3,opacity:1,fillColor:c,fillOpacity:fillSel});} // 선택 경계=카테고리색 진하게(bringToFront 금지 — 단일 캔버스라 핀 위로 올라옴)
    else if(selectedLgaId){layer.setStyle({color:c,weight:1,opacity:0.25,fillColor:c,fillOpacity:fillOther});}
    else{
      const dim=activeCat!=='all'&&LGAS[id].cat!==activeCat;
      layer.setStyle({color:c,weight:1.8,opacity:dim?0.2:0.9,fillColor:c,fillOpacity:dim?fillDim:fillBase});
    }
  });
  renderMiniLegend();
}

const lgaLayers={};
Object.entries(LGA_BOUNDARIES).forEach(([id,geom])=>{
  if(!LGAS[id])return;
  const layer=L.geoJSON({type:'Feature',properties:{},geometry:geom},{
    renderer:VEC_CANVAS,
    style:{color:lgaColor(id),weight:1.8,opacity:0.9,fillColor:lgaColor(id),fillOpacity:0.11},
  }).addTo(map);
  layer.on('click',(e)=>{L.DomEvent.stopPropagation(e);if(_popupOpen){map.closePopup();return;}deselectSuburb();openSheet(id);}); // 팝업 열림 시 팝업만 닫고 LGA 선택 무효화
  layer.on('mouseover',()=>{if(selectedLgaId)return;layer.setStyle({fillOpacity:0.24,weight:2.5});});
  layer.on('mouseout',()=>{if(selectedLgaId)return;restyleAll();});
  lgaLayers[id]=layer;
});
map.on('click',()=>{
  if(_popupOpen){map.closePopup();return;} // 팝업 열려있으면 닫기만 — 맵 선택(서버브·시트 해제) 무효화
  deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();
});

// ═══════════════ 바텀시트 ═══════════════
function chip(text,fg,bg){return `<span class="bs-chip" style="color:${fg};background:${bg}">${text}</span>`;}
function barRow(label,pct,color,val){
  return `<div class="bar-row"><span class="bar-lbl">${label}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(4,Math.round(pct*100))}%;background:${color}"></div></div><span class="bar-val">${val}</span></div>`;
}
function openSheet(id){
  track('lga-'+id);
  selectedLgaId=id;restyleAll();
  const d=LGAS[id],t=T(),c=CAT_META[d.cat].color;
  document.getElementById('bs-name').textContent=d.name;
  document.getElementById('bs-name').style.color=c;
  document.getElementById('bs-sub').textContent=`${catLabel(CAT_META[d.cat])} · ${t.pop(lgaField(d,'pop'))}`;
  document.getElementById('bs-kw').textContent=lgaField(d,'kw');
  document.getElementById('bs-kw').style.color=c;

  const st=LGA_STATS[id]||{st:0,sch:0};
  const rank=CRIME_RANK[id]||9;
  const [lo,hi]=RENT[id];
  document.getElementById('bs-chips').innerHTML=
    chip(t.chipRent(lo,hi),'#1d4ed8','#dbeafe')+
    chip(st.st>0?t.chipStations(st.st):t.chipBus,'#0e7490','#cffafe')+
    chip(t.chipSchools(st.sch),'#3f6212','#ecfccb')+
    chip(t.chipSafety(rank),rank<=6?'#15803d':(rank<=12?'#a16207':'#c2410c'),rank<=6?'#dcfce7':'#fef3c7');

  document.getElementById('bs-desc').textContent=lgaField(d,'desc');
  document.getElementById('bs-tags').innerHTML=lgaField(d,'tags').map(tag=>
    `<span class="bs-tag" style="color:${c};border-color:${c}30;background:${c}0a">${tag}</span>`).join('');

  const afford=1-(RENT_MID[id]-RENT_MIN)/(RENT_MAX-RENT_MIN);
  const safety=(18-rank)/17;
  document.getElementById('bs-bars').innerHTML=
    barRow(t.barRent, afford, '#2f6fe0', t.barRentVal(lo,hi))+
    barRow(t.barSafety, safety, '#16a34a', t.barSafetyVal(rank))+
    barRow(t.barTransit, st.st/MAX_ST, '#0891b2', t.barStVal(st.st))+
    barRow(t.barSchools, st.sch/MAX_SCH, '#65a30d', t.barSchVal(st.sch));

  const bs=document.getElementById('bottom-sheet');
  bs.classList.add('on');bs.classList.remove('expanded');bs.scrollTop=0; // 모바일: 기본 peek
  document.body.classList.add('sheet-on');
  if(typeof updateMScalePos==='function')updateMScalePos();
}
function closeSheet(){const bs=document.getElementById('bottom-sheet');bs.classList.remove('on');bs.classList.remove('expanded');document.body.classList.remove('sheet-on');if(typeof updateMScalePos==='function')updateMScalePos();}
document.getElementById('bs-close').addEventListener('click',(e)=>{e.stopPropagation();deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();});
// 모바일 peek↔확장: bs-top 탭 토글, 위/아래 스와이프
(function(){
  const bs=document.getElementById('bottom-sheet');
  bs.querySelector('.bs-top').addEventListener('click',(e)=>{
    if(e.target.closest('.bs-close'))return;
    if(isMobile()){bs.classList.toggle('expanded');updateMScalePos();}
  });
  bs.querySelector('.bs-grab').addEventListener('click',()=>{if(isMobile()){bs.classList.toggle('expanded');updateMScalePos();}});
  let y0=null,top0=0;
  bs.addEventListener('touchstart',e=>{y0=e.touches[0].clientY;top0=bs.scrollTop;},{passive:true});
  bs.addEventListener('touchend',e=>{
    if(y0==null||!isMobile())return;
    const dy=e.changedTouches[0].clientY-y0;y0=null;
    if(dy<-28)bs.classList.add('expanded');
    else if(dy>28){
      if(bs.classList.contains('expanded')){
        if(top0<=0)bs.classList.remove('expanded'); // 맨 위에서 시작한 스와이프만 축소(내용 스크롤과 분리)
      }else{deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();}
    }
    updateMScalePos();
  },{passive:true});
})();

// ═══════════════ 서버브 레이어 ═══════════════
let suburbLayer=null,suburbOn=false,selectedSubPoly=null,suburbPolys={};
const SUB_BASE={color:'rgba(60,70,100,0.55)',weight:0.8,opacity:1,dashArray:'3 3',fillOpacity:0.02};
// 선택 서버브 = 그 LGA 카테고리색 기반(경계 진하게·채움 은은) — 검정 대신 어울리는 색
function subSelStyle(cat){const col=CAT_META[cat].color;return {color:darkenHex(col),weight:2.6,opacity:1,dashArray:null,fillColor:col,fillOpacity:0.16};}
function deselectSuburb(){if(selectedSubPoly){selectedSubPoly.setStyle(SUB_BASE);selectedSubPoly=null;}}
function buildSuburbLayer(){
  suburbLayer=L.layerGroup();suburbPolys={};
  SUBURBS.forEach((s,si)=>{
    const d=LGAS[s.l];if(!d)return;
    const latlngs=s.g.map(ring=>[ring.map(([lng,lat])=>[lat,lng])]);
    const poly=L.polygon(latlngs,{renderer:VEC_CANVAS,fillColor:CAT_META[d.cat].color,...SUB_BASE});
    const l2n=(s.l2||[]).map(id=>LGAS[id]?LGAS[id].name:id).join(' · ');
    const tip=`${s.n}${s.pc?(' · '+s.pc):''}`+(l2n?`<br><span style="font-size:9.5px;color:#5b6377">${T().partly(l2n)}</span>`:'');
    poly.bindTooltip(tip,{sticky:true,direction:'top',className:'sub-tip',opacity:1});
    poly.on('click',(e)=>{
      L.DomEvent.stopPropagation(e);
      if(_popupOpen){map.closePopup();return;} // 팝업 열림 시 팝업만 닫고 서버브 선택 무효화
      deselectSuburb();selectedSubPoly=poly;poly.setStyle(subSelStyle(d.cat));
      openSheet(s.l);
    });
    suburbLayer.addLayer(poly);suburbPolys[si]=poly;
  });
}
function setSuburbLayer(on){
  suburbOn=on;
  if(on){if(!suburbLayer)buildSuburbLayer();suburbLayer.addTo(map);}
  else{deselectSuburb();if(suburbLayer)map.removeLayer(suburbLayer);}
  syncOverlayRows();
}

