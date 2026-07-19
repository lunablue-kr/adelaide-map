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
    var bl=(navigator.language||'').slice(0,2).toLowerCase();if(bl)trackWhenReady('browserlang-'+bl); // 브라우저 언어(Umami서도 언어 파악)
    localStorage.setItem('av_count',count+1);localStorage.setItem('av_last',today);
  }catch(e){}
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
  transit:['data-transit-bus.js'],
  schools:['data-schools-primary.js','data-schools-secondary.js','data-schools-tertiary.js','data-schools-other.js'],
  hospitals:['data-hospitals.js','data-medical.js?v=20260714o'],
  marts:['data-shops.js'],
  shopping:['data-shops.js'],
  restaurant:['data-restaurants.js?v=20260714o'],
  cafe:['data-cafes.js?v=20260714o'],
  pubs:['data-pubs.js?v=20260714o'],
  parks:['data-parks.js?v=20260714o'],
  admin:['data-admin.js?v=20260714o'],
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
  minZoom:10,maxZoom:15,zoomControl:false,closePopupOnClick:false, // 팝업 닫기는 click 핸들러가 직접(선택 무효화 위해)
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

function restyleAll(){
  // 라이트 배경 대응: 면 채움을 등급 구분되게(2026-07-19, 다크 때 0.11서 상향). 핀은 라이트 대비 충분해 가독 유지
  const fillBase=0.28, fillDim=0.06, fillSel=0.5, fillOther=0.12;
  Object.entries(lgaLayers).forEach(([id,layer])=>{
    const c=lgaColor(id);
    if(id===selectedLgaId){layer.setStyle({color:'#1c2333',weight:3,opacity:1,fillColor:c,fillOpacity:fillSel});} // bringToFront 금지(단일 캔버스라 핀 위로 올라옴)
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
  layer.on('click',(e)=>{L.DomEvent.stopPropagation(e);deselectSuburb();openSheet(id);});
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
const SUB_SEL={color:'#1c2333',weight:3,opacity:1,dashArray:null,fillOpacity:0.1};
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
      deselectSuburb();selectedSubPoly=poly;poly.setStyle(SUB_SEL);
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

// ═══════════════ 좌측 패널 ═══════════════
const OVERLAYS=[
  {id:'suburb',color:'#39415a',swatch:'dash',get:()=>suburbOn,set:setSuburbLayer},
  {id:'transit',color:'#39415a',swatch:'dot',get:()=>transitOn,set:setTransitLayer}, // 원 기호
  {id:'schools',color:'#39415a',swatch:'glyph',cat:'school',get:()=>POI_REG.schools.on,set:setSchoolLayer},
  {id:'hospitals',color:'#39415a',swatch:'glyph',cat:'hospital',get:()=>POI_REG.hospitals.on,set:setHospitalLayer},
  {id:'marts',color:'#39415a',swatch:'glyph',cat:'mart',get:()=>POI_REG.marts.on,set:setMartLayer},
  {id:'restaurant',color:'#39415a',swatch:'glyph',cat:'restaurant',get:()=>POI_REG.restaurant.on,set:setRestLayer},
  {id:'cafe',color:'#39415a',swatch:'glyph',cat:'cafe',get:()=>POI_REG.cafe.on,set:setCafeLayer},
  {id:'pubs',color:'#39415a',swatch:'glyph',cat:'pub',get:()=>POI_REG.pubs.on,set:setPubLayer},
  {id:'parks',color:'#39415a',swatch:'glyph',cat:'park',get:()=>POI_REG.parks.on,set:setParkLayer},
  {id:'shopping',color:'#39415a',swatch:'glyph',cat:'shopping',get:()=>shopOn,set:setShopLayer},
  {id:'sight',color:'#39415a',swatch:'glyph',cat:'landmark',get:()=>sightOn,set:setSightLayer},
  {id:'facility',color:'#39415a',swatch:'glyph',cat:'facility',get:()=>facOn,set:setFacLayer},
  {id:'admin',color:'#39415a',swatch:'glyph',cat:'admin',get:()=>POI_REG.admin.on,set:setAdminLayer},
];
function renderOverlayRows(){
  ['ov-rows','m-ov-rows'].forEach(cid=>{
    const el=document.getElementById(cid);if(!el)return;
    el.innerHTML=OVERLAYS.map(o=>
      `<div class="ov-row${o.get()?' on':''}" data-ov="${o.id}" style="--ac:${o.color}">
        <span class="ov-check"></span><span class="ov-label">${T().layers[o.id]}</span>
        ${o.swatch==='glyph'
          ?`<span class="ov-swatch glyph"><svg width="15" height="15" viewBox="0 0 24 24">${GLYPHS[o.cat]}</svg></span>`
          :`<span class="ov-swatch ${o.swatch}" style="border-top-color:${o.color};${o.swatch==='dot'?`background:${o.color}`:''}"></span>`}
      </div>`).join('')+`<div class="ov-clear">${T().clearAll}</div>`;
    el.querySelectorAll('.ov-row').forEach(row=>{
      row.addEventListener('click',()=>{
        const def=OVERLAYS.find(x=>x.id===row.dataset.ov);
        const turnOn=!def.get();
        def.set(turnOn);
        if(turnOn)track('ov-'+def.id);
      });
    });
    el.querySelector('.ov-clear').addEventListener('click',()=>{
      OVERLAYS.filter(o=>o.id!=='suburb').forEach(o=>{if(o.get())o.set(false);}); // 서버브 경계는 유지
    });
  });
}
function syncOverlayRows(){
  document.querySelectorAll('.ov-row[data-ov]').forEach(row=>{
    const def=OVERLAYS.find(x=>x.id===row.dataset.ov);
    if(def){row.classList.toggle('on',def.get());row.classList.toggle('loading',def.get()&&ovDataPending(def.id));}
  });
  if(typeof renderMOverlayBar==='function'){renderMOverlayBar();renderMSubBar();}
}
function renderColorSeg(){
  ['color-seg','m-color-seg'].forEach(cid=>{
    const el=document.getElementById(cid);if(!el)return;
    el.innerHTML=['category','rent','crime'].map(m=>
      `<span class="seg-btn${mapColorMode===m?' on':''}" data-mode="${m}">${T().colorModes[m]}</span>`).join('');
    el.querySelectorAll('.seg-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        mapColorMode=btn.dataset.mode;
        document.querySelectorAll('.seg-btn[data-mode]').forEach(b=>b.classList.toggle('on',b.dataset.mode===mapColorMode));
        restyleAll();
        if(mapColorMode!=='category')track('color-'+mapColorMode);
      });
    });
  });
}

