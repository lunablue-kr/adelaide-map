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
const MARKERS = [
  {id:'glenelg',lat:-34.9813,lng:138.5152,type:'dot',name:'Glenelg Beach',sub:'City of Holdfast Bay',desc:'Adelaide 최대 해변 명소. 트램 종점. Jetty Road 레스토랑·카페 밀집.',color:'#38bdf8'},
  {id:'port_pt',lat:-34.8601,lng:138.4975,type:'dot',name:'Port Adelaide',sub:'City of Port Adelaide Enfield',desc:'역사적 항구 지구. 해양박물관, 창고 개조 카페·갤러리.',color:'#f87171'},
  {id:'tonsley',lat:-35.0114,lng:138.5720,type:'dot',name:'Tonsley Innovation District',sub:'City of Marion',desc:'호주 첫 번째 혁신 산업단지. Flinders University 연계.',color:'#fb923c'},
  {id:'barossa',lat:-34.5333,lng:138.9600,type:'wine',name:'Barossa Valley',sub:'The Barossa Council · Adelaide 북동 약 60km',desc:'호주를 대표하는 와인 산지. 특히 쉬라즈(Shiraz)로 세계적 명성. Penfolds·Jacob\'s Creek·Seppeltsfield 등 유서 깊은 와이너리 밀집. Tanunda·Nuriootpa·Angaston 등 소도시 중심. Adelaide CBD에서 차로 약 1시간.',color:'#9f1239'},
  // 교통·생활 필수
  {id:'airport',lat:-34.9450,lng:138.5310,type:'dot',name:'Adelaide Airport (ADL)',sub:'City of West Torrens',desc:'국내·국제선 공항. CBD에서 차로 약 15분, JetExpress 버스 운행. 인근에 Harbour Town 아울렛.',color:'#fb923c'},
  // 권역별 쇼핑·생활 허브
  // 해변
  {id:'henley',lat:-34.9201,lng:138.4935,type:'dot',name:'Henley Beach',sub:'City of Charles Sturt · Henley Square',desc:'노을 명소. Henley Square 광장을 둘러싼 레스토랑·카페로 저녁 시간 활기. 현지인 선호 해변.',color:'#38bdf8'},
  {id:'semaphore',lat:-34.8391,lng:138.4800,type:'dot',name:'Semaphore Beach',sub:'City of Port Adelaide Enfield',desc:'빈티지한 분위기의 북부 해변. 클래식 극장·놀이공원·카페 거리. 여름 주말 마켓.',color:'#f87171'},
  // 와인·근교 명소
  {id:'mclaren',lat:-35.2196,lng:138.5430,type:'wine',name:'McLaren Vale',sub:'City of Onkaparinga · CBD 남쪽 약 40km',desc:'Barossa와 쌍벽을 이루는 와인 산지. 쉬라즈·그르나슈 명산지. d\'Arenberg Cube 등 개성 있는 와이너리. 해변(Port Willunga)과 가까워 당일치기 코스로 인기.',color:'#9f1239'},
  {id:'hahndorf',lat:-35.0298,lng:138.8088,type:'wine',name:'Hahndorf',sub:'Adelaide Hills · CBD 동남쪽 약 25km',desc:'1839년 독일 이민자들이 세운 호주에서 가장 오래된 독일 마을. 독일식 펍·수제 소시지·공예품 거리. Adelaide Hills 와인산지 관문. 근교 여행 1순위.',color:'#b45309'},
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
  [-34.925,138.600,'cbd',17],
  [-34.882,138.598,'inner',14],
  [-34.945,138.655,'easthill',16],
  [-35.010,138.630,'easthill',13],
  [-34.960,138.505,'coastal',15],
  [-34.845,138.500,'north',12],
  [-34.700,138.660,'north',15],
  [-34.825,138.700,'central',12],
  [-35.150,138.510,'south',15],
];

