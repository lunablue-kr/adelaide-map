// ▓▓▓ CORE — 애널리틱스·i18n헬퍼·지연로딩·MAP·색상/LGA·바텀시트·서버브 ▓▓▓ (app-core→app-overlays→app-ui 순서 로드. 전역 스코프 공유; 뒤 파일이 앞 심볼 참조)
// ═══════════════ 애널리틱스 (GoatCounter + Umami 이중, 안전 래퍼) ═══════════════
(function(){
  var skip=false;
  try{
    if(location.hash==='#skip-analytics'){localStorage.setItem('skip-analytics','1');}
    if(localStorage.getItem('skip-analytics')==='1')skip=true;
  }catch(e){}
  // 로컬·파일 직접열기·사설망(LAN) 제외 — 실기기 확인을 192.168.x 등으로 하므로 반드시 포함해야 함
  {const h=location.hostname;
   if(location.protocol==='file:'||/^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/.test(h)
      ||/\.local$/i.test(h)||/^192\.168\./.test(h)||/^10\./.test(h)
      ||/^172\.(1[6-9]|2\d|3[01])\./.test(h))skip=true;}
  if(skip){
    window.goatcounter={no_onload:true};              // GoatCounter 자동집계 차단
    try{localStorage.setItem('umami.disabled','1');}catch(e){} // Umami 자동집계 차단
  }else{
    try{localStorage.removeItem('umami.disabled');}catch(e){}
  }
  window.__ANALYTICS_SKIP__=skip;window.IS_DEV=skip&&location.protocol!=='https:';
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
document.documentElement.dataset.lang=LANG;
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
// 버전은 loadDataScript가 ?v=BUILD로 일괄 부여(2026-08-02 이행 배포부터).
const OV_FILES={
  transit:['data-transit-bus.js'],
  schools:['data-schools-primary.js','data-schools-secondary.js','data-schools-tertiary.js','data-schools-other.js'],
  hospitals:['data-hospitals.js','data-medical.js'],
  marts:['data-shops.js'],
  shopping:['data-shops.js'],
  restaurant:['data-restaurants.js'],
  cafe:['data-cafes.js'],
  pubs:['data-pubs.js'],
  parks:['data-parks.js'],
  admin:['data-admin.js'],
  runs:['data-runs.js'],
};
const _dataLoaded={},_dataLoading={};
function loadDataScript(src){
  if(_dataLoaded[src])return Promise.resolve();
  if(_dataLoading[src])return _dataLoading[src]; // 이중 주입 방지
  _dataLoading[src]=new Promise((ok,fail)=>{
    const s=document.createElement('script');
    s.src=src+'?v='+BUILD; // 데이터 파일도 배포 단위로 캐시 무효화
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
  // 거절된 프로미스를 캐시하면 재시도가 영영 안 일어나 세션 내내 검색이 조용히 반쪽이 됨
  if(!_allDataP)_allDataP=Promise.all([...new Set(Object.values(OV_FILES).flat())].map(loadDataScript))
    .catch(e=>{_allDataP=null;throw e;});
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
const BUILD='20260817a';
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
  attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> (<a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener">ODbL</a>) · © <a href="https://overturemaps.org" target="_blank" rel="noopener">Overture Maps</a> · © <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
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
// 채도만 낮춰 '물러나게' 함(알파로 지우면 베이스맵 틴트와 같은 노이즈 바닥이 됨: 대비비 1.05)
function desatHex(hex,f){
  const n=parseInt(hex.slice(1),16),r=n>>16&255,g=n>>8&255,b=n&255;
  const l=0.2126*r+0.7152*g+0.0722*b;
  const m=(v)=>Math.round(l+(v-l)*f);
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}
const SUB_SEL_INK='#334155'; // 선택 서버브: 같은 색을 겹치지 않고 명도만 낮춤(전 카테고리 대비 1.65로 균일)
const HAIRLINE={color:'#ffffff',weight:0.6,opacity:0.35}; // 면과 면 사이의 '틈'. 색 테두리로 읽히지 않게 흰색·가늘게
function restyleAll(){
  // 라이트 배경 대응: 면 채움을 등급 구분되게(2026-07-19, 다크 때 0.11서 상향). 핀은 라이트 대비 충분해 가독 유지
  // 강조는 테두리가 아니라 '면'으로. 기본을 낮춰야 선택 대비가 살아남(0.22 vs 0.48 = 2.2배).
  const fillBase=0.22, fillDim=0.10, fillSel=0.48, fillOther=0.22; // 비선택도 알파는 유지 — 구분은 채도로
  Object.entries(lgaLayers).forEach(([id,layer])=>{
    const c=lgaColor(id);
    // 흰 hairline: 같은 카테고리 LGA가 인접해 붙어 보이는 것만 막는 최소 구분선(색 테두리 아님)
    if(id===selectedLgaId){layer.setStyle({...HAIRLINE,fillColor:c,fillOpacity:fillSel});} // bringToFront 금지 — 단일 캔버스라 핀 위로 올라옴
    else if(selectedLgaId){layer.setStyle({...HAIRLINE,opacity:0.22,fillColor:desatHex(c,0.30),fillOpacity:fillOther});} // 지우지 않고 물러나게
    else{
      const dim=activeCat!=='all'&&LGAS[id].cat!==activeCat;
      layer.setStyle({...HAIRLINE,opacity:dim?0.2:HAIRLINE.opacity,fillColor:dim?desatHex(c,0.30):c,fillOpacity:dim?fillDim:fillBase});
    }
  });
  renderMiniLegend();
}

const lgaLayers={};
Object.entries(LGA_BOUNDARIES).forEach(([id,geom])=>{
  if(!LGAS[id])return;
  const layer=L.geoJSON({type:'Feature',properties:{},geometry:geom},{
    renderer:VEC_CANVAS,
    style:{...HAIRLINE,fillColor:lgaColor(id),fillOpacity:0.22},
  }).addTo(map);
  layer.on('click',(e)=>{L.DomEvent.stopPropagation(e);if(_popupOpen)map.closePopup(); // 팝업은 닫되 선택은 그대로 진행(탭 1회=결과 1개)
    if(selectedLgaId===id&&!selectedSubPoly){deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();return;} // 같은 LGA 재탭 = 닫기
    deselectSuburb();openSheet(id);setSheetSuburbAt(e.latlng);});
  layer.on('mouseover',()=>{if(selectedLgaId)return;layer.setStyle({fillOpacity:0.32});});
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
// 현재 선택 상태를 주소창에 반영(리로드 없음) — 브라우저 공유·복사 링크가 그대로 딥링크가 됨
function syncUrl(){
  try{
    const u=new URL(location.href);
    ['lga','sub'].forEach(k=>u.searchParams.delete(k));
    if(selectedLgaId){
      u.searchParams.set('lga',selectedLgaId);
      const sn=document.getElementById('bs-subname');
      if(sn&&sn.classList.contains('on')&&sn.dataset.sub)u.searchParams.set('sub',sn.dataset.sub);
    }
    history.replaceState(null,'',u);
  }catch(e){}
}
// 공유: 모바일=네이티브 시트, 데스크톱=클립보드 복사 (+토스트)
async function shareLink(){
  const t=T(); track('share');
  const url=location.href.split('#')[0];
  if(navigator.share){
    try{await navigator.share({title:'Adelaide 지역 가이드 · Local Guide',text:t.shareText,url});return;}
    catch(e){if(e&&e.name==='AbortError')return;}
  }
  try{await navigator.clipboard.writeText(url);toast(t.shareCopied);return;}
  catch(e){}
  try{ // 구형/권한거부 폴백: 임시 textarea + execCommand
    const ta=document.createElement('textarea');ta.value=url;ta.style.cssText='position:fixed;opacity:0';
    document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
    toast(t.shareCopied);
  }catch(e){toast(url);}
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
  clearSheetSuburb();

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
  bs.classList.add('on');bs.classList.remove('ov-mode'); // 패널 열린 채 LGA 선택 시 LGA가 가려지지 않게
  if(typeof ovPanelPrevLga!=='undefined')ovPanelPrevLga=null;
  bs.scrollTop=0;
  syncUrl();
  if(typeof setSnap==='function')setSnap('peek'); // 열 때는 항상 peek부터
  document.body.classList.add('sheet-on');
  if(typeof updateMScalePos==='function')updateMScalePos();
  updateSheetFade();
}
// 시트 하단 페이드: 접힘 상태엔 항상(펼칠 게 있음), 펼침 상태엔 스크롤 여지가 남았을 때만
function updateSheetFade(){
  const bs=document.getElementById('bottom-sheet');if(!bs)return;
  if(!bs.classList.contains('on')){bs.classList.remove('more');return;}
  const room=bs.scrollHeight-bs.clientHeight;    // 잘린 내용이 남았는가
  const atBottom=bs.scrollTop>=room-2;
  bs.classList.toggle('more',room>2&&!atBottom);
}
(function(){const bs=document.getElementById('bottom-sheet');
  bs.addEventListener('scroll',updateSheetFade,{passive:true});
  window.addEventListener('resize',updateSheetFade);})();
// 서버브 이름 줄 — 터치엔 hover가 없어 툴팁을 못 쓰므로 시트가 정본
function setSheetSuburb(s){
  const el=document.getElementById('bs-subname');if(!el)return;
  el.dataset.sub=s.n; // 공유 URL용
  const l2n=(s.l2||[]).map(id=>LGAS[id]?LGAS[id].name:id).join(' · ');
  el.innerHTML=`<b>${s.n}</b>${s.pc?' · '+s.pc:''}`+(l2n?` <span>${T().partly(l2n)}</span>`:'');
  el.classList.add('on');
  if(typeof updateSheetFade==='function')updateSheetFade();
  syncUrl();
}
function setSheetSuburbAt(latlng){ // 탭 좌표로 서버브 역산(point-in-polygon) — 폴리곤 히트테스트에 의존하지 않음
  if(!latlng)return;
  const n=nearestSub([latlng.lat,latlng.lng]);
  const s=SUBURBS.find(x=>x.n===n);
  if(s)setSheetSuburb(s);
}
function clearSheetSuburb(){const el=document.getElementById('bs-subname');if(el){el.classList.remove('on');el.innerHTML='';delete el.dataset.sub;}syncUrl();}
function closeSheet(){const bs=document.getElementById('bottom-sheet');bs.classList.remove('on');bs.classList.remove('snap-half');sheetSnap='peek';bs.classList.remove('ov-mode');bs.classList.remove('more');document.body.classList.remove('sheet-on');if(typeof updateMScalePos==='function')updateMScalePos();syncUrl();}
document.getElementById('bs-close').addEventListener('click',(e)=>{e.stopPropagation();deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();});
// 모바일 바텀시트 3단 스냅 — 스크롤이 시트를 밀어올리고, full에서만 내용이 스크롤된다.
// (Apple prefersScrollingExpandsWhenScrolledToEdge=true / Material nested scroll / eBay·Flutter 문서와 동일 규칙)
const SNAPS=['peek','half']; // 2단 — 프로젝트 원칙이 map-first(지도 가림 최소화), 기존 상한 46vh와 같은 급
let sheetSnap='peek';
function setSnap(name){
  const bs=document.getElementById('bottom-sheet');if(!bs)return;
  sheetSnap=name;
  bs.classList.toggle('snap-half',name==='half');
  if(name==='peek')bs.scrollTop=0;      // peek에선 내용 스크롤 없음
  updateMScalePos();updateSheetFade();
}
function stepSnap(dir){ // dir +1 확장 / -1 축소
  const i=SNAPS.indexOf(sheetSnap)+dir;
  if(i<0){deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();return true;} // peek에서 더 내리면 닫기
  if(i>=SNAPS.length)return false;
  setSnap(SNAPS[i]);return true;
}
(function(){
  const bs=document.getElementById('bottom-sheet');
  const DRAG=24;        // 단계 전환 최소 이동(px)
  const FLING=0.5;      // 플링 임계(px/ms) — Material significantVelocityThreshold 500dp/s와 동일
  let y0=null,t0=0,lastY=0,lastT=0,locked=false;
  bs.addEventListener('transitionend',e=>{if(e.propertyName!=='max-height')return; // 높이 전환이 끝난 뒤 재판정
    updateSheetFade();
    if(typeof updateMScalePos==='function')updateMScalePos();}); // 전환 중엔 높이가 옛 값이라 스케일바가 시트 뒤로 숨었음
  bs.addEventListener('scroll',()=>{locked=true;clearTimeout(bs._sl);
    bs._sl=setTimeout(()=>{locked=false;},160);},{passive:true}); // 관성 중 시트가 끌려가지 않게
  bs.addEventListener('touchstart',e=>{
    y0=lastY=e.touches[0].clientY;t0=lastT=e.timeStamp;},{passive:true});
  bs.addEventListener('touchmove',e=>{
    if(y0==null||!isMobile())return;
    const y=e.touches[0].clientY, dy=y0-y;           // 위로 밀면 +
    const v=Math.abs(y-lastY)/Math.max(1,e.timeStamp-lastT);
    lastY=y;lastT=e.timeStamp;
    if(dy>0){                                        // 위로 — 시트를 먼저 키운다
      if(sheetSnap!=='half'){
        if(v>=FLING){e.preventDefault();setSnap('half');y0=y;return;}
        if(dy>DRAG){e.preventDefault();stepSnap(+1);y0=y;}
      }                                              // 최대 단계면 내용 스크롤에 위임
    }else{                                           // 아래로 — 내용이 맨 위일 때만 접는다
      if(bs.scrollTop<=0&&!locked){
        if(v>=FLING){e.preventDefault();deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();y0=null;return;}
        if(-dy>DRAG){e.preventDefault();stepSnap(-1);y0=y;}
      }
    }
  },{passive:false});
  bs.addEventListener('touchend',()=>{y0=null;},{passive:true});
  // 데스크톱 휠도 같은 규칙
  bs.addEventListener('wheel',e=>{
    if(isMobile())return;
    if(e.deltaY>0&&sheetSnap!=='half'){e.preventDefault();stepSnap(+1);}
    else if(e.deltaY<0&&bs.scrollTop<=0&&sheetSnap!=='peek'){e.preventDefault();stepSnap(-1);}
  },{passive:false});
  // 핸들 탭 = 단계 순환(접근성 보조 경로, Material BottomSheetDragHandleView와 동일)
  bs.querySelector('.bs-grab').addEventListener('click',()=>{
    if(!isMobile())return;
    setSnap(sheetSnap==='half'?'peek':'half');
  });
})();
// 지도를 움직이면 시트를 peek로 접어 지도를 보여준다(닫지는 않음) — Google Maps 방식
map.on('dragstart',()=>{if(isMobile()&&sheetSnap!=='peek')setSnap('peek');});

// ═══════════════ 서버브 레이어 ═══════════════
let suburbLayer=null,suburbOn=false,selectedSubPoly=null,suburbPolys={};
const HOVERABLE=window.matchMedia&&window.matchMedia('(hover: hover)').matches;
const SUB_BASE={color:'rgba(60,70,100,0.55)',weight:0.8,opacity:1,dashArray:'3 3',fillOpacity:0.02};
// 선택 서버브 = 그 LGA 카테고리색 기반(경계 진하게·채움 은은) — 검정 대신 어울리는 색
function subSelStyle(cat){return {...SUB_BASE,fillColor:SUB_SEL_INK,fillOpacity:0.30};} // 같은 색 겹치면 상위 대비 1.08~1.17로 묻힘 → 명도만 낮춤. 점선은 「서버브 경계」 오버레이 기능이라 유지
// LGA·서버브·POI가 모두 같은 캔버스(VEC_CANVAS)를 쓴다. Leaflet은 클릭 시 그리기 목록에서
// '마지막으로 일치한 레이어'를 대상으로 잡으므로 순서가 곧 클릭 우선순위다.
// 올바른 순서: LGA(맨 아래) < 서버브 < POI(맨 위).
// bringToBack은 맨 아래로 보내므로, 나중에 호출한 쪽이 더 아래에 깔린다 → 서버브 → LGA 순으로 호출.
function restoreVecOrder(){
  if(suburbLayer)suburbLayer.eachLayer(l=>{if(l.bringToBack)l.bringToBack();});
  if(typeof lgaLayers!=='undefined')Object.values(lgaLayers).forEach(g=>{
    if(g&&g.eachLayer)g.eachLayer(l=>{if(l.bringToBack)l.bringToBack();});});
}
// 불변식: 그리기 목록에서 LGA 구간이 전부 서버브 구간보다 앞(=아래)에 있어야 한다.
// 한 번 훑어(≈800) 위반 여부만 판정 — 위반일 때만 복원을 돌려 평상시 비용을 0에 가깝게 유지.
function vecOrderViolated(){
  if(!suburbLayer||typeof lgaLayers==='undefined')return false;
  const lga=new Set();Object.values(lgaLayers).forEach(g=>{if(g&&g.eachLayer)g.eachLayer(l=>lga.add(l._leaflet_id));});
  if(!lga.size)return false;
  const sub=new Set();suburbLayer.eachLayer(l=>sub.add(l._leaflet_id));
  if(!sub.size)return false;
  let i=0,lastLga=-1,firstSub=-1,x=VEC_CANVAS._drawFirst;
  while(x){const id=x.layer._leaflet_id;
    if(lga.has(id))lastLga=i;
    if(sub.has(id)&&firstSub<0)firstSub=i;
    i++;x=x.next;}
  return lastLga>=0&&firstSub>=0&&firstSub<lastLga;
}
// 레이어가 어떤 경로로 추가되든(오버레이 토글·언어 재빌드·컬링) 순서를 자동 복원.
// 수동 호출 지점을 늘리면 새 오버레이 추가 시 또 빠뜨리므로 훅 하나로 일원화.
(function(){
  let pend=null;
  map.on('layeradd',()=>{
    if(pend)return;                       // 대량 추가(수천 건)를 한 번으로 묶음
    pend=setTimeout(()=>{pend=null;
      if(vecOrderViolated()){
        if(IS_DEV)console.warn('[vec-order] LGA가 서버브 위로 올라와 복원함 — 추가 경로 확인 필요');
        restoreVecOrder();
      }
    },0);
  });
})();
function deselectSuburb(){if(selectedSubPoly){if(!HOVERABLE)selectedSubPoly.closeTooltip();selectedSubPoly.setStyle(SUB_BASE);selectedSubPoly=null;}}
function buildSuburbLayer(){
  suburbLayer=L.layerGroup();suburbPolys={};
  SUBURBS.forEach((s,si)=>{
    const d=LGAS[s.l];if(!d)return;
    const latlngs=s.g.map(ring=>[ring.map(([lng,lat])=>[lat,lng])]);
    const poly=L.polygon(latlngs,{renderer:VEC_CANVAS,fillColor:CAT_META[d.cat].color,...SUB_BASE});
    const l2n=(s.l2||[]).map(id=>LGAS[id]?LGAS[id].name:id).join(' · ');
    const tip=`${s.n}${s.pc?(' · '+s.pc):''}`+(l2n?`<br><span style="font-size:9.5px;color:#5b6377">${T().partly(l2n)}</span>`:'');
    // 터치에도 툴팁 유지(웹과 동일한 서버브 설명). sticky는 hover 환경에서만.
    poly.bindTooltip(tip,{sticky:HOVERABLE,direction:'top',className:'sub-tip',opacity:1});
    if(!HOVERABLE){
      // Leaflet은 hover 없는 기기를 위해 mouseover·click 양쪽에 툴팁 개방을 자동 배선한다.
      // 터치 한 번에 브라우저가 합성 mousemove→mouseover→click을 연달아 보내므로
      // 툴팁이 열림·닫힘·재열림을 반복하고, 그때마다 캔버스가 전 폴리곤을 재히트테스트한다.
      // 자동 배선을 떼고 아래 클릭 핸들러에서 정확히 한 번만 연다.
      poly.off('mouseover',poly._openTooltip,poly);
      poly.off('mouseout',poly.closeTooltip,poly);
      poly.off('click',poly._openTooltip,poly);
    }
    poly.on('click',(e)=>{
      L.DomEvent.stopPropagation(e);
      if(_popupOpen)map.closePopup(); // 팝업은 닫되 선택은 그대로 진행
      if(selectedSubPoly===poly){ // 같은 서버브 재탭 = 닫기(페르소나 재탭과 같은 문법)
        deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();return;}
      deselectSuburb();selectedSubPoly=poly;poly.setStyle(subSelStyle(d.cat));
      if(!HOVERABLE)poly.openTooltip(e.latlng); // 터치: 탭 지점에 한 번만
      openSheet(s.l);setSheetSuburb(s);
    });
    suburbLayer.addLayer(poly);suburbPolys[si]=poly;
  });
}
function setSuburbLayer(on){
  suburbOn=on;
  if(on){if(!suburbLayer)buildSuburbLayer();suburbLayer.addTo(map);restoreVecOrder();}
  else{deselectSuburb();if(suburbLayer)map.removeLayer(suburbLayer);}
  syncOverlayRows();
}

