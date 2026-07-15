const SCHOOLS=[...SCHOOLS_P,...SCHOOLS_S,...SCHOOLS_C,...SCHOOLS_O];
const CAT_META = {
  cbd:     {label:'CBD',         en:'CBD',          color:'#e879f9'},
  inner:   {label:'이너 프리미엄',en:'Inner Premium',color:'#a78bfa'},
  coastal: {label:'해안',        en:'Coastal',      color:'#38bdf8'},
  easthill:{label:'동부·힐즈',   en:'East & Hills', color:'#4ade80'},
  central: {label:'중부 생활권', en:'Central',      color:'#fb923c'},
  south:   {label:'남부 외곽',   en:'Outer South',  color:'#fbbf24'},
  north:   {label:'북부',        en:'North',        color:'#f87171'},
};
const LGAS = {
  adelaide:    {cat:'cbd',     name:'City of Adelaide',              sub:'CBD · North Adelaide',                         pop:'약 26,000명', kw:'도심·상업·행정의 중심',            desc:'Rundle Mall·Victoria Square 등 상업·행정·문화 핵심. 대중교통 모든 노선의 허브. 병원·영사관·대학 집결. 고층 아파트 위주 주거.',                                                                                       meta:[{l:'면적',v:'16 km²'},{l:'렌트',v:'주 $620~740'},{l:'교통',v:'트램·버스 허브'}],          tags:['상업중심','대중교통허브','아파트주거']},
  unley:       {cat:'inner',   name:'City of Unley',                 sub:'Unley · Hyde Park · Malvern · Goodwood',       pop:'약 39,000명', kw:'Adelaide 최고급 주거지 중 하나',    desc:'나무 우거진 정갈한 거리, 헤리티지 주택 많음. King William Rd·Unley Rd 따라 고급 카페·레스토랑. 치안 우수, 가족·전문직 선호. Burnside·Mitcham과 함께 Adelaide 프리미엄 주거 3대장.',                             meta:[{l:'면적',v:'14 km²'},{l:'렌트',v:'주 $590~980'},{l:'교통',v:'버스 편리'}],               tags:['고급주거','leafy','카페거리','안전']},
  norwood:     {cat:'inner',   name:'City of Norwood Payneham & St Peters', sub:'Norwood · Kensington · Payneham',      pop:'약 38,000명', kw:'The Parade — Adelaide 최고의 카페·음식 거리', desc:'The Parade는 Adelaide에서 가장 활기찬 카페·레스토랑 스트리트. 이탈리안 커뮤니티 역사 깊음. CBD 동쪽 이너 서버브로 접근성 좋고 렌트 이너 서버브 중 합리적.',                            meta:[{l:'면적',v:'15 km²'},{l:'렌트',v:'주 $670~800'},{l:'교통',v:'버스 편리'}],               tags:['카페거리','트렌디','이탈리안','이너서버브']},
  prospect:    {cat:'inner',   name:'City of Prospect',              sub:'Prospect · Nailsworth · Blair Athol',          pop:'약 23,000명', kw:'Adelaide에서 가장 힙하게 뜨는 이너 서버브', desc:'최근 10년간 젊고 트렌디한 동네로 급부상. Prospect Road 중심으로 독립 카페·빈티지숍·갤러리 밀집. Adelaide 두 번째로 작은 LGA(8km²). 젊은 층·아티스트 선호.',               meta:[{l:'면적',v:'8 km²'},{l:'렌트',v:'주 $530~650'},{l:'교통',v:'버스 편리'}],               tags:['힙','빈티지','독립카페','젊음']},
  walkerville: {cat:'inner',   name:'Town of Walkerville',           sub:'Walkerville · Gilberton · Medindie',           pop:'약 8,200명',  kw:'Adelaide 최소 LGA — 강변 프리미엄 주거', desc:'River Torrens 인접. Adelaide에서 가장 작은 LGA(4km²), 인구도 최소. 조용하고 배타적인 분위기. 나무 가득한 주택가, 높은 소득 수준.',                                          meta:[{l:'면적',v:'4 km²'},{l:'렌트',v:'주 $580~820'},{l:'특징',v:'Adelaide 최소 LGA'}],       tags:['소규모','강변','고급','조용']},
  burnside:    {cat:'easthill',name:'City of Burnside',              sub:'Rose Park · Toorak Gardens · Magill · Burnside', pop:'약 46,700명', kw:'SA 사회경제적 최우위 LGA (ABS SEIFA 1위)', desc:'Adelaide에서 집값·소득 수준 모두 최상위. Leafy한 거리, 헤리티지 건축. Penfolds Magill Estate 와이너리. Burnside Village 프리미엄 쇼핑센터. 집값 중앙값 약 $130만.',   meta:[{l:'면적',v:'27 km²'},{l:'렌트',v:'주 $540~820'},{l:'특징',v:'SEIFA SA 1위'}],           tags:['최고급','leafy','와이너리','고소득']},
  campbelltown:{cat:'easthill',name:'Campbelltown City',             sub:'Campbelltown · Rostrevor · Paradise · Newton',  pop:'약 56,000명', kw:'Adelaide Hills 기슭, 조용한 가족 주거지', desc:'Adelaide Hills 진입부. 나무 많고 조용한 가족 주거지. 비교적 안전하고 평화로운 분위기. 큰 정원 있는 주택 많음.',                                                              meta:[{l:'면적',v:'24 km²'},{l:'렌트',v:'주 $550~680'},{l:'교통',v:'버스, 차 추천'}],         tags:['조용','가족친화','힐즈기슭','안전']},
  mitcham:     {cat:'easthill',name:'City of Mitcham',               sub:'Blackwood · Mitcham · Panorama · Eden Hills',  pop:'약 68,400명', kw:'자연환경·치안·주거 삼박자 갖춘 힐즈 접경', desc:'Adelaide Hills 기슭. Burnside·Unley와 함께 Adelaide 3대 프리미엄 주거 LGA. 나무 많고 자연환경 풍부. 조용하고 가족 친화적. Tree Canopy Award 수상. 언덕 지형 경치.',    meta:[{l:'면적',v:'76 km²'},{l:'렌트',v:'주 $570~870'},{l:'특징',v:'Tree Canopy Award'}],      tags:['자연환경','조용','안전','가족친화']},
  tea_tree:    {cat:'easthill',name:'City of Tea Tree Gully',        sub:'Modbury · Dernancourt · Fairview Park',         pop:'약 102,700명',kw:'Adelaide Hills 기슭 외곽 — 큰 집·조용한 교외', desc:'1970~80년대 교외 확장 개발 지역. 큰 정원 딸린 주택 많고 조용함. Adelaide Hills 접근성 좋음. 젊은 가족·은퇴자 선호. 도심 접근성 낮고 차 의존도 높음.',             meta:[{l:'면적',v:'95 km²'},{l:'렌트',v:'주 $540~670'},{l:'교통',v:'버스, 차 필수'}],         tags:['교외','대형주택','조용','힐즈접근']},
  holdfast:    {cat:'coastal', name:'City of Holdfast Bay',          sub:'Glenelg · Brighton · Hove · Somerton Park',    pop:'약 38,100명', kw:'트램 직결 해변 도시 — Glenelg 중심',   desc:'Adelaide 대표 해변 LGA. Glenelg 트램 종착역으로 CBD와 20분 직행. Jetty Road 레스토랑·카페·서핑숍 즐비. 연중 관광객 많고 활기찬 분위기.',                                    meta:[{l:'면적',v:'14 km²'},{l:'렌트',v:'주 $580~860'},{l:'교통',v:'트램 CBD 직행 20분'}],    tags:['해변','트램연결','활기','레저']},
  charles_sturt:{cat:'coastal',name:'City of Charles Sturt',        sub:'Henley Beach · Grange · West Lakes · Woodville',pop:'약 124,900명',kw:'Adelaide 서부 최대 LGA — 해안부터 도심 인접까지', desc:'Adelaide 세 번째로 인구 많은 LGA. 해안선(Grange·Henley Beach)부터 도심 인접까지 넓은 영역. 주거·산업·상업 복합. 105개 이상 문화권 공존.',                      meta:[{l:'면적',v:'55 km²'},{l:'렌트',v:'주 $500~880'},{l:'특징',v:'QEH, Adelaide Arena'}],   tags:['다문화','해안','복합','대형LGA']},
  west_torrens:{cat:'central', name:'City of West Torrens',          sub:'Mile End · Plympton · Camden Park · Netley',   pop:'약 63,100명', kw:'Adelaide 공항 인접 — 주거·산업 혼재',   desc:'Adelaide Airport 바로 인접. 주거·산업·상업 복합 지역. CBD와 Marion 사이라 접근성 양호. 특별한 랜드마크는 없지만 교통 편리하고 무난한 생활권.',                            meta:[{l:'면적',v:'37 km²'},{l:'렌트',v:'주 $540~670'},{l:'특징',v:'Adelaide Airport 인접'}], tags:['공항인접','무난','접근성','중간가격']},
  marion:      {cat:'central', name:'City of Marion',                sub:'Mitchell Park · Oaklands Park · Tonsley · Edwardstown', pop:'약 96,700명',kw:'남호주 최대 쇼핑몰 보유 — 다문화 중부 생활권', desc:'Westfield Marion(남호주 최대 쇼핑몰) 위치. 주거·상업·경공업 혼재. 다문화 커뮤니티 활성. Tonsley Innovation District 첨단 산업단지. 기차+버스 교통 인프라 양호.',meta:[{l:'면적',v:'55 km²'},{l:'렌트',v:'주 $540~700'},{l:'교통',v:'기차(Flinders선)+버스'}], tags:['다문화','쇼핑인프라','Flinders인접']},
  port_adelaide:{cat:'north',  name:'City of Port Adelaide Enfield', sub:'Port Adelaide · Semaphore · Northfield',        pop:'약 135,800명',kw:'역사적 항구 도시 — 젠트리피케이션 진행 중', desc:'Adelaide 항구의 역사적 심장부. 창고 개조 카페·갤러리·바 등장하며 젠트리피케이션 진행 중. 역사 건축물·해양박물관. 다양한 계층 혼재. Semaphore Beach 포함.',         meta:[{l:'면적',v:'92 km²'},{l:'렌트',v:'주 $580~740'},{l:'특징',v:'항구역사, 젠트리파이'}],  tags:['역사항구','젠트리파이중','해양']},
  salisbury:   {cat:'north',   name:'City of Salisbury',             sub:'Salisbury · Mawson Lakes · Para Hills',        pop:'약 148,000명',kw:'북부 최대 인구 LGA — 다문화·저렴한 렌트', desc:'Adelaide 북부에서 인구가 가장 많은 LGA. 다문화 이민자 커뮤니티 강함. 전통적 제조업·물류 지역. Mawson Lakes는 UniSA 캠퍼스 인접으로 학생 거주 활발. 일부 구역 경제적 취약.',meta:[{l:'면적',v:'160 km²'},{l:'렌트',v:'주 $460~600'},{l:'특징',v:'UniSA Mawson Lakes'}],   tags:['다문화','저렴','제조업','UniSA인접']},
  playford:    {cat:'north',   name:'City of Playford',              sub:'Elizabeth · Davoren Park · Craigmore',         pop:'약 103,400명',kw:'Adelaide 최북단 — 전후 계획신도시의 쇠퇴와 재생', desc:'Elizabeth는 1950년대 전후 이민자를 위한 계획 신도시로 조성. 제조업 쇠퇴 후 실업률·사회주택 비중 높아짐. Adelaide에서 렌트 가장 저렴. 최근 일부 재개발 시도 중.',  meta:[{l:'면적',v:'345 km²'},{l:'렌트',v:'주 $430~550'},{l:'교통',v:'기차 약 50분'}],         tags:['렌트최저','사회주택','재개발중']},
  gawler:      {cat:'north',   name:'Town of Gawler',                sub:'Gawler · Evanston · Willaston',               pop:'약 26,100명', kw:'Adelaide 메트로 최북단 — 독자적 역사 소도시', desc:'1836년 설립된 S.A.에서 가장 오래된 마을 중 하나. 독자적인 타운 분위기와 역사 건축물 보유. 기차로 Adelaide CBD까지 약 1시간. 성장 중인 외곽 위성도시.',            meta:[{l:'면적',v:'41 km²'},{l:'렌트',v:'주 $490~610'},{l:'교통',v:'기차 CBD 약 60분'}],      tags:['역사소도시','저렴','외곽','위성도시']},
  onkaparinga: {cat:'south',   name:'City of Onkaparinga',           sub:'Reynella · Morphett Vale · Christies Beach · Happy Valley · McLaren Vale', pop:'약 178,500명',kw:'Adelaide 최대 인구·면적 LGA — 남부 해안·와인산지까지', desc:'Adelaide에서 인구·면적 모두 최대(518km²). 남부 해안선(Christies Beach·Maslin Beach)과 McLaren Vale 와인 산지 포함. Reynella·Happy Valley·Woodcroft 포함. 북쪽은 합리적, 남쪽으로 갈수록 경제적 취약 지역 있음.',meta:[{l:'면적',v:'518 km²'},{l:'렌트',v:'주 $480~630'},{l:'특징',v:'McLaren Vale 와인, 남부 해안'}],tags:['최대면적','와인산지','해안','남부외곽']},
};
const EN_LGAS = {
  adelaide:    {pop:'~26,000',  kw:'The commercial, administrative & cultural heart', desc:'Rundle Mall, Victoria Square and the city core — commerce, government and culture. Hub of every transit line. Hospitals, consulates and universities cluster here. Mostly high-rise apartment living.', meta:[{l:'Area',v:'16 km²'},{l:'Rent',v:'$620–740/wk'},{l:'Transit',v:'Tram & bus hub'}], tags:['Commercial core','Transit hub','Apartment living']},
  unley:       {pop:'~39,000',  kw:'One of Adelaide\'s most prestigious residential areas', desc:'Tree-lined, immaculate streets with many heritage homes. Upscale cafés and restaurants along King William Rd and Unley Rd. Very safe; favoured by families and professionals. With Burnside and Mitcham, one of Adelaide\'s top-3 premium residential councils.', meta:[{l:'Area',v:'14 km²'},{l:'Rent',v:'$590–980/wk'},{l:'Transit',v:'Good bus links'}], tags:['Premium','Leafy','Café strips','Safe']},
  norwood:     {pop:'~38,000',  kw:'The Parade — Adelaide\'s best café & dining street', desc:'The Parade is Adelaide\'s liveliest café and restaurant strip, with deep Italian community roots. An inner-east suburb with great CBD access and relatively reasonable rents for the inner ring.', meta:[{l:'Area',v:'15 km²'},{l:'Rent',v:'$670–800/wk'},{l:'Transit',v:'Good bus links'}], tags:['Café strip','Trendy','Italian','Inner suburb']},
  prospect:    {pop:'~23,000',  kw:'Adelaide\'s fastest-rising hip inner suburb', desc:'Transformed over the past decade into a young, trendy neighbourhood. Independent cafés, vintage shops and galleries along Prospect Road. Adelaide\'s second-smallest LGA (8 km²). Popular with young people and artists.', meta:[{l:'Area',v:'8 km²'},{l:'Rent',v:'$530–650/wk'},{l:'Transit',v:'Good bus links'}], tags:['Hip','Vintage','Indie cafés','Young']},
  walkerville: {pop:'~8,200',   kw:'Adelaide\'s smallest LGA — riverside premium living', desc:'Beside the River Torrens. The smallest LGA in Adelaide (4 km²), with the smallest population. Quiet, exclusive atmosphere; leafy streets and high incomes.', meta:[{l:'Area',v:'4 km²'},{l:'Rent',v:'$580–820/wk'},{l:'Notes',v:'Smallest LGA'}], tags:['Tiny','Riverside','Upscale','Quiet']},
  burnside:    {pop:'~46,700',  kw:'SA\'s top socio-economic LGA (ABS SEIFA #1)', desc:'Adelaide\'s highest property values and incomes. Leafy streets and heritage architecture. Penfolds Magill Estate winery and the premium Burnside Village shopping centre. Median house price around $1.3M.', meta:[{l:'Area',v:'27 km²'},{l:'Rent',v:'$540–820/wk'},{l:'Notes',v:'SEIFA #1 in SA'}], tags:['Top-end','Leafy','Winery','High income']},
  campbelltown:{pop:'~56,000',  kw:'Quiet family suburbs at the foot of the Hills', desc:'Gateway to the Adelaide Hills. Green, quiet family neighbourhoods; relatively safe and peaceful, with many homes on large gardens.', meta:[{l:'Area',v:'24 km²'},{l:'Rent',v:'$550–680/wk'},{l:'Transit',v:'Buses; car recommended'}], tags:['Quiet','Family-friendly','Hills fringe','Safe']},
  mitcham:     {pop:'~68,400',  kw:'Nature, safety and housing — the hills-fringe trifecta', desc:'At the foot of the Adelaide Hills. With Burnside and Unley, one of Adelaide\'s top-3 premium residential LGAs. Rich in bushland and greenery; quiet and family-friendly. Tree Canopy Award winner. Hilly terrain with great views.', meta:[{l:'Area',v:'76 km²'},{l:'Rent',v:'$570–870/wk'},{l:'Notes',v:'Tree Canopy Award'}], tags:['Nature','Quiet','Safe','Family-friendly']},
  tea_tree:    {pop:'~102,700', kw:'Outer hills-fringe suburbia — big homes, quiet streets', desc:'Developed in the 1970s–80s suburban expansion. Large homes with big gardens; very quiet. Good access to the Adelaide Hills. Popular with young families and retirees. Far from the CBD and car-dependent.', meta:[{l:'Area',v:'95 km²'},{l:'Rent',v:'$540–670/wk'},{l:'Transit',v:'Buses; car essential'}], tags:['Suburban','Large homes','Quiet','Hills access']},
  holdfast:    {pop:'~38,100',  kw:'Beachside city on the tram line — centred on Glenelg', desc:'Adelaide\'s signature beach LGA. The Glenelg tram terminus puts the CBD 20 minutes away. Jetty Road is packed with restaurants, cafés and surf shops. Lively with visitors year-round.', meta:[{l:'Area',v:'14 km²'},{l:'Rent',v:'$580–860/wk'},{l:'Transit',v:'Tram to CBD, 20 min'}], tags:['Beach','Tram line','Lively','Leisure']},
  charles_sturt:{pop:'~124,900',kw:'Adelaide\'s western giant — coast to inner city', desc:'Adelaide\'s third most-populous LGA, stretching from the coast (Grange, Henley Beach) to the inner west. A mix of residential, industrial and commercial areas. Home to 105+ cultural communities.', meta:[{l:'Area',v:'55 km²'},{l:'Rent',v:'$500–880/wk'},{l:'Notes',v:'QEH, Adelaide Arena'}], tags:['Multicultural','Coastal','Mixed','Large LGA']},
  west_torrens:{pop:'~63,100',  kw:'Next to Adelaide Airport — practical mixed-use living', desc:'Right beside Adelaide Airport. A mix of residential, industrial and commercial areas between the CBD and Marion, so access is good. No standout landmarks, but convenient and well-connected.', meta:[{l:'Area',v:'37 km²'},{l:'Rent',v:'$540–670/wk'},{l:'Notes',v:'Adelaide Airport'}], tags:['Airport','Practical','Access','Mid-priced']},
  marion:      {pop:'~96,700',  kw:'Home of SA\'s biggest mall — multicultural central living', desc:'Westfield Marion, South Australia\'s largest shopping centre, is here. Residential, commercial and light-industrial mix with active multicultural communities. Tonsley Innovation District tech precinct. Good train (Flinders line) and bus links.', meta:[{l:'Area',v:'55 km²'},{l:'Rent',v:'$540–700/wk'},{l:'Transit',v:'Train (Flinders line) + bus'}], tags:['Multicultural','Shopping','Near Flinders']},
  port_adelaide:{pop:'~135,800',kw:'Historic port city — gentrification underway', desc:'The historic heart of Adelaide\'s port. Warehouse-conversion cafés, galleries and bars are appearing as gentrification progresses. Heritage buildings and the maritime museum. Diverse communities; includes Semaphore Beach.', meta:[{l:'Area',v:'92 km²'},{l:'Rent',v:'$580–740/wk'},{l:'Notes',v:'Historic port, gentrifying'}], tags:['Historic port','Gentrifying','Maritime']},
  salisbury:   {pop:'~148,000', kw:'Multicultural northern hub — affordable rents', desc:'The most populous LGA in Adelaide\'s north, with strong migrant communities. Traditional manufacturing and logistics area. Mawson Lakes, next to the UniSA campus, has a large student population. Some pockets of disadvantage.', meta:[{l:'Area',v:'160 km²'},{l:'Rent',v:'$460–600/wk'},{l:'Notes',v:'UniSA Mawson Lakes'}], tags:['Multicultural','Affordable','Industry','Near UniSA']},
  playford:    {pop:'~103,400', kw:'Adelaide\'s far north — postwar new town, decline & renewal', desc:'Elizabeth was built in the 1950s as a planned town for postwar migrants. After manufacturing declined, unemployment and public housing rose. The cheapest rents in Adelaide; some renewal projects underway.', meta:[{l:'Area',v:'345 km²'},{l:'Rent',v:'$430–550/wk'},{l:'Transit',v:'Train ~50 min'}], tags:['Cheapest rent','Public housing','Renewal']},
  gawler:      {pop:'~26,100',  kw:'Metro Adelaide\'s northern edge — a historic town of its own', desc:'Founded in 1836, one of South Australia\'s oldest towns, with its own township feel and heritage buildings. About an hour to the CBD by train. A growing satellite town.', meta:[{l:'Area',v:'41 km²'},{l:'Rent',v:'$490–610/wk'},{l:'Transit',v:'Train to CBD ~60 min'}], tags:['Historic town','Affordable','Outer','Satellite']},
  onkaparinga: {pop:'~178,500', kw:'Adelaide\'s largest LGA — southern beaches to wine country', desc:'The largest LGA in Adelaide by both population and area (518 km²). Includes the southern coastline (Christies Beach, Maslin Beach) and the McLaren Vale wine region. Reynella, Happy Valley and Woodcroft. Reasonable in the north; disadvantage increases further south.', meta:[{l:'Area',v:'518 km²'},{l:'Rent',v:'$480–630/wk'},{l:'Notes',v:'McLaren Vale, south coast'}], tags:['Largest area','Wine region','Coast','Outer south']},
};
// 명소(sight: 해변·와이너리) / 시설(facility: 공항·항구·혁신지구) — 오버레이 2종
const MARKERS = [
  {id:'glenelg',lat:-34.9813,lng:138.5152,ov:'sight',st:'beach',name:'Glenelg Beach',sub:'City of Holdfast Bay',desc:'Adelaide 최대 해변 명소. 트램 종점. Jetty Road 레스토랑·카페 밀집.'},
  {id:'henley',lat:-34.9201,lng:138.4935,ov:'sight',st:'beach',name:'Henley Beach',sub:'City of Charles Sturt · Henley Square',desc:'노을 명소. Henley Square 광장을 둘러싼 레스토랑·카페로 저녁 시간 활기. 현지인 선호 해변.'},
  {id:'semaphore',lat:-34.8391,lng:138.4800,ov:'sight',st:'beach',name:'Semaphore Beach',sub:'City of Port Adelaide Enfield',desc:'빈티지한 분위기의 북부 해변. 클래식 극장·놀이공원·카페 거리. 여름 주말 마켓.'},
  {id:'barossa',lat:-34.5333,lng:138.9600,ov:'sight',st:'wine',name:'Barossa Valley',sub:'The Barossa Council · Adelaide 북동 약 60km',desc:'호주를 대표하는 와인 산지. 특히 쉬라즈(Shiraz)로 세계적 명성. Penfolds·Jacob\'s Creek·Seppeltsfield 등 유서 깊은 와이너리 밀집. Tanunda·Nuriootpa·Angaston 등 소도시 중심. Adelaide CBD에서 차로 약 1시간.'},
  {id:'mclaren',lat:-35.2196,lng:138.5430,ov:'sight',st:'wine',name:'McLaren Vale',sub:'City of Onkaparinga · CBD 남쪽 약 40km',desc:'Barossa와 쌍벽을 이루는 와인 산지. 쉬라즈·그르나슈 명산지. d\'Arenberg Cube 등 개성 있는 와이너리. 해변(Port Willunga)과 가까워 당일치기 코스로 인기.'},
  {id:'hahndorf',lat:-35.0298,lng:138.8088,ov:'sight',st:'wine',name:'Hahndorf',sub:'Adelaide Hills · CBD 동남쪽 약 25km',desc:'1839년 독일 이민자들이 세운 호주에서 가장 오래된 독일 마을. 독일식 펍·수제 소시지·공예품 거리. Adelaide Hills 와인산지 관문. 근교 여행 1순위.'},
  {id:'airport',lat:-34.9450,lng:138.5310,ov:'facility',st:'air',name:'Adelaide Airport (ADL)',sub:'City of West Torrens',desc:'국내·국제선 공항. CBD에서 차로 약 15분, JetExpress 버스 운행. 인근에 Harbour Town 아울렛.'},
  {id:'port_pt',lat:-34.8601,lng:138.4975,ov:'facility',st:'port',name:'Port Adelaide',sub:'City of Port Adelaide Enfield',desc:'역사적 항구 지구. 해양박물관, 창고 개조 카페·갤러리.'},
  {id:'tonsley',lat:-35.0114,lng:138.5720,ov:'facility',st:'district',name:'Tonsley Innovation District',sub:'City of Marion',desc:'호주 첫 번째 혁신 산업단지. Flinders University 연계.'},
];
const EN_MARKERS = {
  glenelg:       {desc:'Adelaide\'s most famous beach. Tram terminus; Jetty Road dining strip.'},
  port_pt:       {desc:'Historic port district. Maritime museum, warehouse-conversion cafés and galleries.'},
  tonsley:       {desc:'Australia\'s first innovation district, linked with Flinders University.'},
  barossa:       {sub:'The Barossa Council · ~60 km NE of Adelaide', desc:'Australia\'s most famous wine region, world-renowned for Shiraz. Historic wineries such as Penfolds, Jacob\'s Creek and Seppeltsfield. Centred on Tanunda, Nuriootpa and Angaston. About 1 hour from the CBD by car.'},
  airport:       {desc:'Domestic & international airport. ~15 min from the CBD by car; JetExpress buses. Harbour Town outlet nearby.'},
  henley:        {desc:'Sunset hotspot. Restaurants and cafés around Henley Square; a local favourite.'},
  semaphore:     {desc:'A vintage-feel northern beach — classic cinema, foreshore rides, café strip and summer markets.'},
  mclaren:       {sub:'City of Onkaparinga · ~40 km south of the CBD', desc:'McLaren Vale rivals the Barossa — famous for Shiraz and Grenache, with quirky wineries like the d\'Arenberg Cube. Close to Port Willunga beach; a favourite day trip.'},
  hahndorf:      {sub:'Adelaide Hills · ~25 km SE of the CBD', desc:'Australia\'s oldest surviving German settlement (1839). German pubs, smallgoods and craft shops. Gateway to Adelaide Hills wineries; the #1 day trip.'},
};

