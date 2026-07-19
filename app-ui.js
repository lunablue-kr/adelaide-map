// ▓▓▓ UI — 좌측패널·검색·미니범례·피드백·언어·모바일칩바·INIT ▓▓▓ (app-core→app-overlays→app-ui 순서 로드. 전역 스코프 공유; 뒤 파일이 앞 심볼 참조)
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