// ═══════════════ 검색 ═══════════════
// 검색 포커스 줌 (한 곳에서 조정)
const ZOOM_SUB=13,ZOOM_POI=14,ZOOM_LGA=13;
// ── POI 검색 인덱스 (학교·병원·마트·쇼핑·역·명소). 최근접 서버브명 붙여 구분 가능하게
let POIS=null,SUB_CENT=null;
function subCentroids(){
  if(SUB_CENT)return SUB_CENT;
  SUB_CENT=SUBURBS.map(s=>{
    const ring=(s.g&&s.g[0])||[];let x=0,y=0,k=0;
    ring.forEach(pt=>{if(Array.isArray(pt)&&pt.length>=2){x+=pt[0];y+=pt[1];k++;}});
    return k?{n:s.n,lat:y/k,lng:x/k}:{n:s.n,lat:0,lng:0};
  });
  return SUB_CENT;
}
function nearestSub(ll){
  let best='',bd=Infinity;
  for(const s of subCentroids()){
    const dx=s.lng-ll[1],dy=s.lat-ll[0],d=dx*dx+dy*dy;
    if(d<bd){bd=d;best=s.n;}
  }
  return best;
}
function getPois(){
  if(POIS)return POIS;
  POIS=[];
  const push=o=>{o.sub=nearestSub(o.ll);POIS.push(o);};
  // 지연 로드 데이터는 로드된 것만 인덱싱(스크립트 로드 시 POIS=null로 무효화 → 재구축)
  schoolData().forEach(s=>push({kind:'school',st:s.t,n:s.n,ll:s.ll}));
  if(typeof HOSPITALS!=='undefined')HOSPITALS.forEach(h=>push({kind:'hosp',st:'hos',n:h.n,ll:h.ll}));
  if(typeof MEDICAL!=='undefined')MEDICAL.forEach(m=>push({kind:'hosp',st:m.t,n:m.n,ll:m.ll}));
  if(typeof RESTAURANTS!=='undefined')RESTAURANTS.forEach(r=>push({kind:'rest',st:r.t,c:r.c,n:r.n,ll:r.ll}));
  if(typeof CAFES!=='undefined')CAFES.forEach(c=>push({kind:'cafe',st:c.t,n:c.n,ll:c.ll}));
  if(typeof PUBS!=='undefined')PUBS.forEach(p=>push({kind:'pub',st:p.t,n:p.n,ll:p.ll}));
  if(typeof PARKS!=='undefined')PARKS.forEach(p=>{if(p.n)push({kind:'park',st:p.t,n:p.n,ll:p.ll});}); // 이름있는 것만 검색(음수대·화장실 무명 제외)
  if(typeof ADMIN!=='undefined')ADMIN.forEach(a=>{if(a.n)push({kind:'admin',st:a.t,n:a.n,ll:a.ll});});
  if(typeof MARTS!=='undefined')MARTS.forEach(m=>push({kind:'mart',st:m.t,o:m.o,n:m.n,ll:m.ll}));
  if(typeof MALLS!=='undefined')MALLS.forEach(m=>push({kind:'mall',n:m.n,ll:m.ll}));
  TRANSIT.stations.forEach(s=>push({kind:'station',st:s.t,n:s.n,ll:s.ll}));
  MARKERS.forEach(m=>push({kind:'poi',n:m.name,ll:[m.lat,m.lng],ov:m.ov}));
  return POIS;
}
function poiMeta(p){
  const t=T();let lab;
  if(p.kind==='school')lab=t.schoolTypes[p.st]||t.layers.schools;
  else if(p.kind==='hosp')lab=t.hospTypes[p.st];
  else if(p.kind==='mart')lab=(p.st==='intl'&&p.o&&t.origins[p.o])?`${t.martTypes.intl} · ${t.origins[p.o]}`:t.martTypes[p.st];
  else if(p.kind==='rest'){lab=t.restTypes[p.st]||t.layers.restaurant;if(p.c)lab+=' · '+cuisineLabel(p.c);}
  else if(p.kind==='cafe')lab=t.cafeTypes[p.st]||t.layers.cafe;
  else if(p.kind==='pub')lab=t.pubTypes[p.st]||t.layers.pubs;
  else if(p.kind==='park')lab=t.parkTypes[p.st]||t.layers.parks;
  else if(p.kind==='admin')lab=t.adminTypes[p.st]||t.layers.admin;
  else if(p.kind==='mall')lab=t.layers.shopping;
  else if(p.kind==='station')lab=LANG==='en'?(p.st==='tram'?'Tram stop':'Train station'):(p.st==='tram'?'트램역':'기차역');
  else lab=LANG==='en'?'Landmark':'명소';
  return p.sub?`${lab} · ${p.sub}`:lab;
}
function poiColor(p){
  if(p.kind==='school')return SCHOOL_COLOR[p.st]||SCHOOL_COLOR.o;
  if(p.kind==='hosp')return MED_COLOR[p.st]||MED_COLOR.hos;
  if(p.kind==='rest')return REST_COLOR[p.st]||REST_COLOR.etc;
  if(p.kind==='cafe')return CAFE_COLOR[p.st]||CAFE_COLOR.cafe;
  if(p.kind==='pub')return PUB_COLOR[p.st]||PUB_COLOR.pub;
  if(p.kind==='park')return PARK_COLOR[p.st]||PARK_COLOR.park;
  if(p.kind==='admin')return ADMIN_COLOR[p.st]||ADMIN_COLOR.govt;
  if(p.kind==='mart')return MART_COLOR[p.st]||MART_COLOR.big;
  if(p.kind==='mall')return SHOP_COLOR;
  if(p.kind==='station')return TRANSIT_COLOR[p.st]||TRANSIT_COLOR.train;
  return '#b8860b';
}
function sprRow(i,color,name,meta){
  return `<div class="spr-item" data-i="${i}"><span class="spr-dot" style="background:${color}"></span>`+
    `<span class="spr-text"><span class="spr-name" title="${name}">${name}</span><span class="spr-meta">${meta}</span></span></div>`;
}
function openMarkerAt(layer,ll){
  if(!layer)return;
  layer.eachLayer(l=>{
    if(!l.getLatLng||!l.getPopup)return;
    const q=l.getLatLng();
    if(Math.abs(q.lat-ll[0])<1e-6&&Math.abs(q.lng-ll[1])<1e-6&&l.getPopup())l.openPopup();
  });
}
function openRegMarkerAt(r,ll){ // 레지스트리 오버레이용 — 컬링으로 빠진 마커면 강제 추가 후 팝업
  if(!r||!r.layer)return;
  Object.values(r.markers).forEach(arr=>arr.forEach(mk=>{
    const q=mk.getLatLng();
    if(Math.abs(q.lat-ll[0])<1e-6&&Math.abs(q.lng-ll[1])<1e-6&&mk.getPopup()){
      if(!r.layer.hasLayer(mk))r.layer.addLayer(mk);
      mk.openPopup();
    }
  }));
}
function focusPoi(p){
  if(p.kind==='school'&&!POI_REG.schools.on)setSchoolLayer(true);
  else if(p.kind==='hosp'&&!POI_REG.hospitals.on)setHospitalLayer(true);
  else if(p.kind==='mart'&&!POI_REG.marts.on)setMartLayer(true);
  else if(p.kind==='rest'&&!POI_REG.restaurant.on)setRestLayer(true);
  else if(p.kind==='cafe'&&!POI_REG.cafe.on)setCafeLayer(true);
  else if(p.kind==='pub'&&!POI_REG.pubs.on)setPubLayer(true);
  else if(p.kind==='park'&&!POI_REG.parks.on)setParkLayer(true);
  else if(p.kind==='admin'&&!POI_REG.admin.on)setAdminLayer(true);
  else if(p.kind==='mall'&&!shopOn)setShopLayer(true);
  else if(p.kind==='station'&&!transitOn)setTransitLayer(true);
  if(p.kind==='poi'){
    if(p.ov==='sight'&&!sightOn)setSightLayer(true);
    else if(p.ov==='facility'&&!facOn)setFacLayer(true);
  }
  map.setView(p.ll,ZOOM_POI);
  if(p.kind==='poi'){
    const lay=p.ov==='facility'?()=>facLayer:()=>sightLayer;
    setTimeout(()=>openMarkerAt(lay(),p.ll),140);
    return;
  }
  const regId={school:'schools',hosp:'hospitals',mart:'marts',rest:'restaurant',cafe:'cafe',pub:'pubs',park:'parks',admin:'admin'}[p.kind];
  if(regId)setTimeout(()=>openRegMarkerAt(POI_REG[regId],p.ll),140);
  else if(p.kind==='mall')setTimeout(()=>openMarkerAt(shopLayer,p.ll),140);
}
function searchQuery(q){
  q=q.trim().toLowerCase();
  if(q.length<2)return[];
  const starts=[],contains=[];
  Object.entries(LGAS).forEach(([id,d])=>{
    const n=d.name.toLowerCase();
    if(n.startsWith(q))starts.push({type:'lga',id});
    else if(n.includes(q))contains.push({type:'lga',id});
  });
  SUBURBS.forEach((s,si)=>{
    const n=s.n.toLowerCase();
    if(n.startsWith(q))starts.push({type:'sub',si});
    else if(n.includes(q)||(s.pc&&s.pc.startsWith(q)))contains.push({type:'sub',si});
  });
  getPois().forEach((p,pi)=>{
    const n=p.n.toLowerCase();
    const cz=p.c?(CUISINE[p.c]?CUISINE[p.c].join(' '):p.c).toLowerCase():'';
    if(n.startsWith(q))starts.push({type:'poi',pi});
    else if(n.includes(q)||(cz&&cz.includes(q)))contains.push({type:'poi',pi});
  });
  return starts.concat(contains).slice(0,10);
}
function focusSuburb(si){
  const s=SUBURBS[si];if(!s)return;
  if(!suburbOn)setSuburbLayer(true);
  const poly=suburbPolys[si];if(!poly)return;
  deselectSuburb();selectedSubPoly=poly;poly.setStyle(SUB_SEL);
  openSheet(s.l);
  map.fitBounds(poly.getBounds(),{padding:[90,90],maxZoom:ZOOM_SUB});
}
function focusLga(id){
  deselectSuburb();openSheet(id);
  if(lgaLayers[id])map.fitBounds(lgaLayers[id].getBounds(),{padding:[40,40],maxZoom:ZOOM_LGA});
}
// 검색 배선 — 데스크톱/모바일 입력창 공용
function wireSearch(inputEl,resultsEl){
  let items=[],active=-1;
  function render(list){
    items=list;active=-1;
    if(!list.length){
      resultsEl.innerHTML=`<div class="spr-item"><span class="spr-name" style="color:var(--muted)">${T().searchNone}</span></div>`;
      resultsEl.classList.add('on');return;
    }
    resultsEl.innerHTML=list.map((it,i)=>{
      if(it.type==='lga'){
        const d=LGAS[it.id],c=(CAT_META[d.cat]&&CAT_META[d.cat].color)||'#39415a';
        return sprRow(i,c,d.name,T().searchCouncil);
      }
      if(it.type==='poi'){
        const p=getPois()[it.pi];
        return sprRow(i,poiColor(p),p.n,poiMeta(p));
      }
      const s=SUBURBS[it.si],d=LGAS[s.l];
      const meta=`${T().searchSuburb} · ${s.pc?s.pc+' · ':''}${d?d.name.replace('City of ','').replace('Town of ','').replace('The City of ',''):''}`;
      return sprRow(i,'#39415a',s.n,meta);
    }).join('');
    resultsEl.classList.add('on');
    resultsEl.querySelectorAll('.spr-item[data-i]').forEach(el=>{
      el.addEventListener('mousedown',(e)=>{e.preventDefault();pick(parseInt(el.dataset.i));});
    });
  }
  function pick(i){
    const it=items[i];if(!it)return;
    resultsEl.classList.remove('on');items=[];
    inputEl.value=it.type==='lga'?LGAS[it.id].name:it.type==='poi'?getPois()[it.pi].n:SUBURBS[it.si].n;
    inputEl.blur();
    if(it.type==='lga'){track('search-lga');focusLga(it.id);}
    else if(it.type==='poi'){const pp=getPois()[it.pi];track('search-'+pp.kind);focusPoi(pp);}
    else{track('search-suburb');focusSuburb(it.si);}
  }
  inputEl.addEventListener('focus',()=>{ // 검색 진입 시 전체 데이터 로드(인덱스 완전성) — 로드 후 열린 검색어 재질의
    ensureAllData().then(()=>{
      if(document.activeElement===inputEl&&inputEl.value.trim().length>=2)render(searchQuery(inputEl.value));
    }).catch(()=>{});
  });
  inputEl.addEventListener('input',()=>{
    if(inputEl.value.trim().length<2){resultsEl.classList.remove('on');return;}
    render(searchQuery(inputEl.value));
  });
  inputEl.addEventListener('keydown',(e)=>{
    if(!items.length&&e.key!=='Escape')return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){
      e.preventDefault();
      active=e.key==='ArrowDown'?Math.min(active+1,items.length-1):Math.max(active-1,0);
      resultsEl.querySelectorAll('.spr-item').forEach((el,i)=>el.classList.toggle('active',i===active));
    }else if(e.key==='Enter'){e.preventDefault();pick(active>=0?active:0);}
    else if(e.key==='Escape'){resultsEl.classList.remove('on');inputEl.blur();}
  });
  inputEl.addEventListener('blur',()=>setTimeout(()=>resultsEl.classList.remove('on'),150));
}
wireSearch(document.getElementById('sp-search'),document.getElementById('sp-results'));
wireSearch(document.getElementById('m-search'),document.getElementById('m-results'));