const LGA_STATS = {"adelaide":{"st":15,"sch":17},"onkaparinga":{"st":5,"sch":47},"holdfast":{"st":8,"sch":10},"marion":{"st":12,"sch":24},"mitcham":{"st":11,"sch":26},"burnside":{"st":0,"sch":14},"gawler":{"st":7,"sch":6},"unley":{"st":11,"sch":11},"west_torrens":{"st":7,"sch":12},"norwood":{"st":0,"sch":13},"campbelltown":{"st":0,"sch":9},"tea_tree":{"st":0,"sch":27},"charles_sturt":{"st":13,"sch":28},"prospect":{"st":2,"sch":4},"walkerville":{"st":0,"sch":5},"port_adelaide":{"st":18,"sch":26},"salisbury":{"st":8,"sch":17},"playford":{"st":5,"sch":10}};

// ═══════════════════════ I18N ═══════════════════════
let LANG='ko';
try{LANG=localStorage.getItem('adelaide-lang')||'ko';}catch{}
try{const u=new URLSearchParams(location.search).get('lang');if(u==='en'||u==='ko')LANG=u;}catch{}

const VIBES = [
  [-34.9295,138.5985,'cbd',17],
  [-34.882,138.598,'inner',14],
  [-34.945,138.655,'easthill',16],
  [-35.010,138.630,'easthill',13],
  [-34.960,138.505,'coastal',15],
  [-34.845,138.500,'north',12],
  [-34.700,138.660,'north',15],
  [-34.825,138.700,'central',12],
  [-35.150,138.510,'south',15],
];

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

