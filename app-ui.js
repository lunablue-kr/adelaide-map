// ▓▓▓ UI — 좌측 패널·미니 범례·피드백 모달·토스트·언어·INIT ▓▓▓ (app-core→app-overlays→app-search→app-mobile→app-ui 순서 로드. 전역 스코프 공유)
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
  {id:'runs',color:'#e0662a',swatch:'dash',get:()=>runOn,set:setRunLayer}, // 폴리라인 러닝코스

  {id:'shopping',color:'#39415a',swatch:'glyph',cat:'shopping',get:()=>POI_REG.shopping.on,set:setShopLayer},
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
        if(typeof mActivePreset!=='undefined'&&mActivePreset)mPresetDirty=true; // 모바일 칩과 동일 규칙
        def.set(turnOn);
        if(turnOn)track('ov-'+def.id);
      });
    });
    el.querySelector('.ov-clear').addEventListener('click',()=>clearAllOverlays()); // 모바일 ⊘와 동일 경로
  });
}
function syncOverlayRows(){
  document.querySelectorAll('.ov-row[data-ov]').forEach(row=>{
    const def=OVERLAYS.find(x=>x.id===row.dataset.ov);
    if(def){row.classList.toggle('on',def.get());row.classList.toggle('loading',def.get()&&ovDataPending(def.id));}
  });
  if(typeof renderMOverlayBar==='function'){renderMOverlayBar();renderMSubBar();}
  if(typeof syncPresetRows==='function')syncPresetRows();
}
// 목적별 프리셋(라이트 페르소나): 오버레이 조합 원탭. 오버레이 전부 존재하는 페르소나만 배선(러너·집구하기·노마드는 해당 오버레이 구축 후 추가).
const PRESETS=[
  {id:'student',ovs:['schools','hospitals','marts','cafe','transit']},
  {id:'traveler',ovs:['sight','shopping','restaurant','transit']},
  {id:'runner',ovs:['parks','runs']}, // 음수대·화장실·헬스 오버레이는 미구축 → 구축 후 추가
];
function applyPreset(p){ // 서버브 경계 유지, 나머지는 프리셋에 맞춰 on/off
  OVERLAYS.forEach(o=>{if(o.id==='suburb')return;const want=p.ovs.includes(o.id);if(o.get()!==want)o.set(want);});
  track('preset-'+p.id);syncOverlayRows();syncPresetRows(p.id);
  if(typeof mActivePreset!=='undefined'){mActivePreset=p.id;mPresetDirty=false;} // 데스크톱에서 눌러도 모바일 버튼과 상태 일치
  if(typeof renderMPersona==='function')renderMPersona();
}
function presetActive(p){return p.ovs.every(id=>{const o=OVERLAYS.find(x=>x.id===id);return o&&o.get();})&&OVERLAYS.every(o=>o.id==='suburb'||p.ovs.includes(o.id)||!o.get());}
function renderPresetRows(){ // 데스크톱 패널만(모바일은 renderMOverlayBar가 바 앞에 프리펜드)
  const el=document.getElementById('preset-row');if(!el)return;
  el.innerHTML=PRESETS.map(p=>`<span class="preset-chip${presetActive(p)?' on':''}" data-preset="${p.id}">${T().presets[p.id]}</span>`).join('');
  el.querySelectorAll('.preset-chip').forEach(ch=>ch.addEventListener('click',()=>
    selectPreset(PRESETS.find(x=>x.id===ch.dataset.preset)))); // 재탭 해제·직전 복귀까지 모바일과 동일
}
function syncPresetRows(){document.querySelectorAll('.preset-chip[data-preset]').forEach(ch=>{const p=PRESETS.find(x=>x.id===ch.dataset.preset);ch.classList.toggle('on',!!p&&presetActive(p));});}
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
      ['hos','dr','de','km','ph','vet'].map(k=>`<div class="ml-item ml-click${POI_REG.hospitals.filter&&POI_REG.hospitals.filter!==k?' dim':''}" data-hos="${k}"><span class="ml-dot" style="color:${MED_COLOR[k]}"></span>${t.hospTypes[k]}</div>`).join('');
  }
  if(POI_REG.marts.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.mart}</svg></span>${t.layers.marts}</div>`+
      ['big','local','intl','liq'].map(k=>`<div class="ml-item ml-click${POI_REG.marts.filter&&POI_REG.marts.filter!==k?' dim':''}" data-mart="${k}"><span class="ml-dot" style="color:${MART_COLOR[k]}"></span>${t.martTypes[k]}</div>`).join('');
  }
  if(POI_REG.restaurant.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.restaurant}</svg></span>${t.layers.restaurant}</div>`+
      ['as','eu','am','etc'].map(k=>`<div class="ml-item ml-click${POI_REG.restaurant.filter&&POI_REG.restaurant.filter!==k?' dim':''}" data-rest="${k}"><span class="ml-dot" style="color:${REST_COLOR[k]}"></span>${t.restTypes[k]}</div>`).join('');
  }
  if(POI_REG.shopping.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.shopping}</svg></span>${t.layers.shopping}</div>`+
      ['mall','retail','opshop'].map(k=>`<div class="ml-item ml-click${POI_REG.shopping.filter&&POI_REG.shopping.filter!==k?' dim':''}" data-shop="${k}"><span class="ml-dot" style="color:${SHOP_COLOR[k]}"></span>${t.shopTypes[k]}</div>`).join('');
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
      ['park','water','toilet','fitness','bbq','pool','playground'].map(k=>`<div class="ml-item ml-click${POI_REG.parks.filter&&POI_REG.parks.filter!==k?' dim':''}" data-park="${k}"><span class="ml-dot" style="color:${PARK_COLOR[k]}"></span>${t.parkTypes[k]}</div>`).join('');
  }
  if(runOn){
    html+=`<div class="ml-title" style="margin-top:7px">${t.layers.runs}</div>`+
      `<div class="ml-item"><span class="ml-dot" style="color:${RUN_COLOR}"></span>${LANG==='en'?'Paved trail':'포장 코스'}</div>`;
  }
  if(POI_REG.admin.on){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.admin}</svg></span>${t.layers.admin}</div>`+
      ['govt','bank','post','telecom','lib','police','laundry'].map(k=>`<div class="ml-item ml-click${POI_REG.admin.filter&&POI_REG.admin.filter!==k?' dim':''}" data-admin="${k}"><span class="ml-dot" style="color:${ADMIN_COLOR[k]}"></span>${t.adminTypes[k]}</div>`).join('');
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
  el.querySelectorAll('.ml-item[data-shop]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setShopFilter(it.dataset.shop);}));
  el.querySelectorAll('.ml-item[data-sight]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setSightFilter(it.dataset.sight);}));
  el.querySelectorAll('.ml-item[data-fac]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setFacFilter(it.dataset.fac);}));
}

// ═══════════════ 피드백 모달 ═══════════════
const FEEDBACK_ENDPOINT='https://formsubmit.co/ajax/4daba310c39387b2cac62a9e9796d9c6';
function tl(t){return{tip:'💡 꿀팁',correction:'🔧 정정',experience:'✨ 경험담',question:'❓ 질문'}[t]||t;}
let lastSent=0;
['bs-share','m-share','sp-share'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('click',(e)=>{e.stopPropagation();shareLink();});});
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
  document.documentElement.dataset.lang=LANG;
  const t=T();
  document.documentElement.lang=LANG;document.title=t.docTitle;
  document.getElementById('sp-title').textContent=t.title;
  document.getElementById('lang-toggle').textContent=t.langBtn;
  document.getElementById('sp-search').placeholder=t.searchPh;
  document.getElementById('m-search').placeholder=t.searchPh;
  document.getElementById('m-lang').textContent=t.langBtn;
  document.getElementById('lbl-overlay').textContent=t.lblOverlay;
  {const lp=document.getElementById('lbl-preset');if(lp)lp.textContent=t.lblPreset;}
  document.getElementById('lbl-color').textContent=t.lblColor;
  document.getElementById('fb-open').textContent=t.fbOpen;
  document.getElementById('sp-foot').innerHTML=t.sources.replace(/&/g,'&amp;').replace(/</g,'&lt;')+
    ` · <a href="privacy.html" target="_blank" rel="noopener" style="color:inherit">${t.privacyLink||'개인정보·면책'}</a>`;
  renderOverlayRows();renderPresetRows();renderColorSeg();renderMiniLegend();buildVibes();
  renderMOverlayBar();renderMSubBar();renderMPresetPop();renderMColorBtn();renderMScale();
  if(selectedLgaId)openSheet(selectedLgaId);
  // 레이어 툴팁 언어 재생성 — POI 8종은 레지스트리 루프
  const keepFilters={}; // ovBuild가 r.filter를 null로 초기화 → 격리 상태가 조용히 풀리고 하위칩 UI만 남던 문제
  Object.values(POI_REG).forEach(r=>{
    if(r.layer){
      const wasOn=r.on;keepFilters[r.id]=r.filter;
      if(wasOn)map.removeLayer(r.layer);
      r.layer=null;
      if(wasOn){ovBuild(r);r.layer.addTo(map);}
    }
  });
  [['suburb',()=>suburbLayer,(v)=>suburbLayer=v,buildSuburbLayer,()=>suburbOn],
   ['transit',()=>transitLayer,(v)=>transitLayer=v,buildTransitLayer,()=>transitOn],
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
  // 재빌드로 초기화된 하위 격리 상태 복원 + 마커 시각/상호작용 상태 강제 정상화.
  // 격리가 없으면 ovApply가 전 마커를 visible=true(불투명·interactive)로 되돌리므로,
  // 어떤 경로로든 dim/비인터랙티브가 남아 있으면 여기서 풀린다.
  Object.entries(keepFilters).forEach(([id,f])=>{if(f&&M_SUB[id])M_SUB[id].setF(f);});
  restoreVecOrder();   // 재빌드로 뒤섞인 캔버스 순서를 LGA<서버브<POI로 복원
  Object.values(POI_REG).forEach(r=>{if(r.layer)ovApply(r);});
  if(sightLayer)applyMarkerFilter(sightMarks,sightFilter);
  if(facLayer)applyMarkerFilter(facMarks,facFilter);
  renderMSubBar();
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
  const sub=new URLSearchParams(location.search).get('sub'); // openSheet의 syncUrl이 URL을 재작성하기 전에 먼저 읽는다
  if(sel&&LGAS[sel]){openSheet(sel);map.fitBounds(lgaLayers[sel].getBounds(),{padding:[40,40],maxZoom:ZOOM_LGA});
    if(sub){const sObj=SUBURBS.find(x=>x.n===sub);if(sObj)setSheetSuburb(sObj);}}
  else toast(T().hint,3200);
}catch{toast(T().hint,3200);}
