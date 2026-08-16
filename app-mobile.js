// ▓▓▓ 모바일 크롬 — 오버레이 칩바·하위칩·목적별·지도색상·스케일·오버레이 패널 ▓▓▓ (app-core→app-overlays→app-search→app-mobile→app-ui 순서 로드. 전역 스코프 공유)
// ═══════════════ 모바일: 오버레이 칩바 · 하위칩 · 렌트/치안 · 스케일 ═══════════════
const isMobile=()=>matchMedia('(max-width:680px)').matches;
const M_SUB={
  transit:{items:()=>[['train',T().train],['tram',T().tram],['bus',T().bus]],colors:TRANSIT_COLOR,getF:()=>transitFilter,setF:setTransitFilter},
  schools:{items:()=>['p','s','u','c','o'].map(k=>[k,T().schoolTypes[k]]),colors:SCHOOL_COLOR,getF:()=>POI_REG.schools.filter,setF:setSchoolFilter},
  hospitals:{items:()=>['hos','dr','de','km','ph','vet'].map(k=>[k,T().hospTypes[k]]),colors:MED_COLOR,getF:()=>POI_REG.hospitals.filter,setF:setHospitalFilter},
  marts:{items:()=>['big','local','intl','liq'].map(k=>[k,T().martTypes[k]]),colors:MART_COLOR,getF:()=>POI_REG.marts.filter,setF:setMartFilter},
  restaurant:{items:()=>['as','eu','am','etc'].map(k=>[k,T().restTypes[k]]),colors:REST_COLOR,getF:()=>POI_REG.restaurant.filter,setF:setRestFilter},
  cafe:{items:()=>['cafe','bakery','brunch'].map(k=>[k,T().cafeTypes[k]]),colors:CAFE_COLOR,getF:()=>POI_REG.cafe.filter,setF:setCafeFilter},
  pubs:{items:()=>['pub','bar','wine','brew','club'].map(k=>[k,T().pubTypes[k]]),colors:PUB_COLOR,getF:()=>POI_REG.pubs.filter,setF:setPubFilter},
  parks:{items:()=>['park','water','toilet','fitness','bbq','pool','playground'].map(k=>[k,T().parkTypes[k]]),colors:PARK_COLOR,getF:()=>POI_REG.parks.filter,setF:setParkFilter},
  admin:{items:()=>['govt','bank','post','telecom','lib','police','laundry'].map(k=>[k,T().adminTypes[k]]),colors:ADMIN_COLOR,getF:()=>POI_REG.admin.filter,setF:setAdminFilter},
  shopping:{items:()=>['mall','retail','opshop'].map(k=>[k,T().shopTypes[k]]),colors:SHOP_COLOR,getF:()=>POI_REG.shopping.filter,setF:setShopFilter},
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
let mPresetOpen=false;
// 프리셋 = 매크로(개별 토글을 잠그지 않음). 재탭하면 해제하고 직전 상태로 되돌림.
let mActivePreset=null,mPresetDirty=false,mPresetSnap=null;
function snapOverlays(){return OVERLAYS.filter(o=>o.get()).map(o=>o.id);}
function restoreOverlays(ids){OVERLAYS.forEach(o=>{if(o.id==='suburb')return;const want=ids.includes(o.id);if(o.get()!==want)o.set(want);});}
function selectPreset(p){
  if(mActivePreset===p.id){                       // 재탭 = 해제 + 복귀
    if(mPresetSnap)restoreOverlays(mPresetSnap);
    mActivePreset=null;mPresetDirty=false;mPresetSnap=null;
  }else{
    if(!mActivePreset)mPresetSnap=snapOverlays();  // 최초 진입 때만 스냅샷
    applyPreset(p);mActivePreset=p.id;mPresetDirty=false;
  }
  mPresetOpen=false;mExpanded=null;
  document.getElementById('m-preset-pop').classList.remove('on');
  renderMOverlayBar();renderMSubBar();renderMPresetPop();
}
function toggleMPreset(){mPresetOpen=!mPresetOpen;if(mPresetOpen)mExpanded=null;renderMOverlayBar();renderMSubBar();renderMPresetPop();}
function renderMPresetPop(){
  const el=document.getElementById('m-preset-pop');if(!el)return;
  el.innerHTML=PRESETS.map(p=>`<span class="mpreset-item${mActivePreset===p.id?' on':''}" data-preset="${p.id}">${T().presets[p.id]}</span>`).join('')
    +`<span class="mpreset-item mpreset-esc" id="mpreset-all">☰ ${T().ovAll}</span>`;
  el.querySelectorAll('.mpreset-item[data-preset]').forEach(c=>c.addEventListener('click',()=>selectPreset(PRESETS.find(x=>x.id===c.dataset.preset))));
  const esc=document.getElementById('mpreset-all');
  if(esc)esc.addEventListener('click',()=>{mPresetOpen=false;el.classList.remove('on');openOvPanel();});
  el.classList.toggle('on',mPresetOpen);
}
function renderMOverlayBar(){
  const bar=document.getElementById('m-overlaybar');if(!bar)return;
  const anyOn=OVERLAYS.some(o=>o.id!=='suburb'&&o.get());
  const rc=document.getElementById('m-ovreset'); // 칩바 밖 고정 버튼(아이콘만) — 스크롤 무관 상시 노출
  if(rc){rc.classList.toggle('on',anyOn);rc.title=T().clearAll;}
  bar.classList.toggle('reset-pad',anyOn);
  renderMPersona();renderMOvAll();
  bar.innerHTML=OVERLAYS.map(o=>{
    const hasSub=!!M_SUB[o.id];
    return `<span class="mov-chip${o.get()?' on':''}${o.get()&&ovDataPending(o.id)?' loading':''}" data-ov="${o.id}">${movMark(o)}${T().layers[o.id]}${hasSub?'<span class="mov-caret">▾</span>':''}</span>`;
  }).join('');
  bar.querySelectorAll('.mov-chip[data-ov]').forEach(c=>c.addEventListener('click',()=>onMChip(c.dataset.ov)));
  syncBarAffordance();
}
// 마커 팝업 → 어느 오버레이 소속인지 알려줌: 해당 칩을 칩바 가운데로 스크롤 + 잠깐 강조
function overlayIdOfLayer(lyr){
  for(const r of Object.values(POI_REG)) if(r.layer&&r.layer.hasLayer&&r.layer.hasLayer(lyr))return r.id;
  const extra=[['sight',typeof sightLayer!=='undefined'&&sightLayer],['facility',typeof facLayer!=='undefined'&&facLayer],
               ['runs',typeof runLayer!=='undefined'&&runLayer],['transit',typeof transitLayer!=='undefined'&&transitLayer]];
  for(const [id,g] of extra) if(g&&g.hasLayer&&g.hasLayer(lyr))return id;
  return null;
}
function revealOverlayChip(id){
  const bar=document.getElementById('m-overlaybar');if(!bar||!id)return;
  const chip=bar.querySelector(`.mov-chip[data-ov="${id}"]`);if(!chip)return;
  const target=chip.offsetLeft-(bar.clientWidth-chip.offsetWidth)/2; // 가운데 정렬
  bar.scrollTo({left:Math.max(0,target),behavior:'smooth'});
  chip.classList.remove('flash');void chip.offsetWidth;chip.classList.add('flash');
  clearTimeout(chip._ft);chip._ft=setTimeout(()=>chip.classList.remove('flash'),1800);
}
// 팝업 상단에 「상위 오버레이 › 하위 종류」 경로 한 줄 — 웹·모바일 공통.
// 시선이 이미 팝업에 있으므로 패널·칩바로 시선을 옮기지 않고 그 자리에서 답이 끝남.
function injectPopupPath(popup,id,t){
  const el=popup.getElement();if(!el)return;
  const box=el.querySelector('.popup-inner')||el.querySelector('.popup-wrap')||el.querySelector('.leaflet-popup-content');
  if(!box||box.querySelector('.popup-path'))return;
  const top=T().layers[id];
  let sub=(M_SUB[id]&&(M_SUB[id].items().find(x=>x[0]===t)||[])[1])||'';
  if(sub===top)sub=''; // 「카페 › 카페」 같은 동어반복 제거
  const d=document.createElement('div');
  d.className='popup-path';
  d.innerHTML=top+(sub?` <i>›</i> ${sub}`:'');
  box.insertBefore(d,box.firstChild);
}
map.on('popupopen',e=>{
  const src=e.popup&&e.popup._source;if(!src)return;
  const id=overlayIdOfLayer(src);if(!id)return;
  injectPopupPath(e.popup,id,src.options.ovType);
  if(!isMobile())return;
  if(M_SUB[id]&&mExpanded!==id){mExpanded=id;renderMSubBar();} // 하위 종류까지 자동 펼침
  revealOverlayChip(id);
});
// 칩바 스크롤 어포던스 — 좌우 페이드 토글 + 얇은 트랙. 상위·하위 바에 같은 규칙 적용.
const BARS=[['m-overlaybar','m-ovtrack'],['m-subbar','m-subtrack']];
function syncBarAffordance(){
  BARS.forEach(([barId,trackId])=>{
    const bar=document.getElementById(barId),tr=document.getElementById(trackId);
    if(!bar||!tr)return;
    const shown=getComputedStyle(bar).display!=='none';
    const max=bar.scrollWidth-bar.clientWidth;
    bar.style.setProperty('--fl',bar.scrollLeft>4?'18px':'0px');       // 왼쪽에 남은 게 있을 때만
    bar.style.setProperty('--fr',bar.scrollLeft<max-4?'18px':'0px');   // 끝에 닿으면 '여기가 끝'
    const scrollable=shown&&max>4;
    tr.classList.toggle('on',scrollable);
    if(!scrollable)return;
    const thumb=tr.firstElementChild,ratio=bar.clientWidth/bar.scrollWidth;
    thumb.style.transform=`translateX(${(bar.scrollLeft/max)*(1/ratio-1)*100}%) scaleX(${ratio})`;
  });
}
BARS.forEach(([barId])=>{
  const bar=document.getElementById(barId);
  if(bar)bar.addEventListener('scroll',syncBarAffordance,{passive:true});
});
window.addEventListener('resize',syncBarAffordance);
// 우측 세로 라인 ①: 목적별 — 활성 프리셋이면 라벨을 펼쳐 현재 모드를 드러냄(모드 혼동 방지)
(function(){const el=document.getElementById('fbm-build');
  if(el&&typeof BUILD!=='undefined')el.textContent='build '+BUILD;})();
function renderMPersona(){
  const el=document.getElementById('m-persona');if(!el)return;
  const act=mActivePreset&&PRESETS.find(p=>p.id===mActivePreset);
  el.classList.toggle('on',!!act);
  el.textContent=act?T().presetShort[act.id]:T().presetMark; // TODO: 페르소나 아이콘 제작되면 교체
  el.title=act?T().presets[act.id]+(mPresetDirty?' · '+T().presetDirty:''):T().presetBtn;
}
// 우측 고정 ②: 「전체 N」 — 칩바 스크롤과 무관
function renderMOvAll(){
  const el=document.getElementById('m-ovall');if(!el)return;
  const n=OVERLAYS.filter(o=>o.id!=='suburb'&&o.get()).length;
  el.title=T().ovAll;
  el.innerHTML=`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3 3 8l9 5 9-5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>`
    +(n?`<span class="ovall-n">${n}</span>`:'');
}
(function(){ // 모두 해제 버튼: 1회 배선(아이콘 고정, on/off는 renderMOverlayBar가 토글)
  const rc=document.getElementById('m-ovreset');if(!rc)return;
  rc.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19.4 12a7.4 7.4 0 1 1-2.1-5.2M18 3.5V8h-4.5"/></svg>';
  rc.addEventListener('click',()=>clearAllOverlays());
})();
// 「전체 N」 · 목적별 버튼 배선
document.getElementById('m-ovall').addEventListener('click',(e)=>{e.stopPropagation();
  document.getElementById('m-preset-pop').classList.remove('on');mPresetOpen=false;openOvPanel();});
document.getElementById('m-persona').addEventListener('click',(e)=>{e.stopPropagation();
  document.getElementById('m-colorpop').classList.remove('on');toggleMPreset();});
function onMChip(id){
  const o=OVERLAYS.find(x=>x.id===id),hasSub=!!M_SUB[id];
  if(mActivePreset)mPresetDirty=true;              // 프리셋 위에서 개별 수정 → 「· 수정됨」
  if(!o.get()){o.set(true);mExpanded=hasSub?id:null;track('ov-'+id);}
  else if(hasSub&&mExpanded!==id){mExpanded=id;}      // 다른 켜진 칩 → 그 하위 펼침
  else{o.set(false);if(mExpanded===id)mExpanded=null;} // 펼친 칩 다시 탭 → 끔
  renderMOverlayBar();renderMSubBar();
}
function renderMSubBar(){
  const sb=document.getElementById('m-subbar');if(!sb)return;

  const cfg=mExpanded&&M_SUB[mExpanded],o=mExpanded&&OVERLAYS.find(x=>x.id===mExpanded);
  const show=!!(cfg&&o&&o.get());
  if(!show){sb.classList.remove('on');sb.innerHTML='';syncBarAffordance();return;}
  const f=cfg.getF();
  sb.innerHTML=cfg.items().map(([k,lab])=>{ // 상위칩과 동일 필 + 컬러 도트 내장. 선택=다크 필, 격리 비선택=dim(도트 색 유지)
    const col=cfg.colors[k];
    return `<span class="msub-chip${f===k?' on':(f?' dim':'')}" data-k="${k}"><span class="msub-dot" style="color:${col}"></span>${lab}</span>`;
  }).join('');
  sb.classList.add('on');syncBarAffordance();
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
// ── 오버레이 패널: 새 시트를 쌓지 않고 기존 바텀시트 내용을 교체 ──
let ovPanelPrevLga=null;
function openOvPanel(){
  const bs=document.getElementById('bottom-sheet');
  ovPanelPrevLga=bs.classList.contains('on')&&!bs.classList.contains('ov-mode')?selectedLgaId:null;
  renderOvPanel();
  bs.classList.add('on','ov-mode');bs.classList.remove('snap-half');bs.scrollTop=0;
  document.body.classList.add('sheet-on');track('ovpanel-open');
  if(typeof updateMScalePos==='function')updateMScalePos();
  if(typeof updateSheetFade==='function')updateSheetFade();
}
function closeOvPanel(){
  const bs=document.getElementById('bottom-sheet');
  bs.classList.remove('ov-mode');
  if(ovPanelPrevLga&&LGAS[ovPanelPrevLga])openSheet(ovPanelPrevLga); // 보던 LGA로 복귀
  else closeSheet();
  ovPanelPrevLga=null;
}
function renderOvPanel(){
  const el=document.getElementById('bs-ov');if(!el)return;const t=T();
  const anyOn=OVERLAYS.some(o=>o.id!=='suburb'&&o.get());
  el.innerHTML=
    `<div class="bso-head"><b>${t.ovPanelTitle}</b>`+
    (anyOn?`<span class="bso-clr" id="bso-clr">${t.clearAll}</span>`:'')+
    `<span class="bso-x" id="bso-x">✕</span></div>`+
    `<div class="bso-sec">${t.ovPanelMulti}</div>`+
    `<div class="bso-grid">`+OVERLAYS.map(o=>
      `<div class="bso-cell${o.get()?' on':''}" data-ov="${o.id}"><span class="bso-g">${movMark(o)}</span>${t.layers[o.id]}</div>`
    ).join('')+`</div>`+
    `<div class="bso-sec">${t.ovPanelColor}</div>`+
    `<div class="bso-rad">`+['category','rent','crime'].map(m=>
      `<div class="${mapColorMode===m?'on':''}" data-cmode="${m}">${t.colorModes[m]}</div>`).join('')+`</div>`;
  el.querySelectorAll('.bso-cell[data-ov]').forEach(c=>c.addEventListener('click',e=>{
    e.stopPropagation();const o=OVERLAYS.find(x=>x.id===c.dataset.ov);
    o.set(!o.get());if(o.get())track('ov-'+o.id);
    if(o.get()&&M_SUB[o.id])mExpanded=o.id; // 칩바로 켤 때와 같은 결과가 되도록(진입 경로별 불일치 제거)
    if(mActivePreset)mPresetDirty=true;
    if(mExpanded===o.id&&!o.get())mExpanded=null;
    renderOvPanel();renderMOverlayBar();renderMSubBar();}));
  el.querySelectorAll('[data-cmode]').forEach(c=>c.addEventListener('click',e=>{
    e.stopPropagation();mapColorMode=c.dataset.cmode;
    if(mapColorMode!=='category')track('color-'+mapColorMode);
    renderColorSeg();renderMColorBtn();renderMScale();restyleAll();renderOvPanel();}));
  const x=document.getElementById('bso-x');if(x)x.addEventListener('click',e=>{e.stopPropagation();closeOvPanel();});
  const cl=document.getElementById('bso-clr');
  if(cl)cl.addEventListener('click',e=>{e.stopPropagation();clearAllOverlays();renderOvPanel();});
}
function clearAllOverlays(){
  OVERLAYS.filter(o=>o.id!=='suburb').forEach(o=>{if(o.get())o.set(false);});
  mExpanded=null;mActivePreset=null;mPresetDirty=false;mPresetSnap=null;
  track('ov-clear');renderMOverlayBar();renderMSubBar();
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