// ═══════════════════════ MAP ═══════════════════════
const map=L.map('map',{
  minZoom:10,maxZoom:15,zoomControl:false,
  maxBounds:[[-35.65,138.1],[-34.3,139.1]],maxBoundsViscosity:0.85,
}).setView([-34.95,138.62],11);
L.control.zoom({position:'bottomright'}).addTo(map);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
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
  // 세 모드 모두 동일 스타일(경계=해당 색, 채움 연하게) — 포인트·노선 가독 우선
  const fillBase=0.11, fillDim=0.03, fillSel=0.5, fillOther=0.05;
  Object.entries(lgaLayers).forEach(([id,layer])=>{
    const c=lgaColor(id);
    if(id===selectedLgaId){layer.setStyle({color:'#fff',weight:3,opacity:1,fillColor:c,fillOpacity:fillSel});layer.bringToFront();}
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
    style:{color:lgaColor(id),weight:1.8,opacity:0.9,fillColor:lgaColor(id),fillOpacity:0.11},
  }).addTo(map);
  layer.on('click',(e)=>{L.DomEvent.stopPropagation(e);deselectSuburb();openSheet(id);});
  layer.on('mouseover',()=>{if(selectedLgaId)return;layer.setStyle({fillOpacity:0.24,weight:2.5});});
  layer.on('mouseout',()=>{if(selectedLgaId)return;restyleAll();});
  lgaLayers[id]=layer;
});
map.on('click',()=>{deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();});