// ═══════════════ 미니 범례 ═══════════════
function scaleBar(scale){return `<div class="ml-bar">${scale.map(c=>`<div style="flex:1;background:${c}"></div>`).join('')}</div>`;}
function renderMiniLegend(){
  const el=document.getElementById('mini-legend'),t=T();
  let html='';
  if(mapColorMode==='rent'){
    html+=`<div class="ml-title">${t.colorModes.rent} · ${t.rentUnit}</div>`+scaleBar(RENT_SCALE)+`<div class="ml-ends"><span>${t.low}</span><span>${t.high}</span></div><div class="ml-note">${t.rentNote}</div>`;
  }else if(mapColorMode==='crime'){
    html+=`<div class="ml-title">${t.colorModes.crime} · ${t.crimeUnit}</div>`+scaleBar(CRIME_SCALE)+`<div class="ml-ends"><span>${t.low}</span><span>${t.high}</span></div><div class="ml-note">${t.crimeNote}</div>`;
  }
  if(transitOn){
    html+=`<div class="ml-title" style="margin-top:7px">${t.layers.transit}</div>`+
      [['train',t.train],['tram',t.tram],['bus',t.bus]].map(([k,lab])=>`<div class="ml-item ml-click${transitFilter&&transitFilter!==k?' dim':''}" data-tr="${k}"><span class="ml-dot" style="color:${TRANSIT_COLOR[k]}"></span>${lab}</div>`).join('');
  }
  if(POI_REG.schools.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.school}</svg></span>${t.layers.schools}</div>`+
      ['p','s','u','c','o'].map(k=>`<div class="ml-item ml-click${POI_REG.schools.filter&&POI_REG.schools.filter!==k?' dim':''}" data-sch="${k}"><span class="ml-dot" style="color:${SCHOOL_COLOR[k]}"></span>${t.schoolTypes[k]}</div>`).join('');
  }
  if(POI_REG.hospitals.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.hospital}</svg></span>${t.layers.hospitals}</div>`+
      ['hos','dr','de','km','ph'].map(k=>`<div class="ml-item ml-click${POI_REG.hospitals.filter&&POI_REG.hospitals.filter!==k?' dim':''}" data-hos="${k}"><span class="ml-dot" style="color:${MED_COLOR[k]}"></span>${t.hospTypes[k]}</div>`).join('');
  }
  if(POI_REG.marts.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.mart}</svg></span>${t.layers.marts}</div>`+
      ['big','local','intl','liq'].map(k=>`<div class="ml-item ml-click${POI_REG.marts.filter&&POI_REG.marts.filter!==k?' dim':''}" data-mart="${k}"><span class="ml-dot" style="color:${MART_COLOR[k]}"></span>${t.martTypes[k]}</div>`).join('');
  }
  if(POI_REG.restaurant.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.restaurant}</svg></span>${t.layers.restaurant}</div>`+
      ['as','eu','am','etc'].map(k=>`<div class="ml-item ml-click${POI_REG.restaurant.filter&&POI_REG.restaurant.filter!==k?' dim':''}" data-rest="${k}"><span class="ml-dot" style="color:${REST_COLOR[k]}"></span>${t.restTypes[k]}</div>`).join('');
  }
  if(shopOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.shopping}</svg></span>${t.layers.shopping}</div>`+
      `<div class="ml-item"><span class="ml-dot" style="color:${SHOP_COLOR}"></span>${LANG==='en'?'Major centre':'주요 쇼핑센터'}</div>`;
  }
  if(sightOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.landmark}</svg></span>${t.layers.sight}</div>`+
      ['beach','wine','venue'].map(k=>`<div class="ml-item ml-click${sightFilter&&sightFilter!==k?' dim':''}" data-sight="${k}"><span class="ml-dot" style="color:${SIGHT_COLOR[k]}"></span>${t.sightTypes[k]}</div>`).join('');
  }
  if(facOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.facility}</svg></span>${t.layers.facility}</div>`+
      ['air','port','district'].map(k=>`<div class="ml-item ml-click${facFilter&&facFilter!==k?' dim':''}" data-fac="${k}"><span class="ml-dot" style="color:${FAC_COLOR[k]}"></span>${t.facTypes[k]}</div>`).join('');
  }
  if(POI_REG.cafe.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.cafe}</svg></span>${t.layers.cafe}</div>`+
      ['cafe','bakery','brunch'].map(k=>`<div class="ml-item ml-click${POI_REG.cafe.filter&&POI_REG.cafe.filter!==k?' dim':''}" data-cafe="${k}"><span class="ml-dot" style="color:${CAFE_COLOR[k]}"></span>${t.cafeTypes[k]}</div>`).join('');
  }
  if(POI_REG.pubs.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.pub}</svg></span>${t.layers.pubs}</div>`+
      ['pub','bar','wine','brew','club'].map(k=>`<div class="ml-item ml-click${POI_REG.pubs.filter&&POI_REG.pubs.filter!==k?' dim':''}" data-pub="${k}"><span class="ml-dot" style="color:${PUB_COLOR[k]}"></span>${t.pubTypes[k]}</div>`).join('');
  }
  if(POI_REG.parks.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.park}</svg></span>${t.layers.parks}</div>`+
      ['park','water','toilet','fitness'].map(k=>`<div class="ml-item ml-click${POI_REG.parks.filter&&POI_REG.parks.filter!==k?' dim':''}" data-park="${k}"><span class="ml-dot" style="color:${PARK_COLOR[k]}"></span>${t.parkTypes[k]}</div>`).join('');
  }
  if(POI_REG.admin.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.admin}</svg></span>${t.layers.admin}</div>`+
      ['govt','bank','post','telecom','lib'].map(k=>`<div class="ml-item ml-click${POI_REG.admin.filter&&POI_REG.admin.filter!==k?' dim':''}" data-admin="${k}"><span class="ml-dot" style="color:${ADMIN_COLOR[k]}"></span>${t.adminTypes[k]}</div>`).join('');
  }
  el.innerHTML=html;
  el.style.display=html?'':'none';
  el.querySelectorAll('.ml-item[data-pub]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setPubFilter(it.dataset.pub);}));
  el.querySelectorAll('.ml-item[data-cafe]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setCafeFilter(it.dataset.cafe);}));
  el.querySelectorAll('.ml-item[data-park]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setParkFilter(it.dataset.park);}));
  el.querySelectorAll('.ml-item[data-admin]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setAdminFilter(it.dataset.admin);}));
  el.querySelectorAll('.ml-item[data-sch]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setSchoolFilter(it.dataset.sch);}));
  el.querySelectorAll('.ml-item[data-tr]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setTransitFilter(it.dataset.tr);}));
  el.querySelectorAll('.ml-item[data-hos]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setHospitalFilter(it.dataset.hos);}));
  el.querySelectorAll('.ml-item[data-mart]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setMartFilter(it.dataset.mart);}));
  el.querySelectorAll('.ml-item[data-rest]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setRestFilter(it.dataset.rest);}));
  el.querySelectorAll('.ml-item[data-sight]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setSightFilter(it.dataset.sight);}));
  el.querySelectorAll('.ml-item[data-fac]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setFacFilter(it.dataset.fac);}));
}

// ═══════════════ 피드백 모달 ═══════════════
const FEEDBACK_ENDPOINT='https://formsubmit.co/ajax/4daba310c39387b2cac62a9e9796d9c6';
function tl(t){return{tip:'💡 꿀팁',correction:'🔧 정정',experience:'✨ 경험담',question:'❓ 질문'}[t]||t;}
let lastSent=0;
document.getElementById('fb-open').addEventListener('click',()=>document.getElementById('fb-overlay').classList.add('on'));
document.getElementById('fbm-close').addEventListener('click',()=>document.getElementById('fb-overlay').classList.remove('on'));
document.getElementById('fb-overlay').addEventListener('click',(e)=>{
  if(e.target===document.getElementById('fb-overlay'))document.getElementById('fb-overlay').classList.remove('on');
});
document.getElementById('fbm-send').addEventListener('click',async()=>{
  const btn=document.getElementById('fbm-send'),status=document.getElementById('fbm-status'),t=T();
  const body=document.getElementById('f-body').value.trim();
  if(!body){status.textContent=t.stEmpty;status.className='fbm-status err';return;}
  if(body.length>2000){status.textContent=t.stLong;status.className='fbm-status err';return;}
  if(Date.now()-lastSent<30000){status.textContent=t.stWait;status.className='fbm-status err';return;}
  btn.disabled=true;status.textContent=t.stSending;status.className='fbm-status';
  const author=document.getElementById('f-author').value.trim()||'익명';
  const area=document.getElementById('f-area').value;
  const type=tl(document.getElementById('f-type').value);
  try{
    const r=await fetch(FEEDBACK_ENDPOINT,{
      method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({_subject:`[Adelaide 지도 피드백] ${type} · ${area}`,_template:'table',_captcha:'false',닉네임:author,지역:area,유형:type,내용:body}),
    });
    if(!r.ok)throw new Error('HTTP '+r.status);
    lastSent=Date.now();
    track('feedback-submit');
    status.textContent=t.stOk;status.className='fbm-status ok';
    document.getElementById('f-body').value='';document.getElementById('f-author').value='';
  }catch{status.textContent=t.stFail;status.className='fbm-status err';}
  btn.disabled=false;
});

// ═══════════════ 토스트 & 언어 ═══════════════
let toastTimer=null;
function toast(msg,ms){
  const el=document.getElementById('toast');
  el.textContent=msg;el.classList.add('on');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('on'),ms||2500);
}
function applyLang(){
  const t=T();
  document.documentElement.lang=LANG;document.title=t.docTitle;
  document.getElementById('sp-title').textContent=t.title;
  document.getElementById('lang-toggle').textContent=t.langBtn;
  document.getElementById('sp-search').placeholder=t.searchPh;
  document.getElementById('m-search').placeholder=t.searchPh;
  document.getElementById('m-lang').textContent=t.langBtn;
  document.getElementById('lbl-overlay').textContent=t.lblOverlay;
  document.getElementById('lbl-color').textContent=t.lblColor;
  document.getElementById('fb-open').textContent=t.fbOpen;
  document.getElementById('sp-foot').textContent=t.sources;
  renderOverlayRows();renderColorSeg();renderMiniLegend();buildVibes();
  renderMOverlayBar();renderMSubBar();renderMColorBtn();renderMScale();
  if(selectedLgaId)openSheet(selectedLgaId);
  // 레이어 툴팁 언어 재생성 — POI 8종은 레지스트리 루프
  Object.values(POI_REG).forEach(r=>{
    if(r.layer){
      const wasOn=r.on;
      if(wasOn)map.removeLayer(r.layer);
      r.layer=null;
      if(wasOn){ovBuild(r);r.layer.addTo(map);}
    }
  });
  [['suburb',()=>suburbLayer,(v)=>suburbLayer=v,buildSuburbLayer,()=>suburbOn],
   ['transit',()=>transitLayer,(v)=>transitLayer=v,buildTransitLayer,()=>transitOn],
   ['shop',()=>shopLayer,(v)=>shopLayer=v,buildShopLayer,()=>shopOn],
   ['sight',()=>sightLayer,(v)=>sightLayer=v,buildSightLayer,()=>sightOn],
   ['facility',()=>facLayer,(v)=>facLayer=v,buildFacLayer,()=>facOn]].forEach(([_,get,set,build,isOn])=>{
    if(get()){
      const wasOn=isOn();
      if(wasOn)map.removeLayer(get());
      if(_==='suburb')selectedSubPoly=null;
      set(null);
      if(wasOn){build();get().addTo(map);}
    }
  });
  // 모달
  document.getElementById('fbm-title').textContent=t.fbTitle;
  document.getElementById('fbm-sub').textContent=t.fbSub;
  document.getElementById('fbm-lbl-author').textContent=t.lblAuthor;
  document.getElementById('f-author').placeholder=t.phAuthor;
  document.getElementById('fbm-lbl-type').textContent=t.lblType;
  document.querySelectorAll('#f-type option').forEach(o=>{o.textContent=t.types[o.value]||o.textContent;});
  document.getElementById('fbm-lbl-area').textContent=t.lblArea;
  document.getElementById('opt-none').textContent=t.optNone;
  document.getElementById('fbm-lbl-body').textContent=t.lblBody;
  document.getElementById('f-body').placeholder=t.phBody;
  document.getElementById('fbm-send').textContent=t.btnSend;
  document.getElementById('fbm-status').textContent='';
}
function toggleLang(){
  LANG=LANG==='ko'?'en':'ko';
  try{localStorage.setItem('adelaide-lang',LANG);}catch{}
  applyLang();
  track('lang-'+LANG);
}
document.getElementById('lang-toggle').addEventListener('click',toggleLang);
document.getElementById('m-lang').addEventListener('click',toggleLang);

// ═══════════════ 모바일: 오버레이 칩바 · 하위칩 · 렌트/치안 · 스케일 ═══════════════
const isMobile=()=>matchMedia('(max-width:680px)').matches;
const M_SUB={
  transit:{items:()=>[['train',T().train],['tram',T().tram],['bus',T().bus]],colors:TRANSIT_COLOR,getF:()=>transitFilter,setF:setTransitFilter},
  schools:{items:()=>['p','s','u','c','o'].map(k=>[k,T().schoolTypes[k]]),colors:SCHOOL_COLOR,getF:()=>POI_REG.schools.filter,setF:setSchoolFilter},
  hospitals:{items:()=>['hos','dr','de','km','ph'].map(k=>[k,T().hospTypes[k]]),colors:MED_COLOR,getF:()=>POI_REG.hospitals.filter,setF:setHospitalFilter},
  marts:{items:()=>['big','local','intl','liq'].map(k=>[k,T().martTypes[k]]),colors:MART_COLOR,getF:()=>POI_REG.marts.filter,setF:setMartFilter},
  restaurant:{items:()=>['as','eu','am','etc'].map(k=>[k,T().restTypes[k]]),colors:REST_COLOR,getF:()=>POI_REG.restaurant.filter,setF:setRestFilter},
  cafe:{items:()=>['cafe','bakery','brunch'].map(k=>[k,T().cafeTypes[k]]),colors:CAFE_COLOR,getF:()=>POI_REG.cafe.filter,setF:setCafeFilter},
  pubs:{items:()=>['pub','bar','wine','brew','club'].map(k=>[k,T().pubTypes[k]]),colors:PUB_COLOR,getF:()=>POI_REG.pubs.filter,setF:setPubFilter},
  parks:{items:()=>['park','water','toilet','fitness'].map(k=>[k,T().parkTypes[k]]),colors:PARK_COLOR,getF:()=>POI_REG.parks.filter,setF:setParkFilter},
  admin:{items:()=>['govt','bank','post','telecom','lib'].map(k=>[k,T().adminTypes[k]]),colors:ADMIN_COLOR,getF:()=>POI_REG.admin.filter,setF:setAdminFilter},
  sight:{items:()=>['beach','wine','venue'].map(k=>[k,T().sightTypes[k]]),colors:SIGHT_COLOR,getF:()=>sightFilter,setF:setSightFilter},
  facility:{items:()=>['air','port','district'].map(k=>[k,T().facTypes[k]]),colors:FAC_COLOR,getF:()=>facFilter,setF:setFacFilter},
};
let mExpanded=null;
function movMark(o){
  if(o.cat)return `<span class="mov-g"><svg width="15" height="15" viewBox="0 0 24 24">${GLYPHS[o.cat]}</svg></span>`;
  if(o.id==='transit')return `<span class="mov-g"><span style="width:9px;height:9px;border-radius:50%;background:currentColor"></span></span>`;
  if(o.id==='suburb')return `<span class="mov-g"><span style="width:13px;border-top:2px dashed currentColor"></span></span>`;
  return '';
}
function renderMOverlayBar(){
  const bar=document.getElementById('m-overlaybar');if(!bar)return;
  const anyOn=OVERLAYS.some(o=>o.id!=='suburb'&&o.get());
  const rc=document.getElementById('m-ovreset'); // 칩바 밖 고정 버튼(아이콘만) — 스크롤 무관 상시 노출
  if(rc){rc.classList.toggle('on',anyOn);rc.title=T().clearAll;}
  bar.classList.toggle('reset-pad',anyOn);
  bar.innerHTML=OVERLAYS.map(o=>{
    const hasSub=!!M_SUB[o.id];
    return `<span class="mov-chip${o.get()?' on':''}${o.get()&&ovDataPending(o.id)?' loading':''}" data-ov="${o.id}">${movMark(o)}${T().layers[o.id]}${hasSub?'<span class="mov-caret">▾</span>':''}</span>`;
  }).join('');
  bar.querySelectorAll('.mov-chip[data-ov]').forEach(c=>c.addEventListener('click',()=>onMChip(c.dataset.ov)));
}
(function(){ // 모두 해제 버튼: 1회 배선(아이콘 고정, on/off는 renderMOverlayBar가 토글)
  const rc=document.getElementById('m-ovreset');if(!rc)return;
  rc.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19.4 12a7.4 7.4 0 1 1-2.1-5.2M18 3.5V8h-4.5"/></svg>';
  rc.addEventListener('click',()=>{OVERLAYS.filter(o=>o.id!=='suburb').forEach(o=>{if(o.get())o.set(false);});mExpanded=null;renderMOverlayBar();renderMSubBar();});
})();
function onMChip(id){
  const o=OVERLAYS.find(x=>x.id===id),hasSub=!!M_SUB[id];
  if(!o.get()){o.set(true);mExpanded=hasSub?id:null;track('ov-'+id);}
  else if(hasSub&&mExpanded!==id){mExpanded=id;}      // 다른 켜진 칩 → 그 하위 펼침
  else{o.set(false);if(mExpanded===id)mExpanded=null;} // 펼친 칩 다시 탭 → 끔
  renderMOverlayBar();renderMSubBar();
}
function renderMSubBar(){
  const sb=document.getElementById('m-subbar');if(!sb)return;
  const cfg=mExpanded&&M_SUB[mExpanded],o=mExpanded&&OVERLAYS.find(x=>x.id===mExpanded);
  if(!cfg||!o||!o.get()){sb.classList.remove('on');sb.innerHTML='';return;}
  const f=cfg.getF();
  sb.innerHTML=cfg.items().map(([k,lab])=>{ // 상위칩과 동일 필 + 컬러 도트 내장. 선택=다크 필, 격리 비선택=dim(도트 색 유지)
    const col=cfg.colors[k];
    return `<span class="msub-chip${f===k?' on':(f?' dim':'')}" data-k="${k}"><span class="msub-dot" style="color:${col}"></span>${lab}</span>`;
  }).join('');
  sb.classList.add('on');
  sb.querySelectorAll('.msub-chip').forEach(c=>c.addEventListener('click',()=>{cfg.setF(c.dataset.k);renderMSubBar();}));
}
// 지도 색상: 단일 버튼 + 팝업(카테고리/렌트/치안 … 향후 항목 추가만 하면 됨)
const COLOR_ICON={
  category:'<path fill="currentColor" d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  rent:'<path fill="currentColor" d="M12 3.5 2.5 11.5h2.6v8.5h5.1v-5.4h3.6v5.4h5.1v-8.5h2.6z"/>',
  crime:'<path fill="currentColor" d="M12 2.5 4.5 5.5v6.2c0 4.4 3.2 7.6 7.5 8.8 4.3-1.2 7.5-4.4 7.5-8.8V5.5z"/>'
};
const COLOR_BTN_ICON='<circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="currentColor" d="M12 3.6a8.4 8.4 0 0 0 0 16.8z"/>';
function renderMColorBtn(){
  const btn=document.getElementById('m-colorbtn'),pop=document.getElementById('m-colorpop');if(!btn)return;
  btn.classList.toggle('on',mapColorMode!=='category');
  btn.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24">${COLOR_BTN_ICON}</svg>`;
  pop.innerHTML=['category','rent','crime'].map(m=>
    `<div class="mcol-item${mapColorMode===m?' on':''}" data-mode="${m}"><svg width="16" height="16" viewBox="0 0 24 24">${COLOR_ICON[m]}</svg>${T().colorModes[m]}</div>`).join('');
  pop.querySelectorAll('.mcol-item').forEach(it=>it.addEventListener('click',(e)=>{
    e.stopPropagation();mapColorMode=it.dataset.mode;pop.classList.remove('on');
    renderColorSeg();renderMColorBtn();renderMScale();restyleAll();
    if(mapColorMode!=='category')track('color-'+mapColorMode);
  }));
}
function renderMScale(){
  const el=document.getElementById('m-scale');if(!el)return;const t=T();
  if(mapColorMode==='rent'||mapColorMode==='crime'){
    const isR=mapColorMode==='rent';
    el.innerHTML=`<div class="ml-title">${t.colorModes[mapColorMode]} · ${isR?t.rentUnit:t.crimeUnit}</div>`+
      scaleBar(isR?RENT_SCALE:CRIME_SCALE)+`<div class="ml-ends"><span>${t.low}</span><span>${t.high}</span></div>`+
      `<div class="ml-note">${isR?t.rentNote:t.crimeNote}</div>`;
    el.classList.add('on');
  }else{el.innerHTML='';el.classList.remove('on');}
  updateMScalePos();
}
function updateMScalePos(){ // 스케일을 LGA 시트 위로 띄움 (offsetHeight=transform 애니메이션 무관)
  const el=document.getElementById('m-scale');if(!el)return;
  const bs=document.getElementById('bottom-sheet');
  if(isMobile()&&el.classList.contains('on')&&bs.classList.contains('on')){
    el.style.bottom=(bs.offsetHeight+26)+'px';
  }else{el.style.bottom='';}
}
document.getElementById('m-fb').addEventListener('click',()=>document.getElementById('fb-overlay').classList.add('on'));
document.getElementById('m-colorbtn').addEventListener('click',(e)=>{e.stopPropagation();document.getElementById('m-colorpop').classList.toggle('on');});
document.getElementById('m-colorpop').addEventListener('click',(e)=>e.stopPropagation());
map.on('click',()=>document.getElementById('m-colorpop').classList.remove('on'));


// ═══════════════ INIT ═══════════════
applyLang();
setSuburbLayer(true);
restyleAll();
// 모바일 칩바: 스크롤/클릭 전파 차단(touch-action:pan-x와 병행)
['m-overlaybar','m-subbar'].forEach(id=>{
  const el=document.getElementById(id);
  if(el){L.DomEvent.disableScrollPropagation(el);L.DomEvent.disableClickPropagation(el);}
});
// 딥링크: ?lga=unley
try{
  const cm=new URLSearchParams(location.search).get('color');
  if(cm==='rent'||cm==='crime'){mapColorMode=cm;renderColorSeg();renderMColorBtn();renderMScale();restyleAll();}
  const sel=new URLSearchParams(location.search).get('lga');
  if(sel&&LGAS[sel]){openSheet(sel);map.fitBounds(lgaLayers[sel].getBounds(),{padding:[40,40],maxZoom:ZOOM_LGA});}
  else toast(T().hint,3200);
}catch{toast(T().hint,3200);}