const I18N = {
  ko:{
    docTitle:'Adelaide 지역 가이드', title:'Adelaide 가이드', langBtn:'🇦🇺',
    searchPh:'서버브·학교·마트·역 검색', searchNone:'검색 결과 없음', searchCouncil:'카운실', searchSuburb:'서버브',
    lblCat:'카테고리', lblOverlay:'오버레이', lblColor:'지도 색상', filterAll:'전체',
    layers:{suburb:'서버브 경계',transit:'대중교통',schools:'학교',hospitals:'병원',marts:'마트',shopping:'쇼핑'},
    colorModes:{category:'카테고리',rent:'렌트',crime:'치안'},
    schoolTypes:{p:'초등학교',s:'중·고등학교',u:'대학교',c:'칼리지·TAFE',o:'기타'},
    hospTypes:{pub:'공공병원',pri:'사립병원'},
    martTypes:{big:'대형마트',local:'지역마트',intl:'국가별 식료품점',liq:'주류 (보틀숍)'},
    origins:{kr:'한국',in:'인도',cn:'중국',jp:'일본',vn:'베트남',lk:'스리랑카',af:'아프가니스탄',halal:'할랄',latam:'라틴',med:'지중해',asia:'아시안'},
    train:'기차', tram:'트램', bus:'버스 간선',
    rentUnit:'주간 호가', crimeUnit:'1천명당·연', low:'낮음', high:'높음',
    crimeNote:'인구 1천명당 신고 건수(2025-26 연환산). CBD·상업지구는 유동인구·상업범죄로 높게 나타나며 거주 위험도와 다름.',
    rentNote:'LGA별 대표 우편번호의 유닛~주택 주간 중위 호가 범위(SQM Research, 2026-07). 실제 계약가는 매물·상태에 따라 다름.',
    legTitle:'카테고리', partly:(n)=>`일부 ${n} 관할`,
    pop:(p)=>`인구 ${p}`,
    chipRent:(lo,hi)=>`렌트 주 $${lo}~${hi}`, chipSchools:(n)=>`학교 ${n}곳`,
    chipStations:(n)=>`기차·트램역 ${n}곳`, chipBus:'버스 중심', chipSafety:(r)=>`치안 ${r}/18위`,
    barRent:'렌트', barSafety:'치안', barTransit:'교통', barSchools:'학교',
    barRentVal:(lo,hi)=>`$${lo}~${hi}`, barSafetyVal:(r)=>`${r}/18위`,
    barStVal:(n)=>n>0?`역 ${n}곳`:'버스 중심', barSchVal:(n)=>`${n}곳`,
    fbOpen:'피드백 남기기', fbTitle:'피드백 남기기',
    fbSub:'정보 정정, 꿀팁, 질문 모두 환영합니다 — 남겨주신 내용은 지도 제작자에게 메일로 전달되며, 검토 후 가이드에 반영됩니다.',
    lblAuthor:'닉네임 (선택)', phAuthor:'익명 가능', lblType:'유형',
    types:{tip:'💡 꿀팁',correction:'🔧 정정',experience:'✨ 경험담',question:'❓ 질문'},
    lblArea:'관련 지역', optNone:'전체/없음', lblBody:'내용', phBody:'자유롭게 남겨주세요...', btnSend:'보내기',
    stEmpty:'내용을 입력해주세요.', stLong:'2,000자 이내로 줄여주세요.', stWait:'잠시 후 다시 시도해주세요.',
    stSending:'전송 중...', stOk:'✅ 전송되었습니다. 소중한 의견 감사합니다!', stFail:'전송 실패 — 잠시 후 다시 시도해주세요.',
    hint:'지도의 지역을 클릭하면 상세 정보가 표시됩니다',
    vibes:['CBD·유흥','힙스터·빈티지','올드머니·leafy','학군·자연','바닷가 라이프','항구·젠트리 진행 중','저렴한 신도시','조용한 쇼핑 교외','와인·서핑 남부'],
    sources:'렌트: SQM Research 주간 호가(2026-07) · 치안: SA Police 2025-26 · 학교·교통·경계: OpenStreetMap · 타일: CARTO · 마지막 검증 2026-07-06',
  },
  en:{
    docTitle:'Adelaide Area Guide', title:'Adelaide Guide', langBtn:'🇰🇷',
    searchPh:'Search suburbs, schools, shops, stations', searchNone:'No results', searchCouncil:'Council', searchSuburb:'Suburb',
    lblCat:'Category', lblOverlay:'Overlays', lblColor:'Map colour', filterAll:'All',
    layers:{suburb:'Suburbs',transit:'Public transport',schools:'Schools',hospitals:'Hospitals',marts:'Groceries',shopping:'Shopping'},
    colorModes:{category:'Category',rent:'Rent',crime:'Safety'},
    schoolTypes:{p:'Primary',s:'Secondary',u:'University',c:'College·TAFE',o:'Other'},
    hospTypes:{pub:'Public',pri:'Private'},
    martTypes:{big:'Major chain',local:'Local chain',intl:'International grocers',liq:'Bottle shops'},
    origins:{kr:'Korean',in:'Indian',cn:'Chinese',jp:'Japanese',vn:'Vietnamese',lk:'Sri Lankan',af:'Afghan',halal:'Halal',latam:'Latin American',med:'Mediterranean',asia:'Asian'},
    train:'Train', tram:'Tram', bus:'Trunk buses',
    rentUnit:'weekly asking', crimeUnit:'per 1k/yr', low:'Low', high:'High',
    crimeNote:'Reported offences per 1,000 residents (2025-26 annualised). CBD/commercial areas read high due to non-resident activity — not a measure of residential risk.',
    rentNote:'Median weekly asking range (unit–house) for a representative postcode per LGA (SQM Research, Jul 2026). Actual rents vary by listing.',
    legTitle:'Category', partly:(n)=>`partly ${n}`,
    pop:(p)=>`pop. ${p}`,
    chipRent:(lo,hi)=>`Rent $${lo}–${hi}/wk`, chipSchools:(n)=>`${n} schools`,
    chipStations:(n)=>`${n} stations`, chipBus:'Bus-served', chipSafety:(r)=>`Safety #${r} of 18`,
    barRent:'Rent', barSafety:'Safety', barTransit:'Transit', barSchools:'Schools',
    barRentVal:(lo,hi)=>`$${lo}–${hi}`, barSafetyVal:(r)=>`#${r}/18`,
    barStVal:(n)=>n>0?`${n} stations`:'Bus-served', barSchVal:(n)=>`${n}`,
    fbOpen:'Send feedback', fbTitle:'Send feedback',
    fbSub:'Corrections, tips and questions all welcome — your message is emailed to the maintainer and reflected in the guide after review.',
    lblAuthor:'Nickname (optional)', phAuthor:'Anonymous is fine', lblType:'Type',
    types:{tip:'💡 Tip',correction:'🔧 Correction',experience:'✨ Experience',question:'❓ Question'},
    lblArea:'Related area', optNone:'All / None', lblBody:'Message', phBody:'Write freely...', btnSend:'Send',
    stEmpty:'Please enter a message.', stLong:'Please keep it under 2,000 characters.', stWait:'Please wait a moment and try again.',
    stSending:'Sending...', stOk:'✅ Sent — thank you for your feedback!', stFail:'Failed to send — please try again shortly.',
    hint:'Click a district on the map for details',
    vibes:['CBD · nightlife','hipster · vintage','old money · leafy','schools · nature','beach life','port · gentrifying','affordable new suburbs','quiet suburbia','wine & surf south'],
    sources:'Rent: SQM Research weekly asking (Jul 2026) · Safety: SA Police 2025-26 · Schools, transport & boundaries: OpenStreetMap · Tiles: CARTO · Last verified 6 Jul 2026',
  },
};
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
  const choro=mapColorMode!=='category'; // 렌트/치안 모드는 진하게 채워야 높낮이가 읽힘
  const fillBase=choro?0.52:0.18, fillDim=choro?0.14:0.03, fillSel=choro?0.72:0.5, fillOther=choro?0.12:0.05;
  Object.entries(lgaLayers).forEach(([id,layer])=>{
    const c=lgaColor(id);
    if(id===selectedLgaId){layer.setStyle({color:'#fff',weight:3,opacity:1,fillColor:c,fillOpacity:fillSel});layer.bringToFront();}
    else if(selectedLgaId){layer.setStyle({color:c,weight:1,opacity:0.25,fillColor:c,fillOpacity:fillOther});}
    else{
      const dim=activeCat!=='all'&&LGAS[id].cat!==activeCat;
      layer.setStyle({color:choro?'#0c0f14':c,weight:choro?1:1.8,opacity:dim?0.2:0.9,fillColor:c,fillOpacity:dim?fillDim:fillBase});
    }
  });
  renderMiniLegend();
}