// ═══════════════ 바텀시트 ═══════════════
function chip(text,fg,bg){return `<span class="bs-chip" style="color:${fg};background:${bg}">${text}</span>`;}
function barRow(label,pct,color,val){
  return `<div class="bar-row"><span class="bar-lbl">${label}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(4,Math.round(pct*100))}%;background:${color}"></div></div><span class="bar-val">${val}</span></div>`;
}
function openSheet(id){
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
    chip(t.chipRent(lo,hi),'#93c5fd','#1a2433')+
    chip(st.st>0?t.chipStations(st.st):t.chipBus,'#22d3ee','#132430')+
    chip(t.chipSchools(st.sch),'#a3e635','#1d2617')+
    chip(t.chipSafety(rank),rank<=6?'#4ade80':(rank<=12?'#fac775':'#fb923c'),rank<=6?'#152a1d':'#26221a');

  document.getElementById('bs-desc').textContent=lgaField(d,'desc');
  document.getElementById('bs-tags').innerHTML=lgaField(d,'tags').map(tag=>
    `<span class="bs-tag" style="color:${c};border-color:${c}30;background:${c}0a">${tag}</span>`).join('');

  const afford=1-(RENT_MID[id]-RENT_MIN)/(RENT_MAX-RENT_MIN);
  const safety=(18-rank)/17;
  document.getElementById('bs-bars').innerHTML=
    barRow(t.barRent, afford, '#60a5fa', t.barRentVal(lo,hi))+
    barRow(t.barSafety, safety, '#4ade80', t.barSafetyVal(rank))+
    barRow(t.barTransit, st.st/MAX_ST, '#22d3ee', t.barStVal(st.st))+
    barRow(t.barSchools, st.sch/MAX_SCH, '#a3e635', t.barSchVal(st.sch));

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
map.createPane('suburbPane');map.getPane('suburbPane').style.zIndex=450;
let suburbLayer=null,suburbOn=false,selectedSubPoly=null,suburbPolys={};
const SUB_BASE={color:'rgba(221,225,236,0.5)',weight:0.8,opacity:1,dashArray:'3 3',fillOpacity:0.02};
const SUB_SEL={color:'#ffffff',weight:3,opacity:1,dashArray:null,fillOpacity:0.1};
function deselectSuburb(){if(selectedSubPoly){selectedSubPoly.setStyle(SUB_BASE);selectedSubPoly=null;}}
function buildSuburbLayer(){
  suburbLayer=L.layerGroup();suburbPolys={};
  SUBURBS.forEach((s,si)=>{
    const d=LGAS[s.l];if(!d)return;
    const latlngs=s.g.map(ring=>[ring.map(([lng,lat])=>[lat,lng])]);
    const poly=L.polygon(latlngs,{pane:'suburbPane',fillColor:CAT_META[d.cat].color,...SUB_BASE});
    const l2n=(s.l2||[]).map(id=>LGAS[id]?LGAS[id].name:id).join(' · ');
    const tip=`${s.n}${s.pc?(' · '+s.pc):''}`+(l2n?`<br><span style="font-size:9.5px;color:#8890a8">${T().partly(l2n)}</span>`:'');
    poly.bindTooltip(tip,{sticky:true,direction:'top',className:'sub-tip',opacity:1});
    poly.on('click',(e)=>{
      L.DomEvent.stopPropagation(e);
      deselectSuburb();selectedSubPoly=poly;poly.setStyle(SUB_SEL);poly.bringToFront();
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
const ZOOM_GLYPH=12; // 이상이면 기호핀, 미만이면 작은 점 (12=바닥, ≤11은 바이브 라벨 구간)
const DOT_R=6.5; // POI 점 반경 단일값(대중교통 제외 전 오버레이 통일)
function glyphHtml(cat,color,d){
  const s=Math.round(d*0.62);
  return `<div class="gpin" style="width:${d}px;height:${d}px;background:${color}"><svg width="${s}" height="${s}" viewBox="0 0 24 24">${GLYPHS[cat]}</svg></div>`;
}
function poiMarker(ll,o){
  let mk;
  if(map.getZoom()>=ZOOM_GLYPH){
    const d=o.glyph||22;
    mk=L.marker(ll,{pane:o.pane,icon:L.divIcon({className:'',html:glyphHtml(o.cat,o.color,d),iconSize:[d,d],iconAnchor:[d/2,d/2]})});
  }else{
    mk=L.circleMarker(ll,{pane:o.pane,radius:o.dot||DOT_R,color:'#0c0f14',weight:1.1,fillColor:o.color,fillOpacity:1});
  }
  if(o.tooltip)mk.bindTooltip(o.tooltip,{direction:'top',className:'sub-tip',opacity:1});
  if(o.popup)mk.bindPopup(o.popup,{maxWidth:o.maxWidth||240});
  return mk;
}
function dimMarker(mk,visible,front){ // 격리: 안 뽑힌 건 흐림, 뽑힌 건 맨 앞으로
  const op=visible?1:0.22;
  if(mk instanceof L.CircleMarker){mk.setStyle({opacity:op,fillOpacity:op});if(visible&&front)mk.bringToFront();}
  else{mk.setOpacity(op);if(mk.setZIndexOffset)mk.setZIndexOffset(visible&&front?1000:0);}
}
// 줌 임계 넘으면 켜져있는 POI 레이어만 재생성(점↔기호 전환), 필터 상태 보존
let _poiGlyph=null;
function refreshPoiZoom(){
  const g=map.getZoom()>=ZOOM_GLYPH;
  if(g===_poiGlyph)return;
  _poiGlyph=g;
  if(schoolOn&&schoolLayer){const f=schoolFilter;map.removeLayer(schoolLayer);schoolLayer=null;buildSchoolLayer();schoolLayer.addTo(map);schoolFilter=f;applySchoolFilter();}
  if(hospitalOn&&hospitalLayer){const f=hospitalFilter;map.removeLayer(hospitalLayer);hospitalLayer=null;buildHospitalLayer();hospitalLayer.addTo(map);hospitalFilter=f;applyHospitalFilter();}
  if(martOn&&martLayer){const f=martFilter;map.removeLayer(martLayer);martLayer=null;buildMartLayer();martLayer.addTo(map);martFilter=f;applyMartFilter();}
  if(restOn&&restLayer){const f=restFilter;map.removeLayer(restLayer);restLayer=null;buildRestLayer();restLayer.addTo(map);restFilter=f;applyRestFilter();}
  if(cafeOn&&cafeLayer){const f=cafeFilter;map.removeLayer(cafeLayer);cafeLayer=null;buildCafeLayer();cafeLayer.addTo(map);cafeFilter=f;applyCafeFilter();}
  if(pubOn&&pubLayer){const f=pubFilter;map.removeLayer(pubLayer);pubLayer=null;buildPubLayer();pubLayer.addTo(map);pubFilter=f;applyPubFilter();}
  if(parkOn&&parkLayer){const f=parkFilter;map.removeLayer(parkLayer);parkLayer=null;buildParkLayer();parkLayer.addTo(map);parkFilter=f;applyParkFilter();}
  if(adminOn&&adminLayer){const f=adminFilter;map.removeLayer(adminLayer);adminLayer=null;buildAdminLayer();adminLayer.addTo(map);adminFilter=f;applyAdminFilter();}
  if(shopOn&&shopLayer){map.removeLayer(shopLayer);shopLayer=null;buildShopLayer();shopLayer.addTo(map);}
  if(sightOn&&sightLayer){const f=sightFilter;map.removeLayer(sightLayer);sightLayer=null;buildSightLayer();sightLayer.addTo(map);sightFilter=f;applyMarkerFilter(sightMarks,sightFilter);}
  if(facOn&&facLayer){const f=facFilter;map.removeLayer(facLayer);facLayer=null;buildFacLayer();facLayer.addTo(map);facFilter=f;applyMarkerFilter(facMarks,facFilter);}
}

// ═══════════════ 대중교통 레이어 (SVG — 클릭 통과, 원 기호만) ═══════════════
map.createPane('transitPane');map.getPane('transitPane').style.zIndex=460;
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
function setTransitFilter(t){transitFilter=(transitFilter===t)?null:t;applyTransitFilter();renderMiniLegend();}
function buildTransitLayer(){
  transitLayer=L.layerGroup();
  transitMarkers={train:[],tram:[],bus:[]};transitFilter=null;
  // 버스 간선(Go Zone 코리도 대표 8노선) — 노선당 멀티폴리라인 1개, 얇고 흐리게
  BUS_TRUNK.forEach(rt=>{
    const pl=L.polyline(rt.segs,{pane:'transitPane',color:TRANSIT_COLOR.bus,weight:TRANSIT_W,opacity:TRANSIT_BASE_OP.bus,lineCap:'round',lineJoin:'round',interactive:false});
    transitMarkers.bus.push(pl);pl.addTo(transitLayer);
  });
  // 간선 정류장 603곳 — 항상 표시
  busStopGroup=L.layerGroup();
  BUS_STOPS.forEach(s=>{
    const mk=L.circleMarker(s.ll,{pane:'transitPane',radius:TRANSIT_R,color:'#0c0f14',weight:1,fillColor:TRANSIT_COLOR.bus,fillOpacity:1})
      .bindTooltip(`${s.n}<br><span style="font-size:9px;color:#8890a8">${T().busStop}</span>`,{direction:'top',className:'sub-tip',opacity:1});
    transitMarkers.bus.push(mk);mk.addTo(busStopGroup);
  });
  busStopGroup.addTo(transitLayer);
  TRANSIT.lines.forEach(l=>{
    const pl=L.polyline(l.c,{pane:'transitPane',color:TRANSIT_COLOR[l.t],weight:TRANSIT_W,opacity:0.9,lineCap:'round',lineJoin:'round',interactive:false});
    (transitMarkers[l.t]||transitMarkers.train).push(pl);pl.addTo(transitLayer);
  });
  TRANSIT.stations.forEach(s=>{
    const isTram=s.t==='tram';
    const mk=L.circleMarker(s.ll,{pane:'transitPane',radius:TRANSIT_R,color:'#0c0f14',weight:1,fillColor:TRANSIT_COLOR[s.t],fillOpacity:1})
      .bindTooltip(`${s.n}<br><span style="font-size:9px;color:#8890a8">${isTram?T().tram:T().train}</span>`,{direction:'top',className:'sub-tip',opacity:1});
    (transitMarkers[s.t]||transitMarkers.train).push(mk);mk.addTo(transitLayer);
  });
}
function setTransitLayer(on){
  transitOn=on;
  if(on){if(!transitLayer)buildTransitLayer();transitLayer.addTo(map);}
  else if(transitLayer){map.removeLayer(transitLayer);}
  renderMiniLegend();syncOverlayRows();
}

// ═══════════════ 학교 레이어 ═══════════════
map.createPane('schoolPane');map.getPane('schoolPane').style.zIndex=462;
const SCHOOL_COLOR={p:PALETTE[0],s:PALETTE[1],u:PALETTE[2],c:PALETTE[3],o:PALETTE[4]}; // 초 중고 대학 칼리지 기타
function uniPopupHtml(u){
  const d=(LANG==='en'&&u.en)?u.en:u;
  return `<div class="popup-inner"><div class="popup-name">${u.n}</div><div class="popup-sub">${d.sub}</div><div class="popup-desc">${d.desc}</div></div>`;
}
let schoolLayer=null,schoolOn=false;
let schoolMarkers={p:[],s:[],u:[],c:[],o:[]},schoolFilter=null;
function applySchoolFilter(){
  Object.entries(schoolMarkers).forEach(([t,arr])=>{
    const on=(!schoolFilter||schoolFilter===t);
    arr.forEach(mk=>dimMarker(mk,on,!!schoolFilter));
  });
}
function setSchoolFilter(t){
  schoolFilter=(schoolFilter===t)?null:t;
  applySchoolFilter();renderMiniLegend();
}
function schoolPopupHtml(s){
  return `<div class="popup-inner"><div class="popup-name">${s.n}</div><div class="popup-sub">${T().schoolTypes[s.t]}</div></div>`;
}
function buildSchoolLayer(){
  schoolLayer=L.layerGroup();
  schoolMarkers={p:[],s:[],u:[],c:[],o:[]};schoolFilter=null;
  SCHOOLS.forEach(s=>{
    const mk=poiMarker(s.ll,{cat:'school',color:SCHOOL_COLOR[s.t]||SCHOOL_COLOR.o,pane:'schoolPane',
      tooltip:`${s.n}<br><span style="font-size:9px;color:#8890a8">${T().schoolTypes[s.t]}</span>`,
      popup:schoolPopupHtml(s)});
    (schoolMarkers[s.t]||schoolMarkers.o).push(mk);
    mk.addTo(schoolLayer);
  });
  CURATED_UNIS.forEach(u=>{
    const mk=poiMarker(u.ll,{cat:'school',color:SCHOOL_COLOR.u,pane:'schoolPane',
      tooltip:`${u.n}<br><span style="font-size:9px;color:#8890a8">${T().schoolTypes.u}</span>`,
      popup:uniPopupHtml(u)});
    schoolMarkers.u.push(mk);
    mk.addTo(schoolLayer);
  });
}
function setSchoolLayer(on){
  schoolOn=on;
  if(on){if(!schoolLayer)buildSchoolLayer();schoolLayer.addTo(map);}
  else if(schoolLayer){map.removeLayer(schoolLayer);}
  renderMiniLegend();syncOverlayRows();
}

// ═══════════════ 병원 레이어 (OSM amenity=hospital → 주요 공공·사립 큐레이트, 2026-07) ═══════════════
map.createPane('hospPane');map.getPane('hospPane').style.zIndex=463;
// 의료: 병원(큐레이트 14) + 약국·의원·치과(OSM, LGA 클립). 십자 글리프 공유
const MED_COLOR={hos:PALETTE[0],dr:PALETTE[1],de:PALETTE[4],km:PALETTE[6],ph:PALETTE[3]}; // 병원 빨·의원 주·치과 시안·한의원 보라·약국 초
let hospitalLayer=null,hospitalOn=false;
let hospitalMarkers={hos:[],dr:[],de:[],km:[],ph:[]},hospitalFilter=null;
function applyHospitalFilter(){
  Object.entries(hospitalMarkers).forEach(([t,arr])=>{
    const on=(!hospitalFilter||hospitalFilter===t);
    arr.forEach(m=>dimMarker(m,on,!!hospitalFilter));
  });
}
function setHospitalFilter(t){hospitalFilter=(hospitalFilter===t)?null:t;applyHospitalFilter();renderMiniLegend();}
function medPopupHtml(item){
  const t=T();
  if(item.hos){
    const desc=(LANG==='en'&&item.en)?item.en:item.desc;
    const own=t.hospOwn[item.own]||'';
    return `<div class="popup-inner"><div class="popup-name">${item.n}</div><div class="popup-sub">${t.hospTypes.hos}${own?' · '+own:''}</div><div class="popup-desc">${desc}</div></div>`;
  }
  return `<div class="popup-inner"><div class="popup-name">${item.n}</div><div class="popup-sub">${t.hospTypes[item.t]}</div></div>`;
}
function buildHospitalLayer(){
  hospitalLayer=L.layerGroup();
  hospitalMarkers={hos:[],dr:[],de:[],km:[],ph:[]};hospitalFilter=null;
  const items=[
    ...HOSPITALS.map(h=>({ll:h.ll,n:h.n,t:'hos',hos:true,own:h.t,desc:h.desc,en:h.en})),
    ...MEDICAL.map(m=>({ll:m.ll,n:m.n,t:m.t}))
  ];
  items.forEach(item=>{
    const lab=T().hospTypes[item.t];
    const mk=poiMarker(item.ll,{cat:'hospital',color:MED_COLOR[item.t]||MED_COLOR.hos,pane:'hospPane',
      tooltip:`${item.n}<br><span style="font-size:9px;color:#8890a8">${lab}</span>`,
      popup:medPopupHtml(item)});
    (hospitalMarkers[item.t]||hospitalMarkers.hos).push(mk);mk.addTo(hospitalLayer);
  });
}
function setHospitalLayer(on){
  hospitalOn=on;
  if(on){if(!hospitalLayer)buildHospitalLayer();hospitalLayer.addTo(map);}
  else if(hospitalLayer){map.removeLayer(hospitalLayer);}
  renderMiniLegend();syncOverlayRows();
}

// ═══════════════ 마트/장보기 레이어 (OSM shop=supermarket + 국가별 식료품점, LGA 클립) ═══════════════
map.createPane('martPane');map.getPane('martPane').style.zIndex=464;
const MART_COLOR={big:PALETTE[0],local:PALETTE[1],intl:PALETTE[2],liq:PALETTE[3]}; // 대형 지역 국가별 주류
let martLayer=null,martOn=false;
let martMarkers={big:[],local:[],intl:[],liq:[]},martFilter=null;
function applyMartFilter(){
  Object.entries(martMarkers).forEach(([t,arr])=>{
    const on=(!martFilter||martFilter===t);
    arr.forEach(m=>dimMarker(m,on,!!martFilter));
  });
}
function setMartFilter(t){martFilter=(martFilter===t)?null:t;applyMartFilter();renderMiniLegend();}
function buildMartLayer(){
  martLayer=L.layerGroup();
  martMarkers={big:[],local:[],intl:[],liq:[]};martFilter=null;
  MARTS.forEach(m=>{
    const lab=(m.t==='intl'&&m.o&&T().origins[m.o])?`${T().martTypes.intl} · ${T().origins[m.o]}`:T().martTypes[m.t];
    const mk=poiMarker(m.ll,{cat:'mart',color:MART_COLOR[m.t]||MART_COLOR.big,pane:'martPane',maxWidth:220,
      tooltip:`${m.n}<br><span style="font-size:9px;color:#8890a8">${lab}</span>`,
      popup:`<div class="popup-inner"><div class="popup-name">${m.n}</div><div class="popup-sub">${lab}</div></div>`});
    (martMarkers[m.t]||martMarkers.big).push(mk);mk.addTo(martLayer);
  });
}
function setMartLayer(on){
  martOn=on;
  if(on){if(!martLayer)buildMartLayer();martLayer.addTo(map);}
  else if(martLayer){map.removeLayer(martLayer);}
  renderMiniLegend();syncOverlayRows();
}

// ═══════════════ 쇼핑 레이어 (주요 쇼핑센터 큐레이트) ═══════════════
map.createPane('shopPane');map.getPane('shopPane').style.zIndex=465;
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
    poiMarker(s.ll,{cat:'shopping',color:SHOP_COLOR,pane:'shopPane',maxWidth:220,
      tooltip:`${s.n}<br><span style="font-size:9px;color:#8890a8">${sub}</span>`,
      popup:shopPopupHtml(s)}).addTo(shopLayer);
  });
}
function setShopLayer(on){
  shopOn=on;
  if(on){if(!shopLayer)buildShopLayer();shopLayer.addTo(map);}
  else if(shopLayer){map.removeLayer(shopLayer);}
  renderMiniLegend();syncOverlayRows();
}

// ═══════════════ 명소(sight) / 시설(facility) 레이어 ═══════════════
function markerPopupHtml(m){
  return `<div class="popup-inner"><div class="popup-name">${m.name}</div><div class="popup-sub">${markerField(m,'sub')}</div><div class="popup-desc">${markerField(m,'desc')}</div></div>`;
}
map.createPane('sightPane');map.getPane('sightPane').style.zIndex=466;
map.createPane('facPane');map.getPane('facPane').style.zIndex=467;
const SIGHT_COLOR={beach:PALETTE[4],wine:PALETTE[0]};      // 해변 시안·와이너리 빨강
const FAC_COLOR={air:PALETTE[1],port:PALETTE[4],district:PALETTE[6]}; // 공항 주황·항구 시안·혁신 보라
// 공통 빌더: ov='sight'|'facility'
function buildMarkerLayer(ov,cat,colors,paneName){
  const layer=L.layerGroup(),marks={};
  MARKERS.filter(m=>m.ov===ov).forEach(m=>{
    (marks[m.st]=marks[m.st]||[]);
    const mk=poiMarker([m.lat,m.lng],{cat,color:colors[m.st],pane:paneName,maxWidth:260,
      tooltip:`${m.name}<br><span style="font-size:9px;color:#8890a8">${markerField(m,'sub')}</span>`,
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
function buildSightLayer(){const r=buildMarkerLayer('sight','landmark',SIGHT_COLOR,'sightPane');sightLayer=r.layer;sightMarks=r.marks;sightFilter=null;}
function setSightFilter(t){sightFilter=(sightFilter===t)?null:t;applyMarkerFilter(sightMarks,sightFilter);renderMiniLegend();}
function setSightLayer(on){sightOn=on;if(on){if(!sightLayer)buildSightLayer();sightLayer.addTo(map);}else if(sightLayer){map.removeLayer(sightLayer);}renderMiniLegend();syncOverlayRows();}
// 시설
let facLayer=null,facOn=false,facMarks={},facFilter=null;
function buildFacLayer(){const r=buildMarkerLayer('facility','facility',FAC_COLOR,'facPane');facLayer=r.layer;facMarks=r.marks;facFilter=null;}
function setFacFilter(t){facFilter=(facFilter===t)?null:t;applyMarkerFilter(facMarks,facFilter);renderMiniLegend();}
function setFacLayer(on){facOn=on;if(on){if(!facLayer)buildFacLayer();facLayer.addTo(map);}else if(facLayer){map.removeLayer(facLayer);}renderMiniLegend();syncOverlayRows();}

// ═══════════════ 식당 (아시아계, OSM cuisine → LGA 클립) ═══════════════
map.createPane('restPane');map.getPane('restPane').style.zIndex=468;
const REST_COLOR={as:PALETTE[0],eu:PALETTE[3],am:PALETTE[5],etc:PALETTE[4]}; // 권역: 아시안 빨·유럽중동 초·아메리카 파·기타 시안
// cuisine 원본키 → [KO,EN] (팝업 국가 표기). 미매핑은 영문 타이틀케이스
const CUISINE={korean:['한식','Korean'],japanese:['일식','Japanese'],chinese:['중식','Chinese'],vietnamese:['베트남','Vietnamese'],thai:['태국','Thai'],indian:['인도','Indian'],italian:['이탈리안','Italian'],pizza:['피자','Pizza'],burger:['버거','Burger'],mexican:['멕시칸','Mexican'],greek:['그리스','Greek'],sushi:['스시','Sushi'],noodle:['면','Noodle'],ramen:['라멘','Ramen'],asian:['아시안','Asian'],sandwich:['샌드위치','Sandwich'],chicken:['치킨','Chicken'],kebab:['케밥','Kebab'],fish_and_chips:['피시앤칩스','Fish & chips'],lebanese:['레바논','Lebanese'],turkish:['터키','Turkish'],malaysian:['말레이시아','Malaysian'],indonesian:['인도네시아','Indonesian'],spanish:['스페인','Spanish'],french:['프렌치','French'],seafood:['해산물','Seafood'],bakery:['베이커리','Bakery'],fusion:['퓨전','Fusion'],modern_australian:['호주식','Modern Australian'],australian:['호주식','Australian'],bbq:['바베큐','BBQ'],breakfast:['브런치','Breakfast'],nepalese:['네팔','Nepalese'],sri_lankan:['스리랑카','Sri Lankan'],american:['아메리칸','American'],mediterranean:['지중해','Mediterranean'],tapas:['타파스','Tapas'],portuguese:['포르투갈','Portuguese'],german:['독일','German'],african:['아프리카','African'],curry:['커리','Curry'],pho:['베트남','Pho'],dumpling:['만두','Dumpling'],taiwanese:['대만','Taiwanese'],cantonese:['중식','Cantonese'],steak_house:['스테이크','Steak'],ice_cream:['아이스크림','Ice cream'],donut:['도넛','Donut'],coffee_shop:['커피','Coffee']};
function cuisineLabel(c){if(!c)return '';const m=CUISINE[c];if(m)return LANG==='en'?m[1]:m[0];return c.replace(/_/g,' ').replace(/\b\w/g,x=>x.toUpperCase());}
let restLayer=null,restOn=false,restMarkers={as:[],eu:[],am:[],etc:[]},restFilter=null;
function applyRestFilter(){Object.entries(restMarkers).forEach(([t,arr])=>{const on=(!restFilter||restFilter===t);arr.forEach(m=>dimMarker(m,on,!!restFilter));});}
function setRestFilter(t){restFilter=(restFilter===t)?null:t;applyRestFilter();renderMiniLegend();}
function buildRestLayer(){
  restLayer=L.layerGroup();restMarkers={as:[],eu:[],am:[],etc:[]};restFilter=null;
  RESTAURANTS.forEach(r=>{
    const cz=cuisineLabel(r.c);
    const lab=T().restTypes[r.t]+(cz?' · '+cz:'');
    const mk=poiMarker(r.ll,{cat:'restaurant',color:REST_COLOR[r.t]||REST_COLOR.etc,pane:'restPane',maxWidth:220,
      tooltip:`${r.n}<br><span style="font-size:9px;color:#8890a8">${lab}</span>`,
      popup:`<div class="popup-inner"><div class="popup-name">${r.n}</div><div class="popup-sub">${lab}</div></div>`});
    (restMarkers[r.t]||restMarkers.etc).push(mk);mk.addTo(restLayer);
  });
}
function setRestLayer(on){restOn=on;if(on){if(!restLayer)buildRestLayer();restLayer.addTo(map);}else if(restLayer){map.removeLayer(restLayer);}renderMiniLegend();syncOverlayRows();}

// ═══════════════ 카페 (OSM amenity=cafe, 단일) ═══════════════
map.createPane('cafePane');map.getPane('cafePane').style.zIndex=469;
const CAFE_COLOR={cafe:PALETTE[6],bakery:PALETTE[1],brunch:PALETTE[3]}; // 카페 보라·베이커리 주황·브런치 초록
let cafeLayer=null,cafeOn=false,cafeMarkers={cafe:[],bakery:[],brunch:[]},cafeFilter=null;
function applyCafeFilter(){Object.entries(cafeMarkers).forEach(([t,arr])=>{const on=(!cafeFilter||cafeFilter===t);arr.forEach(m=>dimMarker(m,on,!!cafeFilter));});}
function setCafeFilter(t){cafeFilter=(cafeFilter===t)?null:t;applyCafeFilter();renderMiniLegend();}
function buildCafeLayer(){
  cafeLayer=L.layerGroup();cafeMarkers={cafe:[],bakery:[],brunch:[]};cafeFilter=null;
  CAFES.forEach(c=>{
    const lab=T().cafeTypes[c.t];
    const mk=poiMarker(c.ll,{cat:'cafe',color:CAFE_COLOR[c.t]||CAFE_COLOR.cafe,pane:'cafePane',maxWidth:200,
      tooltip:`${c.n}<br><span style="font-size:9px;color:#8890a8">${lab}</span>`,
      popup:`<div class="popup-inner"><div class="popup-name">${c.n}</div><div class="popup-sub">${lab}</div></div>`});
    (cafeMarkers[c.t]||cafeMarkers.cafe).push(mk);mk.addTo(cafeLayer);
  });
}
function setCafeLayer(on){cafeOn=on;if(on){if(!cafeLayer)buildCafeLayer();cafeLayer.addTo(map);}else if(cafeLayer){map.removeLayer(cafeLayer);}renderMiniLegend();syncOverlayRows();}

// ═══════════════ 술집 (OSM amenity=pub/bar → 펍·바) ═══════════════
map.createPane('pubPane');map.getPane('pubPane').style.zIndex=470;
const PUB_COLOR={pub:PALETTE[2],bar:PALETTE[5],wine:PALETTE[0],brew:PALETTE[1],club:PALETTE[6]}; // 펍노랑·바파랑·와인빨·브루주황·클럽보라
let pubLayer=null,pubOn=false,pubMarkers={pub:[],bar:[],wine:[],brew:[],club:[]},pubFilter=null;
function applyPubFilter(){Object.entries(pubMarkers).forEach(([t,arr])=>{const on=(!pubFilter||pubFilter===t);arr.forEach(m=>dimMarker(m,on,!!pubFilter));});}
function setPubFilter(t){pubFilter=(pubFilter===t)?null:t;applyPubFilter();renderMiniLegend();}
function buildPubLayer(){
  pubLayer=L.layerGroup();pubMarkers={pub:[],bar:[],wine:[],brew:[],club:[]};pubFilter=null;
  PUBS.forEach(p=>{
    const lab=T().pubTypes[p.t];
    const mk=poiMarker(p.ll,{cat:'pub',color:PUB_COLOR[p.t]||PUB_COLOR.pub,pane:'pubPane',maxWidth:200,
      tooltip:`${p.n}<br><span style="font-size:9px;color:#8890a8">${lab}</span>`,
      popup:`<div class="popup-inner"><div class="popup-name">${p.n}</div><div class="popup-sub">${lab}</div></div>`});
    (pubMarkers[p.t]||pubMarkers.pub).push(mk);mk.addTo(pubLayer);
  });
}
function setPubLayer(on){pubOn=on;if(on){if(!pubLayer)buildPubLayer();pubLayer.addTo(map);}else if(pubLayer){map.removeLayer(pubLayer);}renderMiniLegend();syncOverlayRows();}

// ═══════════════ 공원·레저 (OSM leisure=park/nature_reserve/garden + drinking_water/toilets/fitness) ═══════════════
map.createPane('parkPane');map.getPane('parkPane').style.zIndex=468;
const PARK_COLOR={park:PALETTE[3],water:PALETTE[4],toilet:PALETTE[5],fitness:PALETTE[0]}; // 공원 초록·음수대 시안·화장실 파랑·헬스 빨강
let parkLayer=null,parkOn=false,parkMarkers={park:[],water:[],toilet:[],fitness:[]},parkFilter=null;
function applyParkFilter(){Object.entries(parkMarkers).forEach(([t,arr])=>{const on=(!parkFilter||parkFilter===t);arr.forEach(m=>dimMarker(m,on,!!parkFilter));});}
function setParkFilter(t){parkFilter=(parkFilter===t)?null:t;applyParkFilter();renderMiniLegend();}
function buildParkLayer(){
  parkLayer=L.layerGroup();parkMarkers={park:[],water:[],toilet:[],fitness:[]};parkFilter=null;
  PARKS.forEach(p=>{
    const lab=T().parkTypes[p.t],nm=p.n||lab;
    const mk=poiMarker(p.ll,{cat:'park',color:PARK_COLOR[p.t]||PARK_COLOR.park,pane:'parkPane',maxWidth:200,
      tooltip:`${nm}<br><span style="font-size:9px;color:#8890a8">${lab}</span>`,
      popup:`<div class="popup-inner"><div class="popup-name">${nm}</div><div class="popup-sub">${lab}</div></div>`});
    (parkMarkers[p.t]||parkMarkers.park).push(mk);mk.addTo(parkLayer);
  });
}
function setParkLayer(on){parkOn=on;if(on){if(!parkLayer)buildParkLayer();parkLayer.addTo(map);}else if(parkLayer){map.removeLayer(parkLayer);}renderMiniLegend();syncOverlayRows();}

// ═══════════════ 생활·행정 (OSM bank/post_office/office=government/mobile_phone) ═══════════════
map.createPane('adminPane');map.getPane('adminPane').style.zIndex=467;
const ADMIN_COLOR={govt:PALETTE[5],bank:PALETTE[3],post:PALETTE[0],telecom:PALETTE[1],lib:PALETTE[6]}; // 관공서 파랑·은행 초록·우체국 빨강(호주우체국)·통신 주황·도서관 보라
let adminLayer=null,adminOn=false,adminMarkers={govt:[],bank:[],post:[],telecom:[],lib:[]},adminFilter=null;
function applyAdminFilter(){Object.entries(adminMarkers).forEach(([t,arr])=>{const on=(!adminFilter||adminFilter===t);arr.forEach(m=>dimMarker(m,on,!!adminFilter));});}
function setAdminFilter(t){adminFilter=(adminFilter===t)?null:t;applyAdminFilter();renderMiniLegend();}
function buildAdminLayer(){
  adminLayer=L.layerGroup();adminMarkers={govt:[],bank:[],post:[],telecom:[],lib:[]};adminFilter=null;
  ADMIN.forEach(a=>{
    const lab=T().adminTypes[a.t],nm=a.n||lab;
    const mk=poiMarker(a.ll,{cat:'admin',color:ADMIN_COLOR[a.t]||ADMIN_COLOR.govt,pane:'adminPane',maxWidth:200,
      tooltip:`${nm}<br><span style="font-size:9px;color:#8890a8">${lab}</span>`,
      popup:`<div class="popup-inner"><div class="popup-name">${nm}</div><div class="popup-sub">${lab}</div></div>`});
    (adminMarkers[a.t]||adminMarkers.govt).push(mk);mk.addTo(adminLayer);
  });
}
function setAdminLayer(on){adminOn=on;if(on){if(!adminLayer)buildAdminLayer();adminLayer.addTo(map);}else if(adminLayer){map.removeLayer(adminLayer);}renderMiniLegend();syncOverlayRows();}

// ═══════════════ 바이브 라벨 (줌 ≤ 11) ═══════════════
let vibeMarkers=[];
function buildVibes(){
  vibeMarkers.forEach(mk=>map.removeLayer(mk));
  vibeMarkers=[];
  VIBES.forEach(([lat,lng,cat,size],i)=>{
    const c=CAT_META[cat].color;
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
  {id:'suburb',color:'#dde1ec',swatch:'dash',get:()=>suburbOn,set:setSuburbLayer},
  {id:'transit',color:'#dde1ec',swatch:'dot',get:()=>transitOn,set:setTransitLayer}, // 원 기호
  {id:'schools',color:'#dde1ec',swatch:'glyph',cat:'school',get:()=>schoolOn,set:setSchoolLayer},
  {id:'hospitals',color:'#dde1ec',swatch:'glyph',cat:'hospital',get:()=>hospitalOn,set:setHospitalLayer},
  {id:'marts',color:'#dde1ec',swatch:'glyph',cat:'mart',get:()=>martOn,set:setMartLayer},
  {id:'restaurant',color:'#dde1ec',swatch:'glyph',cat:'restaurant',get:()=>restOn,set:setRestLayer},
  {id:'cafe',color:'#dde1ec',swatch:'glyph',cat:'cafe',get:()=>cafeOn,set:setCafeLayer},
  {id:'pubs',color:'#dde1ec',swatch:'glyph',cat:'pub',get:()=>pubOn,set:setPubLayer},
  {id:'parks',color:'#dde1ec',swatch:'glyph',cat:'park',get:()=>parkOn,set:setParkLayer},
  {id:'shopping',color:'#dde1ec',swatch:'glyph',cat:'shopping',get:()=>shopOn,set:setShopLayer},
  {id:'sight',color:'#dde1ec',swatch:'glyph',cat:'landmark',get:()=>sightOn,set:setSightLayer},
  {id:'facility',color:'#dde1ec',swatch:'glyph',cat:'facility',get:()=>facOn,set:setFacLayer},
  {id:'admin',color:'#dde1ec',swatch:'glyph',cat:'admin',get:()=>adminOn,set:setAdminLayer},
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
        def.set(!def.get());
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
    if(def)row.classList.toggle('on',def.get());
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
  SCHOOLS.forEach(s=>push({kind:'school',st:s.t,n:s.n,ll:s.ll}));
  CURATED_UNIS.forEach(u=>push({kind:'school',st:'u',n:u.n,ll:u.ll}));
  HOSPITALS.forEach(h=>push({kind:'hosp',st:'hos',n:h.n,ll:h.ll}));
  MEDICAL.forEach(m=>push({kind:'hosp',st:m.t,n:m.n,ll:m.ll}));
  RESTAURANTS.forEach(r=>push({kind:'rest',st:r.t,c:r.c,n:r.n,ll:r.ll}));
  CAFES.forEach(c=>push({kind:'cafe',st:c.t,n:c.n,ll:c.ll}));
  PUBS.forEach(p=>push({kind:'pub',st:p.t,n:p.n,ll:p.ll}));
  PARKS.forEach(p=>{if(p.n)push({kind:'park',st:p.t,n:p.n,ll:p.ll});}); // 이름있는 것만 검색(음수대·화장실 무명 제외)
  ADMIN.forEach(a=>{if(a.n)push({kind:'admin',st:a.t,n:a.n,ll:a.ll});});
  MARTS.forEach(m=>push({kind:'mart',st:m.t,o:m.o,n:m.n,ll:m.ll}));
  MALLS.forEach(m=>push({kind:'mall',n:m.n,ll:m.ll}));
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
  return '#e8c87a';
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
function focusPoi(p){
  if(p.kind==='school'&&!schoolOn)setSchoolLayer(true);
  else if(p.kind==='hosp'&&!hospitalOn)setHospitalLayer(true);
  else if(p.kind==='mart'&&!martOn)setMartLayer(true);
  else if(p.kind==='rest'&&!restOn)setRestLayer(true);
  else if(p.kind==='cafe'&&!cafeOn)setCafeLayer(true);
  else if(p.kind==='pub'&&!pubOn)setPubLayer(true);
  else if(p.kind==='park'&&!parkOn)setParkLayer(true);
  else if(p.kind==='admin'&&!adminOn)setAdminLayer(true);
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
  const lay={school:()=>schoolLayer,hosp:()=>hospitalLayer,mart:()=>martLayer,rest:()=>restLayer,cafe:()=>cafeLayer,pub:()=>pubLayer,park:()=>parkLayer,admin:()=>adminLayer,mall:()=>shopLayer}[p.kind];
  if(lay)setTimeout(()=>openMarkerAt(lay(),p.ll),140);
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
  deselectSuburb();selectedSubPoly=poly;poly.setStyle(SUB_SEL);poly.bringToFront();
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
        const d=LGAS[it.id],c=(CAT_META[d.cat]&&CAT_META[d.cat].color)||'#dde1ec';
        return sprRow(i,c,d.name,T().searchCouncil);
      }
      if(it.type==='poi'){
        const p=getPois()[it.pi];
        return sprRow(i,poiColor(p),p.n,poiMeta(p));
      }
      const s=SUBURBS[it.si],d=LGAS[s.l];
      const meta=`${T().searchSuburb} · ${s.pc?s.pc+' · ':''}${d?d.name.replace('City of ','').replace('Town of ','').replace('The City of ',''):''}`;
      return sprRow(i,'#dde1ec',s.n,meta);
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
    if(it.type==='lga')focusLga(it.id);
    else if(it.type==='poi')focusPoi(getPois()[it.pi]);
    else focusSuburb(it.si);
  }
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
  if(schoolOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.school}</svg></span>${t.layers.schools}</div>`+
      ['p','s','u','c','o'].map(k=>`<div class="ml-item ml-click${schoolFilter&&schoolFilter!==k?' dim':''}" data-sch="${k}"><span class="ml-dot" style="color:${SCHOOL_COLOR[k]}"></span>${t.schoolTypes[k]}</div>`).join('');
  }
  if(hospitalOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.hospital}</svg></span>${t.layers.hospitals}</div>`+
      ['hos','dr','de','km','ph'].map(k=>`<div class="ml-item ml-click${hospitalFilter&&hospitalFilter!==k?' dim':''}" data-hos="${k}"><span class="ml-dot" style="color:${MED_COLOR[k]}"></span>${t.hospTypes[k]}</div>`).join('');
  }
  if(martOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.mart}</svg></span>${t.layers.marts}</div>`+
      ['big','local','intl','liq'].map(k=>`<div class="ml-item ml-click${martFilter&&martFilter!==k?' dim':''}" data-mart="${k}"><span class="ml-dot" style="color:${MART_COLOR[k]}"></span>${t.martTypes[k]}</div>`).join('');
  }
  if(restOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.restaurant}</svg></span>${t.layers.restaurant}</div>`+
      ['as','eu','am','etc'].map(k=>`<div class="ml-item ml-click${restFilter&&restFilter!==k?' dim':''}" data-rest="${k}"><span class="ml-dot" style="color:${REST_COLOR[k]}"></span>${t.restTypes[k]}</div>`).join('');
  }
  if(shopOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.shopping}</svg></span>${t.layers.shopping}</div>`+
      `<div class="ml-item"><span class="ml-dot" style="color:${SHOP_COLOR}"></span>${LANG==='en'?'Major centre':'주요 쇼핑센터'}</div>`;
  }
  if(sightOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.landmark}</svg></span>${t.layers.sight}</div>`+
      ['beach','wine'].map(k=>`<div class="ml-item ml-click${sightFilter&&sightFilter!==k?' dim':''}" data-sight="${k}"><span class="ml-dot" style="color:${SIGHT_COLOR[k]}"></span>${t.sightTypes[k]}</div>`).join('');
  }
  if(facOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.facility}</svg></span>${t.layers.facility}</div>`+
      ['air','port','district'].map(k=>`<div class="ml-item ml-click${facFilter&&facFilter!==k?' dim':''}" data-fac="${k}"><span class="ml-dot" style="color:${FAC_COLOR[k]}"></span>${t.facTypes[k]}</div>`).join('');
  }
  if(cafeOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.cafe}</svg></span>${t.layers.cafe}</div>`+
      ['cafe','bakery','brunch'].map(k=>`<div class="ml-item ml-click${cafeFilter&&cafeFilter!==k?' dim':''}" data-cafe="${k}"><span class="ml-dot" style="color:${CAFE_COLOR[k]}"></span>${t.cafeTypes[k]}</div>`).join('');
  }
  if(pubOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.pub}</svg></span>${t.layers.pubs}</div>`+
      ['pub','bar','wine','brew','club'].map(k=>`<div class="ml-item ml-click${pubFilter&&pubFilter!==k?' dim':''}" data-pub="${k}"><span class="ml-dot" style="color:${PUB_COLOR[k]}"></span>${t.pubTypes[k]}</div>`).join('');
  }
  if(parkOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.park}</svg></span>${t.layers.parks}</div>`+
      ['park','water','toilet','fitness'].map(k=>`<div class="ml-item ml-click${parkFilter&&parkFilter!==k?' dim':''}" data-park="${k}"><span class="ml-dot" style="color:${PARK_COLOR[k]}"></span>${t.parkTypes[k]}</div>`).join('');
  }
  if(adminOn){
    html+=`<div class="ml-title" style="margin-top:7px"><span class="ml-glyph"><svg width="13" height="13" viewBox="0 0 24 24">${GLYPHS.admin}</svg></span>${t.layers.admin}</div>`+
      ['govt','bank','post','telecom','lib'].map(k=>`<div class="ml-item ml-click${adminFilter&&adminFilter!==k?' dim':''}" data-admin="${k}"><span class="ml-dot" style="color:${ADMIN_COLOR[k]}"></span>${t.adminTypes[k]}</div>`).join('');
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
  // 레이어 툴팁 언어 재생성
  [['suburb',()=>suburbLayer,(v)=>suburbLayer=v,buildSuburbLayer,()=>suburbOn],
   ['transit',()=>transitLayer,(v)=>transitLayer=v,buildTransitLayer,()=>transitOn],
   ['school',()=>schoolLayer,(v)=>schoolLayer=v,buildSchoolLayer,()=>schoolOn],
   ['hosp',()=>hospitalLayer,(v)=>hospitalLayer=v,buildHospitalLayer,()=>hospitalOn],
   ['mart',()=>martLayer,(v)=>martLayer=v,buildMartLayer,()=>martOn],
   ['rest',()=>restLayer,(v)=>restLayer=v,buildRestLayer,()=>restOn],
   ['cafe',()=>cafeLayer,(v)=>cafeLayer=v,buildCafeLayer,()=>cafeOn],
   ['pubs',()=>pubLayer,(v)=>pubLayer=v,buildPubLayer,()=>pubOn],
   ['parks',()=>parkLayer,(v)=>parkLayer=v,buildParkLayer,()=>parkOn],
   ['admin',()=>adminLayer,(v)=>adminLayer=v,buildAdminLayer,()=>adminOn],
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
}
document.getElementById('lang-toggle').addEventListener('click',toggleLang);
document.getElementById('m-lang').addEventListener('click',toggleLang);

// ═══════════════ 모바일: 오버레이 칩바 · 하위칩 · 렌트/치안 · 스케일 ═══════════════
const isMobile=()=>matchMedia('(max-width:680px)').matches;
const M_SUB={
  transit:{items:()=>[['train',T().train],['tram',T().tram],['bus',T().bus]],colors:TRANSIT_COLOR,glyph:null,getF:()=>transitFilter,setF:setTransitFilter},
  schools:{items:()=>['p','s','u','c','o'].map(k=>[k,T().schoolTypes[k]]),colors:SCHOOL_COLOR,glyph:'school',getF:()=>schoolFilter,setF:setSchoolFilter},
  hospitals:{items:()=>['hos','dr','de','km','ph'].map(k=>[k,T().hospTypes[k]]),colors:MED_COLOR,glyph:'hospital',getF:()=>hospitalFilter,setF:setHospitalFilter},
  marts:{items:()=>['big','local','intl','liq'].map(k=>[k,T().martTypes[k]]),colors:MART_COLOR,glyph:'mart',getF:()=>martFilter,setF:setMartFilter},
  restaurant:{items:()=>['as','eu','am','etc'].map(k=>[k,T().restTypes[k]]),colors:REST_COLOR,glyph:'restaurant',getF:()=>restFilter,setF:setRestFilter},
  cafe:{items:()=>['cafe','bakery','brunch'].map(k=>[k,T().cafeTypes[k]]),colors:CAFE_COLOR,glyph:'cafe',getF:()=>cafeFilter,setF:setCafeFilter},
  pubs:{items:()=>['pub','bar','wine','brew','club'].map(k=>[k,T().pubTypes[k]]),colors:PUB_COLOR,glyph:'pub',getF:()=>pubFilter,setF:setPubFilter},
  parks:{items:()=>['park','water','toilet','fitness'].map(k=>[k,T().parkTypes[k]]),colors:PARK_COLOR,glyph:'park',getF:()=>parkFilter,setF:setParkFilter},
  admin:{items:()=>['govt','bank','post','telecom','lib'].map(k=>[k,T().adminTypes[k]]),colors:ADMIN_COLOR,glyph:'admin',getF:()=>adminFilter,setF:setAdminFilter},
  sight:{items:()=>['beach','wine'].map(k=>[k,T().sightTypes[k]]),colors:SIGHT_COLOR,glyph:'landmark',getF:()=>sightFilter,setF:setSightFilter},
  facility:{items:()=>['air','port','district'].map(k=>[k,T().facTypes[k]]),colors:FAC_COLOR,glyph:'facility',getF:()=>facFilter,setF:setFacFilter},
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
  const reset=anyOn?`<span class="mov-chip mov-reset" data-reset="1"><span class="mov-g"><svg width="14" height="14" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19.4 12a7.4 7.4 0 1 1-2.1-5.2M18 3.5V8h-4.5"/></svg></span>${T().clearAll}</span>`:'';
  bar.innerHTML=reset+OVERLAYS.map(o=>{
    const hasSub=!!M_SUB[o.id];
    return `<span class="mov-chip${o.get()?' on':''}" data-ov="${o.id}">${movMark(o)}${T().layers[o.id]}${hasSub?'<span class="mov-caret">▾</span>':''}</span>`;
  }).join('');
  const rc=bar.querySelector('.mov-reset');
  if(rc)rc.addEventListener('click',()=>{OVERLAYS.filter(o=>o.id!=='suburb').forEach(o=>{if(o.get())o.set(false);});mExpanded=null;renderMOverlayBar();renderMSubBar();});
  bar.querySelectorAll('.mov-chip[data-ov]').forEach(c=>c.addEventListener('click',()=>onMChip(c.dataset.ov)));
}
function onMChip(id){
  const o=OVERLAYS.find(x=>x.id===id),hasSub=!!M_SUB[id];
  if(!o.get()){o.set(true);mExpanded=hasSub?id:null;}
  else if(hasSub&&mExpanded!==id){mExpanded=id;}      // 다른 켜진 칩 → 그 하위 펼침
  else{o.set(false);if(mExpanded===id)mExpanded=null;} // 펼친 칩 다시 탭 → 끔
  renderMOverlayBar();renderMSubBar();
}
function renderMSubBar(){
  const sb=document.getElementById('m-subbar');if(!sb)return;
  const cfg=mExpanded&&M_SUB[mExpanded],o=mExpanded&&OVERLAYS.find(x=>x.id===mExpanded);
  if(!cfg||!o||!o.get()){sb.classList.remove('on');sb.innerHTML='';return;}
  const f=cfg.getF();
  sb.innerHTML=cfg.items().map(([k,lab])=>{
    const col=cfg.colors[k];
    const mark=cfg.glyph?`<span class="msub-g" style="color:${col}"><svg width="14" height="14" viewBox="0 0 24 24">${GLYPHS[cfg.glyph]}</svg></span>`
              :`<span class="msub-dot" style="color:${col}"></span>`;
    return `<span class="msub-chip${f&&f!==k?' dim':''}" data-k="${k}">${mark}<span class="msub-tag">${lab}</span></span>`;
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
  btn.innerHTML=`<svg width="21" height="21" viewBox="0 0 24 24">${COLOR_BTN_ICON}</svg>`;
  pop.innerHTML=['category','rent','crime'].map(m=>
    `<div class="mcol-item${mapColorMode===m?' on':''}" data-mode="${m}"><svg width="16" height="16" viewBox="0 0 24 24">${COLOR_ICON[m]}</svg>${T().colorModes[m]}</div>`).join('');
  pop.querySelectorAll('.mcol-item').forEach(it=>it.addEventListener('click',(e)=>{
    e.stopPropagation();mapColorMode=it.dataset.mode;pop.classList.remove('on');
    renderColorSeg();renderMColorBtn();renderMScale();restyleAll();
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
// 딥링크: ?lga=unley
try{
  const cm=new URLSearchParams(location.search).get('color');
  if(cm==='rent'||cm==='crime'){mapColorMode=cm;renderColorSeg();renderMColorBtn();renderMScale();restyleAll();}
  const sel=new URLSearchParams(location.search).get('lga');
  if(sel&&LGAS[sel]){openSheet(sel);map.fitBounds(lgaLayers[sel].getBounds(),{padding:[40,40],maxZoom:ZOOM_LGA});}
  else toast(T().hint,3200);
}catch{toast(T().hint,3200);}
