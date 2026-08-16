// ▓▓▓ 검색 — POI 인덱스·서버브 판정(point-in-polygon)·검색 UI ▓▓▓ (app-core→app-overlays→app-search→app-mobile→app-ui 순서 로드. 전역 스코프 공유)
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
// 서버브 판정: 폴리곤 포함(point-in-polygon) 우선. 중심점 최근접은 형상 불규칙 시 오답(BWS Ascot Park→Park Holme 오표기 사례) → 폴백으로만.
let SUB_BOX=null;
function subBoxes(){
  if(SUB_BOX)return SUB_BOX;
  SUB_BOX=SUBURBS.map(s=>{
    let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
    (s.g||[]).forEach(ring=>ring.forEach(p=>{
      if(p[0]<x0)x0=p[0];if(p[0]>x1)x1=p[0];if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}));
    return {n:s.n,g:s.g,x0,y0,x1,y1};
  });
  return SUB_BOX;
}
function inRing(lng,lat,ring){ // ray casting
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];
    if((yi>lat)!==(yj>lat)&&lng<(xj-xi)*(lat-yi)/(yj-yi)+xi)inside=!inside;
  }
  return inside;
}
function nearestSub(ll){
  const lat=ll[0],lng=ll[1];
  for(const s of subBoxes()){
    if(lng<s.x0||lng>s.x1||lat<s.y0||lat>s.y1)continue; // bbox 선컷
    let hit=0;
    for(const ring of (s.g||[]))if(inRing(lng,lat,ring))hit++; // even-odd: 홀은 제외, 멀티파트는 포함
    if(hit%2===1)return s.n;
  }
  let best='',bd=Infinity; // 폴백(경계 밖·데이터 공백)
  for(const s of subCentroids()){
    const dx=s.lng-lng,dy=s.lat-lat,d=dx*dx+dy*dy;
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
  if(typeof MALLS!=='undefined')MALLS.forEach(m=>push({kind:'shop',st:'mall',n:m.n,ll:m.ll}));
  if(typeof BIG_RETAIL!=='undefined')BIG_RETAIL.forEach(r=>push({kind:'shop',st:'retail',n:r.n,ll:r.ll})); // op shop은 이름 중복 많아 검색 제외
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
  else if(p.kind==='shop')lab=t.shopTypes[p.st]||t.layers.shopping;
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
  if(p.kind==='shop')return SHOP_COLOR[p.st]||SHOP_COLOR.mall;
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
  else if(p.kind==='shop'&&!POI_REG.shopping.on)setShopLayer(true);
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
  const regId={school:'schools',hosp:'hospitals',mart:'marts',rest:'restaurant',cafe:'cafe',pub:'pubs',park:'parks',admin:'admin',shop:'shopping'}[p.kind];
  if(regId)setTimeout(()=>openRegMarkerAt(POI_REG[regId],p.ll),140);
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
  deselectSuburb();selectedSubPoly=poly;poly.setStyle(subSelStyle(LGAS[s.l].cat));
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
    }).catch(()=>{if(typeof loadFailToast==='function')loadFailToast();}); // 조용한 실패 금지
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