const lgaLayers={};
Object.entries(LGA_BOUNDARIES).forEach(([id,geom])=>{
  if(!LGAS[id])return;
  const layer=L.geoJSON({type:'Feature',properties:{},geometry:geom},{
    style:{color:lgaColor(id),weight:1.8,opacity:0.9,fillColor:lgaColor(id),fillOpacity:0.18},
  }).addTo(map);
  layer.on('click',(e)=>{L.DomEvent.stopPropagation(e);deselectSuburb();openSheet(id);});
  layer.on('mouseover',()=>{if(selectedLgaId)return;layer.setStyle({fillOpacity:mapColorMode==='category'?0.32:0.68,weight:2.5,color:mapColorMode==='category'?undefined:'#8890a8'});});
  layer.on('mouseout',()=>{if(selectedLgaId)return;restyleAll();});
  lgaLayers[id]=layer;
});
map.on('click',()=>{deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();});

// ═══════════════ 바텀시트 ═══════════════
let detailOn=true; // 상세는 기본 펼침
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

  document.getElementById('bs-detail').classList.toggle('off',!detailOn);
  document.getElementById('bs-collapse').textContent=detailOn?'▾':'▴';
  document.getElementById('bottom-sheet').classList.add('on');
  document.body.classList.add('sheet-on');
}
function closeSheet(){document.getElementById('bottom-sheet').classList.remove('on');document.body.classList.remove('sheet-on');}
document.getElementById('bs-close').addEventListener('click',()=>{deselectSuburb();selectedLgaId=null;closeSheet();restyleAll();});
document.getElementById('bs-collapse').addEventListener('click',()=>{
  detailOn=!detailOn;
  document.getElementById('bs-detail').classList.toggle('off',!detailOn);
  document.getElementById('bs-collapse').textContent=detailOn?'▾':'▴';
});

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

// ═══════════════ 대중교통 레이어 (SVG — 클릭 통과) ═══════════════
map.createPane('transitPane');map.getPane('transitPane').style.zIndex=460;
const TRANSIT_COLOR={train:'#22d3ee',tram:'#f59e0b',bus:'#94a3b8'};
const TRANSIT_BASE_OP={train:0.9,tram:0.9,bus:0.55};
let transitLayer=null,transitOn=false;
let transitMarkers={train:[],tram:[],bus:[]},transitFilter=null;
function applyTransitFilter(){
  Object.entries(transitMarkers).forEach(([t,arr])=>{
    const on=(!transitFilter||transitFilter===t);
    const op=transitFilter===t?0.9:(TRANSIT_BASE_OP[t]||0.9); // 격리 시 또렷하게
    arr.forEach(m=>m.setStyle({opacity:on?op:0.12,fillOpacity:on?1:0.12}));
  });
}
function setTransitFilter(t){transitFilter=(transitFilter===t)?null:t;applyTransitFilter();renderMiniLegend();}
function buildTransitLayer(){
  transitLayer=L.layerGroup();
  transitMarkers={train:[],tram:[],bus:[]};transitFilter=null;
  // 버스 간선(Go Zone 코리도 대표 8노선) — 노선당 멀티폴리라인 1개, 얇고 흐리게
  BUS_TRUNK.forEach(rt=>{
    const pl=L.polyline(rt.segs,{pane:'transitPane',color:TRANSIT_COLOR.bus,weight:1.4,opacity:TRANSIT_BASE_OP.bus,lineCap:'round',lineJoin:'round',interactive:false});
    transitMarkers.bus.push(pl);pl.addTo(transitLayer);
  });
  TRANSIT.lines.forEach(l=>{
    const pl=L.polyline(l.c,{pane:'transitPane',color:TRANSIT_COLOR[l.t],weight:l.t==='train'?2.6:2,opacity:0.9,lineCap:'round',lineJoin:'round',interactive:false});
    (transitMarkers[l.t]||transitMarkers.train).push(pl);pl.addTo(transitLayer);
  });
  TRANSIT.stations.forEach(s=>{
    const isTram=s.t==='tram';
    const mk=L.circleMarker(s.ll,{pane:'transitPane',radius:isTram?2.8:3.6,color:'#0c0f14',weight:1,fillColor:TRANSIT_COLOR[s.t],fillOpacity:1})
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
const SCHOOL_COLOR={p:'#22c55e',s:'#3b82f6',u:'#ec4899',c:'#f59e0b',o:'#9ca3af'};
function uniPopupHtml(u){
  const d=(LANG==='en'&&u.en)?u.en:u;
  return `<div class="popup-inner"><div class="popup-name">${u.n}</div><div class="popup-sub">${d.sub}</div><div class="popup-desc">${d.desc}</div></div>`;
}
let schoolLayer=null,schoolOn=false;
let schoolMarkers={p:[],s:[],u:[],c:[],o:[]},schoolFilter=null;
function applySchoolFilter(){
  Object.entries(schoolMarkers).forEach(([t,arr])=>{
    const on=(!schoolFilter||schoolFilter===t);
    arr.forEach(mk=>mk.setStyle({opacity:on?1:0.12,fillOpacity:on?1:0.12}));
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
    const mk=L.circleMarker(s.ll,{pane:'schoolPane',radius:4.4,color:'#0c0f14',weight:1.3,fillColor:SCHOOL_COLOR[s.t]||SCHOOL_COLOR.o,fillOpacity:1})
      .bindTooltip(`${s.n}<br><span style="font-size:9px;color:#8890a8">${T().schoolTypes[s.t]}</span>`,{direction:'top',className:'sub-tip',opacity:1})
      .bindPopup(schoolPopupHtml(s),{maxWidth:240});
    (schoolMarkers[s.t]||schoolMarkers.o).push(mk);
    mk.addTo(schoolLayer);
  });
  CURATED_UNIS.forEach(u=>{
    const mk=L.circleMarker(u.ll,{pane:'schoolPane',radius:4.4,color:'#0c0f14',weight:1.3,fillColor:SCHOOL_COLOR.u,fillOpacity:1})
      .bindTooltip(`${u.n}<br><span style="font-size:9px;color:#8890a8">${T().schoolTypes.u}</span>`,{direction:'top',className:'sub-tip',opacity:1})
      .bindPopup(uniPopupHtml(u),{maxWidth:240});
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
const HOSP_COLOR={pub:'#ef4444',pri:'#fb7185'};
let hospitalLayer=null,hospitalOn=false;
let hospitalMarkers={pub:[],pri:[]},hospitalFilter=null;
function applyHospitalFilter(){
  Object.entries(hospitalMarkers).forEach(([t,arr])=>{
    const on=(!hospitalFilter||hospitalFilter===t);
    arr.forEach(m=>m.setStyle({opacity:on?1:0.12,fillOpacity:on?1:0.12}));
  });
}
function setHospitalFilter(t){hospitalFilter=(hospitalFilter===t)?null:t;applyHospitalFilter();renderMiniLegend();}
function hospPopupHtml(h){
  const desc=(LANG==='en'&&h.en)?h.en:h.desc;
  return `<div class="popup-inner"><div class="popup-name">${h.n}</div><div class="popup-sub">${T().hospTypes[h.t]}</div><div class="popup-desc">${desc}</div></div>`;
}
function buildHospitalLayer(){
  hospitalLayer=L.layerGroup();
  hospitalMarkers={pub:[],pri:[]};hospitalFilter=null;
  HOSPITALS.forEach(h=>{
    const mk=L.circleMarker(h.ll,{pane:'hospPane',radius:5,color:'#fff',weight:1.4,fillColor:HOSP_COLOR[h.t],fillOpacity:1})
      .bindTooltip(`${h.n}<br><span style="font-size:9px;color:#8890a8">${T().hospTypes[h.t]}</span>`,{direction:'top',className:'sub-tip',opacity:1})
      .bindPopup(hospPopupHtml(h),{maxWidth:240});
    (hospitalMarkers[h.t]||hospitalMarkers.pub).push(mk);mk.addTo(hospitalLayer);
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
const MART_COLOR={big:'#0ea5e9',local:'#14b8a6',intl:'#f43f5e',liq:'#eab308'};
const MART_R={intl:5};
let martLayer=null,martOn=false;
let martMarkers={big:[],local:[],intl:[],liq:[]},martFilter=null;
function applyMartFilter(){
  Object.entries(martMarkers).forEach(([t,arr])=>{
    const on=(!martFilter||martFilter===t);
    arr.forEach(m=>m.setStyle({opacity:on?1:0.12,fillOpacity:on?1:0.12}));
  });
}
function setMartFilter(t){martFilter=(martFilter===t)?null:t;applyMartFilter();renderMiniLegend();}
function buildMartLayer(){
  martLayer=L.layerGroup();
  martMarkers={big:[],local:[],intl:[],liq:[]};martFilter=null;
  MARTS.forEach(m=>{
    const lab=(m.t==='intl'&&m.o&&T().origins[m.o])?`${T().martTypes.intl} · ${T().origins[m.o]}`:T().martTypes[m.t];
    const mk=L.circleMarker(m.ll,{pane:'martPane',radius:MART_R[m.t]||3.6,color:'#0c0f14',weight:1.2,fillColor:MART_COLOR[m.t]||MART_COLOR.big,fillOpacity:1})
      .bindTooltip(`${m.n}<br><span style="font-size:9px;color:#8890a8">${lab}</span>`,{direction:'top',className:'sub-tip',opacity:1})
      .bindPopup(`<div class="popup-inner"><div class="popup-name">${m.n}</div><div class="popup-sub">${lab}</div></div>`,{maxWidth:220});
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
const SHOP_COLOR='#a855f7';
let shopLayer=null,shopOn=false;
function shopPopupHtml(s){
  const d=(LANG==='en'&&s.en)?s.en:s;
  return `<div class="popup-inner"><div class="popup-name">${s.n}</div><div class="popup-sub">${d.sub}</div><div class="popup-desc">${d.desc}</div></div>`;
}
function buildShopLayer(){
  shopLayer=L.layerGroup();
  MALLS.forEach(s=>{
    const sub=((LANG==='en'&&s.en)?s.en:s).sub;
    L.circleMarker(s.ll,{pane:'shopPane',radius:5,color:'#fff',weight:1.4,fillColor:SHOP_COLOR,fillOpacity:1})
      .bindTooltip(`${s.n}<br><span style="font-size:9px;color:#8890a8">${sub}</span>`,{direction:'top',className:'sub-tip',opacity:1})
      .bindPopup(shopPopupHtml(s),{maxWidth:220}).addTo(shopLayer);
  });
}
function setShopLayer(on){
  shopOn=on;
  if(on){if(!shopLayer)buildShopLayer();shopLayer.addTo(map);}
  else if(shopLayer){map.removeLayer(shopLayer);}
  renderMiniLegend();syncOverlayRows();
}

// ═══════════════ 랜드마크 마커 ═══════════════
const markerRefs=[];
function markerPopupHtml(m){
  return `<div class="popup-inner"><div class="popup-name">${m.name}</div><div class="popup-sub">${markerField(m,'sub')}</div><div class="popup-desc">${markerField(m,'desc')}</div></div>`;
}
MARKERS.forEach(m=>{
  const isUni=m.type==='uni',isWine=m.type==='wine';
  const icon=L.divIcon({
    html:isUni?`<div class="uni-pulse"></div>`:isWine
      ?`<div style="width:14px;height:14px;background:${m.color};transform:rotate(45deg);border:2px solid rgba(255,255,255,0.85);box-shadow:0 2px 8px rgba(0,0,0,0.55);"></div>`
      :`<div style="width:10px;height:10px;background:${m.color};border-radius:50%;border:2px solid rgba(255,255,255,0.8);box-shadow:0 2px 8px rgba(0,0,0,0.5);"></div>`,
    className:'',iconSize:[isUni?15:isWine?14:10,isUni?15:isWine?14:10],iconAnchor:[isUni?7.5:isWine?7:5,isUni?7.5:isWine?7:5]
  });
  const mkr=L.marker([m.lat,m.lng],{icon}).addTo(map);
  mkr.bindPopup(markerPopupHtml(m),{maxWidth:260});
  markerRefs.push({m,mkr});
});
function rebindMarkerPopups(){markerRefs.forEach(({m,mkr})=>{const p=mkr.getPopup();if(p)p.setContent(markerPopupHtml(m));});}

// ═══════════════ 바이브 라벨 (줌 ≤ 11) ═══════════════
let vibeMarkers=[];
function buildVibes(){
  vibeMarkers.forEach(mk=>map.removeLayer(mk));
  vibeMarkers=[];
  VIBES.forEach(([lat,lng,cat,size],i)=>{
    const c=CAT_META[cat].color;
    const icon=L.divIcon({html:`<div class="vibe-label" style="color:${c};font-size:${size}px">${T().vibes[i]}</div>`,className:'',iconSize:[0,0]});
    vibeMarkers.push(L.marker([lat,lng],{icon,interactive:false}));
  });
  syncVibes();
}
function syncVibes(){
  const show=map.getZoom()<=11;
  vibeMarkers.forEach(mk=>{if(show){mk.addTo(map);}else{map.removeLayer(mk);}});
}
map.on('zoomend',syncVibes);

// ═══════════════ 좌측 패널 ═══════════════
function renderChips(){
  ['cat-chips','m-chips'].forEach(cid=>{
    const el=document.getElementById(cid);if(!el)return;
    el.innerHTML='';
    const mk=(key,label)=>{
      const c=document.createElement('span');
      c.className='chip'+(activeCat===key?' on':'');c.textContent=label;
      c.onclick=()=>{activeCat=key;deselectSuburb();selectedLgaId=null;closeSheet();renderChips();restyleAll();};
      el.appendChild(c);
    };
    mk('all',T().filterAll);
    Object.entries(CAT_META).forEach(([k,cm])=>mk(k,catLabel(cm)));
  });
}
const OVERLAYS=[
  {id:'suburb',color:'#dde1ec',swatch:'dash',get:()=>suburbOn,set:setSuburbLayer},
  {id:'transit',color:'#22d3ee',swatch:'solid',get:()=>transitOn,set:setTransitLayer},
  {id:'schools',color:'#22c55e',swatch:'dot',get:()=>schoolOn,set:setSchoolLayer},
  {id:'hospitals',color:'#ef4444',swatch:'dot',get:()=>hospitalOn,set:setHospitalLayer},
  {id:'marts',color:'#0ea5e9',swatch:'dot',get:()=>martOn,set:setMartLayer},
  {id:'shopping',color:'#a855f7',swatch:'dot',get:()=>shopOn,set:setShopLayer},
];
function renderOverlayRows(){
  ['ov-rows','m-ov-rows'].forEach(cid=>{
    const el=document.getElementById(cid);if(!el)return;
    el.innerHTML=OVERLAYS.map(o=>
      `<div class="ov-row${o.get()?' on':''}" data-ov="${o.id}" style="--ac:${o.color}">
        <span class="ov-check"></span><span class="ov-label">${T().layers[o.id]}</span>
        <span class="ov-swatch ${o.swatch}" style="border-top-color:${o.color};${o.swatch==='dot'?`background:${o.color}`:''}"></span>
      </div>`).join('');
    el.querySelectorAll('.ov-row').forEach(row=>{
      row.addEventListener('click',()=>{
        const def=OVERLAYS.find(x=>x.id===row.dataset.ov);
        def.set(!def.get());
      });
    });
  });
}
function syncOverlayRows(){
  document.querySelectorAll('.ov-row[data-ov]').forEach(row=>{
    const def=OVERLAYS.find(x=>x.id===row.dataset.ov);
    if(def)row.classList.toggle('on',def.get());
  });
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
  HOSPITALS.forEach(h=>push({kind:'hosp',st:h.t,n:h.n,ll:h.ll}));
  MARTS.forEach(m=>push({kind:'mart',st:m.t,o:m.o,n:m.n,ll:m.ll}));
  MALLS.forEach(m=>push({kind:'mall',n:m.n,ll:m.ll}));
  TRANSIT.stations.forEach(s=>push({kind:'station',st:s.t,n:s.n,ll:s.ll}));
  MARKERS.forEach(m=>push({kind:'poi',n:m.name,ll:[m.lat,m.lng]}));
  return POIS;
}
function poiMeta(p){
  const t=T();let lab;
  if(p.kind==='school')lab=t.schoolTypes[p.st]||t.layers.schools;
  else if(p.kind==='hosp')lab=t.hospTypes[p.st];
  else if(p.kind==='mart')lab=(p.st==='intl'&&p.o&&t.origins[p.o])?`${t.martTypes.intl} · ${t.origins[p.o]}`:t.martTypes[p.st];
  else if(p.kind==='mall')lab=t.layers.shopping;
  else if(p.kind==='station')lab=LANG==='en'?(p.st==='tram'?'Tram stop':'Train station'):(p.st==='tram'?'트램역':'기차역');
  else lab=LANG==='en'?'Landmark':'명소';
  return p.sub?`${lab} · ${p.sub}`:lab;
}
function poiColor(p){
  if(p.kind==='school')return SCHOOL_COLOR[p.st]||SCHOOL_COLOR.o;
  if(p.kind==='hosp')return HOSP_COLOR[p.st]||HOSP_COLOR.pub;
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
  else if(p.kind==='mall'&&!shopOn)setShopLayer(true);
  else if(p.kind==='station'&&!transitOn)setTransitLayer(true);
  map.setView(p.ll,ZOOM_POI);
  if(p.kind==='poi'){
    const r=markerRefs.find(x=>x.m.name===p.n);
    if(r)r.mkr.openPopup();
    return;
  }
  const lay={school:()=>schoolLayer,hosp:()=>hospitalLayer,mart:()=>martLayer,mall:()=>shopLayer}[p.kind];
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
    if(n.startsWith(q))starts.push({type:'poi',pi});
    else if(n.includes(q))contains.push({type:'poi',pi});
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
  }else{
    html+=`<div class="ml-title">${t.legTitle}</div>`+Object.values(CAT_META).map(cm=>`<div class="ml-item"><span class="ml-dot" style="background:${cm.color}"></span>${catLabel(cm)}</div>`).join('');
  }
  if(transitOn){
    html+=`<div class="ml-title" style="margin-top:7px">${t.layers.transit}</div>`+
      [['train',t.train],['tram',t.tram],['bus',t.bus]].map(([k,lab])=>`<div class="ml-item ml-click${transitFilter&&transitFilter!==k?' dim':''}" data-tr="${k}"><span class="ml-dot" style="background:${TRANSIT_COLOR[k]}"></span>${lab}</div>`).join('');
  }
  if(schoolOn){
    html+=`<div class="ml-title" style="margin-top:7px">${t.layers.schools}</div>`+
      ['p','s','u','c','o'].map(k=>`<div class="ml-item ml-click${schoolFilter&&schoolFilter!==k?' dim':''}" data-sch="${k}"><span class="ml-dot" style="background:${SCHOOL_COLOR[k]}"></span>${t.schoolTypes[k]}</div>`).join('');
  }
  if(hospitalOn){
    html+=`<div class="ml-title" style="margin-top:7px">${t.layers.hospitals}</div>`+
      ['pub','pri'].map(k=>`<div class="ml-item ml-click${hospitalFilter&&hospitalFilter!==k?' dim':''}" data-hos="${k}"><span class="ml-dot" style="background:${HOSP_COLOR[k]}"></span>${t.hospTypes[k]}</div>`).join('');
  }
  if(martOn){
    html+=`<div class="ml-title" style="margin-top:7px">${t.layers.marts}</div>`+
      ['big','local','intl','liq'].map(k=>`<div class="ml-item ml-click${martFilter&&martFilter!==k?' dim':''}" data-mart="${k}"><span class="ml-dot" style="background:${MART_COLOR[k]}"></span>${t.martTypes[k]}</div>`).join('');
  }
  if(shopOn){
    html+=`<div class="ml-title" style="margin-top:7px">${t.layers.shopping}</div>`+
      `<div class="ml-item"><span class="ml-dot" style="background:${SHOP_COLOR}"></span>${LANG==='en'?'Major centre':'주요 쇼핑센터'}</div>`;
  }
  el.innerHTML=html;
  el.querySelectorAll('.ml-item[data-sch]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setSchoolFilter(it.dataset.sch);}));
  el.querySelectorAll('.ml-item[data-tr]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setTransitFilter(it.dataset.tr);}));
  el.querySelectorAll('.ml-item[data-hos]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setHospitalFilter(it.dataset.hos);}));
  el.querySelectorAll('.ml-item[data-mart]').forEach(it=>it.addEventListener('click',(e)=>{e.stopPropagation();setMartFilter(it.dataset.mart);}));
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
  document.getElementById('ml-chip-label').textContent=t.legTitle;
  document.getElementById('lbl-cat').textContent=t.lblCat;
  document.getElementById('lbl-overlay').textContent=t.lblOverlay;
  document.getElementById('lbl-color').textContent=t.lblColor;
  document.getElementById('fb-open').textContent=t.fbOpen;
  document.getElementById('sp-foot').textContent=t.sources;
  renderChips();renderOverlayRows();renderColorSeg();renderMiniLegend();buildVibes();
  if(selectedLgaId)openSheet(selectedLgaId);
  // 레이어 툴팁 언어 재생성
  [['suburb',()=>suburbLayer,(v)=>suburbLayer=v,buildSuburbLayer,()=>suburbOn],
   ['transit',()=>transitLayer,(v)=>transitLayer=v,buildTransitLayer,()=>transitOn],
   ['school',()=>schoolLayer,(v)=>schoolLayer=v,buildSchoolLayer,()=>schoolOn],
   ['hosp',()=>hospitalLayer,(v)=>hospitalLayer=v,buildHospitalLayer,()=>hospitalOn],
   ['mart',()=>martLayer,(v)=>martLayer=v,buildMartLayer,()=>martOn],
   ['shop',()=>shopLayer,(v)=>shopLayer=v,buildShopLayer,()=>shopOn]].forEach(([_,get,set,build,isOn])=>{
    if(get()){
      const wasOn=isOn();
      if(wasOn)map.removeLayer(get());
      if(_==='suburb')selectedSubPoly=null;
      set(null);
      if(wasOn){build();get().addTo(map);}
    }
  });
  rebindMarkerPopups();
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

// ═══════════════ 모바일: FAB 팝오버 & 범례 칩 ═══════════════
function closePops(){
  document.querySelectorAll('.m-pop').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.fab').forEach(f=>f.classList.remove('active'));
}
function togglePop(fabId,popId){
  const pop=document.getElementById(popId),fab=document.getElementById(fabId);
  const wasOn=pop.classList.contains('on');
  closePops();
  if(!wasOn){pop.classList.add('on');fab.classList.add('active');}
}
document.getElementById('fab-layers').addEventListener('click',(e)=>{e.stopPropagation();togglePop('fab-layers','m-pop-layers');});
document.getElementById('fab-color').addEventListener('click',(e)=>{e.stopPropagation();togglePop('fab-color','m-pop-color');});
document.getElementById('fab-fb').addEventListener('click',()=>{closePops();document.getElementById('fb-overlay').classList.add('on');});
document.querySelectorAll('.m-pop').forEach(p=>p.addEventListener('click',(e)=>e.stopPropagation()));
map.on('click',closePops);
map.on('dragstart',closePops);

document.getElementById('ml-chip').addEventListener('click',()=>{
  document.getElementById('mini-legend').classList.toggle('open');
});
// 모바일에서 펼쳐진 범례를 탭하면 닫힘
document.getElementById('mini-legend').addEventListener('click',()=>{
  if(window.matchMedia('(max-width:680px)').matches)
    document.getElementById('mini-legend').classList.remove('open');
});

// ═══════════════ INIT ═══════════════
applyLang();
setSuburbLayer(true);
restyleAll();
// 딥링크: ?lga=unley
try{
  const cm=new URLSearchParams(location.search).get('color');
  if(cm==='rent'||cm==='crime'){mapColorMode=cm;renderColorSeg();restyleAll();}
  const sel=new URLSearchParams(location.search).get('lga');
  if(sel&&LGAS[sel]){openSheet(sel);map.fitBounds(lgaLayers[sel].getBounds(),{padding:[40,40],maxZoom:ZOOM_LGA});}
  else toast(T().hint,3200);
}catch{toast(T().hint,3200);}
