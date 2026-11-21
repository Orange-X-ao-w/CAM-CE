'use strict';
// 长沙 · 2000 场景（社区增补地图）。地理来自 geo_cs.js（按长沙公开地理信息简化建模）。
// 本文件补充 2000 年起的片区开放、过江桥隧与快速路通车年份、人口就业中心、地标、重要设施、
// 历史事件、本地任务与人民币经营参数。坐标单位为格（250 m）；经纬度为近似 WGS-84，用 ll(纬度, 经度) 换算。
// 史实参考：长沙南站与武广高铁、过江桥隧、地铁与磁浮开通年份、黄花机场启用；人口、就业分布、
// 增长曲线、造价、票价、拨款与 2020 年之后的发展均为游戏估算或模拟，不得作为真实规划依据。
(function (CM) {
  const G = CM.GEOS && CM.GEOS.cs; if (!G) return;
  const P = G.proj;
  const ll = function (lat, lon) { return [+((lon - P.lon0) * P.kx).toFixed(2), +((P.lat0 - lat) * P.ky).toFixed(2)]; };
  const at = function (lat, lon, o) { const p = ll(lat, lon); return Object.assign({ x: p[0], y: p[1] }, o); };
  const anchor = function (name, lat, lon, r) { const p = ll(lat, lon); return { name: name, x: p[0], y: p[1], r: r }; };
  // 片区用显式格网多边形（景区优先列在前面，先划定的格子不会被后面的片区覆盖）
  const box = function (x0, y0, x1, y1) { return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; };
  // 与 geo_cs.js 相同的湘江中心线与宽度：沿江两岸是长沙最早成片的建成区，
  // 用两条随河道弯曲的带状片区保证 2000 年开局时两岸连成一片（否则会被「外围地区」截断）
  const RC = [[-2, 60], [10, 58.5], [30, 56.5], [50, 54.5], [70, 52.5], [80, 51.6], [90, 51.0],
    [100, 50.3], [110, 49.5], [130, 45], [150, 41], [170, 38], [185, 36]];
  const rcx = function (y) {
    if (y <= RC[0][0]) return RC[0][1];
    if (y >= RC[RC.length - 1][0]) return RC[RC.length - 1][1];
    for (let i = 0; i + 1 < RC.length; i++) {
      const a = RC[i], b = RC[i + 1];
      if (a[0] <= y && y <= b[0]) return a[1] + (b[1] - a[1]) * (y - a[0]) / (b[0] - a[0]);
    }
    return RC[RC.length - 1][1];
  };
  const rhw = function (y) { return 0.9 + 0.7 * Math.exp(-Math.pow((y - 90) / 20, 2)); };
  const bankStrip = function (sign) {
    const inner = [], outer = [];
    for (let y = -2; y <= 186; y += 4) {
      const c = rcx(y), h = rhw(y);
      inner.push([+(c + sign * (h + 0.45)).toFixed(2), y]);
      outer.push([+(c + sign * (h + 3.4)).toFixed(2), y]);
    }
    return inner.concat(outer.reverse());
  };

  const data = {
    // 城市特色（traits.js）：招牌不超过 3 项，真实城市必须声明融资制度
    traits: [
      { use: 'crossing', star: true, icon: 'bridge', label: '一江两岸', text: '湘江与橘子洲把城市分成河西与河东，越江隧道和桥梁最贵，也最有价值',
        why: '长沙长期只有橘子洲大桥等数座过江通道，2014 年地铁 2 号线才首次以隧道穿越湘江，过江一直是路网布局的关键。' },
      { use: 'scenic', label: '岳麓山与橘子洲', why: '岳麓山风景区、橘子洲景区与洋湖湿地是长沙的山水洲城名片，不能开发，线路要绕行或从地下穿过。' },
      { use: 'newDistrict', level: 'light', label: '湘江新区与梅溪湖', why: '2008 年后梅溪湖、洋湖、滨江新城与湘江新区陆续开发，河西从文教区变成新的居住与就业中心。' },
      { use: 'finance', flavor: 'cn' },
    ],
    city: '长沙', riverName: '湘江', hsrYear: 2009,
    stages: [[2004, '无地铁时代'], [2014, '跨江地铁时代'], [2020, '线网扩张期']], stageLast: '模拟未来',
    // 历史发展阶段：grow 只改变人口与岗位增长的去向（总量仍按人口曲线），corridors 为片区间出行倍数
    eras: [
      { id: 'cs-e1', from: 2000, name: '无地铁时代', tag: '史实',
        summary: '史实：2000 年的长沙还没有地铁，湘江两岸靠橘子洲大桥、银盆岭大桥与猴子石大桥连接；河东五一广场是商业中心，河西岳麓山下一带集中高校。估算：老城人口趋于饱和，新增居住主要落在雨花、开福与星沙。',
        grow: { pop: { oldcity: 0.7, yuhua: 1.3, kaifu: 1.2, xingsha: 1.3, furong: 1.1 }, jobs: { oldcity: 1.15, furong: 1.1, lugu: 1.2 } },
        demand: { decayHW: 0.92 }, corridors: [{ a: 'hexi', b: 'oldcity', f: 1.15 }] },
      { id: 'cs-e2', from: 2005, name: '跨江建设期', tag: '史实',
        summary: '史实：麓谷高新区、星沙与长沙县城快速扩张，2009 年武广高铁开通、长沙南站启用。估算：高铁新城、麓谷与星沙的岗位增长加快，河西与河东之间的通勤需求上升。',
        grow: { pop: { xingsha: 1.5, lugu: 1.3, yuhua: 1.2, meixi: 1.2, oldcity: 0.6 }, jobs: { lugu: 1.9, lito: 1.6, xingsha: 1.4, oldcity: 0.9 } },
        demand: { sc: 1.05, decayHW: 1.05 },
        corridors: [{ a: 'hexi', b: 'oldcity', f: 1.2 }, { a: 'xingsha', b: 'furong', f: 1.15 }],
        goals: [{ id: 'cs-g1', type: 'connect', months: 48, reward: 40000, title: '高铁新城接驳',
          desc: '长沙南站投入使用，旅客要进城。用地铁连接长沙南站、长沙站与五一广场。',
          anchors: [anchor('长沙南站', 28.1480, 113.0570, 3), anchor('长沙站', 28.1970, 113.0080, 3), anchor('五一广场', 28.1950, 112.9760, 3)] }] },
      { id: 'cs-e3', from: 2014, name: '跨江地铁时代', tag: '史实',
        summary: '史实：2014 年地铁 2 号线通车并穿越湘江（史实背景，本局不会自动建成）；2016 年长株潭城际与长沙磁浮快线开通，黄花机场接入轨道。估算：梅溪湖、洋湖与滨江新城成为新的居住片区，跨江通勤明显增加。',
        grow: { pop: { meixi: 1.7, yanghu: 1.6, binjiang: 1.5, wangcheng: 1.2, oldcity: 0.6 }, jobs: { meixi: 1.5, yanghu: 1.3, lito: 1.4, oldcity: 0.85 } },
        relocate: { jobs: { oldcity: 0.0004 } },
        demand: { sh: 1.05, decayHW: 1.1, hub: 1.1 },
        corridors: [{ a: 'meixi', b: 'oldcity', f: 1.2 }, { a: 'yanghu', b: 'tianxin', f: 1.15 }, { a: 'hexi', b: 'oldcity', f: 1.2 }],
        goals: [{ id: 'cs-g2', type: 'connect', months: 48, reward: 45000, title: '梅溪湖通勤',
          desc: '梅溪湖新城的居民大多在河东上班。用地铁连接梅溪湖、溁湾镇与五一广场。',
          anchors: [anchor('梅溪湖', 28.1950, 112.8880, 4), anchor('溁湾镇', 28.1970, 112.9510, 3), anchor('五一广场', 28.1950, 112.9760, 3)] }] },
      { id: 'cs-e4', from: 2020, name: '线网扩张期', tag: '史实',
        summary: '史实：地铁网络继续向星沙、望城、大王山与黄花机场方向延伸（史实背景）。估算：多中心结构形成，长距离跨区通勤增加，机场与高铁枢纽的接驳出行上升。',
        grow: { pop: { wangcheng: 1.4, xingsha: 1.3, dws: 1.2, changsha_e: 1.3, oldcity: 0.6 }, jobs: { lugu: 1.4, lito: 1.3, huanghua: 1.4, oldcity: 0.85 } },
        demand: { lz: 1.08, decayHW: 1.15, hub: 1.15 },
        corridors: [{ a: 'wangcheng', b: 'hexi', f: 1.15 }, { a: 'xingsha', b: 'furong', f: 1.2 }, { a: 'changsha_e', b: 'lito', f: 1.15 }],
        goals: [{ id: 'cs-g3', type: 'connect', months: 48, reward: 45000, title: '机场与星沙',
          desc: '黄花机场和星沙之间往来增多。用地铁连接星沙、㮾梨与黄花机场。',
          anchors: [anchor('星沙', 28.2470, 113.0800, 4), anchor('㮾梨', 28.2150, 113.1150, 3), anchor('黄花机场', 28.1890, 113.2190, 4)] }] },
      { id: 'cs-e5', from: 2024, name: '模拟未来', tag: '模拟',
        summary: '模拟：此后的发展按模型推演，不代表真实历史。估算：湘江两岸继续保持多中心，外围片区缓慢填满。',
        grow: { pop: { meixi: 1.2, yanghu: 1.2, wangcheng: 1.2, oldcity: 0.7 }, jobs: { lugu: 1.3, lito: 1.2, oldcity: 0.85 } },
        demand: { lz: 1.1, decayHW: 1.15 }, corridors: [{ a: 'hexi', b: 'oldcity', f: 1.15 }] },
    ],
    briefing: {
      lead: '2000 年的长沙还没有一公里地铁。湘江从南向北穿城而过，橘子洲静卧江心，岳麓山下的大学城与河东的五一商圈隔江相望。过江只能走橘子洲大桥、银盆岭大桥或猴子石大桥。',
      modes: [['metro', '地铁', '尚无地铁。真实的地铁 2 号线 2014 年通车，本局由你规划，真实线路不会自动出现。'],
        ['bus', '公交与轮渡', '跨江公交在高峰期堵在桥上，湘江轮渡仍是不少河西居民的日常选择。'],
        ['bridge', '过江', '橘子洲大桥（1972）、银盆岭大桥（1991）与猴子石大桥（2000）承担绝大部分过江交通。'],
        ['rail', '铁路', '长沙站承担普速铁路，京广线纵贯城东。列车本身不参与模拟，车站产生市内接驳出行；地面铁路会阻隔步行。']],
    },
    // 黄花机场在图内东部：设施自带跑道，航站楼按程序模型生成（与武汉天河机场同一套机制）
    airport: null,
    runways: [
      { a: [151.0, 86.0], b: [152.4, 101.0], from: 1989.7 },
      { a: [155.0, 87.0], b: [156.4, 100.0], from: 2017 },
    ],
    regions: [
      // 风景区与山体：先划定，不会被后面的普通片区覆盖；scenic 区域不能开发，通常也不能设站
      { id: 'yls', name: '岳麓山风景区', scenic: true, open: null, host: 'xiangxi', relief: 220, poly: box(31, 91, 44, 108) },
      { id: 'jzz', name: '橘子洲景区', scenic: true, open: null, host: 'xiangdong', poly: box(49, 78, 53, 102) },
      { id: 'hmf', name: '黑麋峰森林公园', scenic: true, open: null, host: 'xiangdong', relief: 300, poly: box(63, 8, 82, 30) },
      { id: 'gsh', name: '谷山森林公园', scenic: true, open: null, host: 'xiangxi', relief: 180, poly: box(22, 48, 36, 65) },
      { id: 'thl', name: '桃花岭景区', scenic: true, open: null, host: 'xiangxi', relief: 160, poly: box(21, 106, 33, 119) },
      { id: 'yhwt', name: '洋湖湿地', scenic: true, open: null, host: 'xiangxi', poly: box(33, 118, 44, 130) },
      { id: 'dws', name: '大王山景区', scenic: true, open: null, host: 'xiangxi', relief: 150, poly: box(28, 132, 42, 148) },
      { id: 'xww', name: '象鼻窝森林公园', scenic: true, open: null, host: 'xiangxi', relief: 140, poly: box(12, 100, 22, 114) },
      // 沿江两岸：与湘江同走向的连续建成区，2000 年即开放（风景区随这两片计算可建设范围）
      { id: 'xiangxi', name: '湘江西岸（沿江老城）', open: 2000, plan: 'mix', poly: bankStrip(-1) },
      { id: 'xiangdong', name: '湘江东岸（沿江老城）', open: 2000, plan: 'mix', poly: bankStrip(1) },
      // 2000 年已建成区
      { id: 'oldcity', name: '老城（五一广场·黄兴路·南门口）', open: 2000, plan: 'oldmix', poly: box(54, 84, 70, 102) },
      { id: 'furong', name: '芙蓉（长沙站·马王堆）', open: 2000, plan: 'mix', poly: box(70, 80, 86, 100) },
      { id: 'kaifu', name: '开福（伍家岭·北辰·月湖）', open: 2000, plan: 'resind', poly: box(56, 62, 86, 82) },
      { id: 'tianxin', name: '天心（侯家塘·东塘·南湖）', open: 2000, plan: 'mix', poly: box(54, 100, 70, 120) },
      { id: 'yuhua', name: '雨花（高桥·圭塘·红星）', open: 2000, plan: 'resind', poly: box(70, 98, 94, 124) },
      { id: 'hexi', name: '河西（溁湾镇·桐梓坡·西湖）', open: 2000, plan: 'mix', poly: box(36, 76, 49, 104) },
      // 2000 年后陆续开放的新区（年份为史实参考或游戏设定）
      { id: 'lugu', name: '麓谷高新区', open: 2003, plan: 'ind', poly: box(18, 70, 36, 90), note: '2000 年代麓谷以电子信息与工程机械产业为主' },
      { id: 'xingsha', name: '星沙（长沙县城）', open: 2004, plan: 'resind', poly: box(86, 46, 122, 80), pop: 8.0e6 },
      { id: 'binjiang', name: '滨江新城', open: 2007, plan: 'res', poly: box(38, 58, 49, 78) },
      { id: 'wangcheng', name: '望城城区', open: 2008, plan: 'res', poly: box(0, 8, 34, 50), pop: 8.4e6 },
      { id: 'meixi', name: '梅溪湖新城', open: 2009, plan: 'res', poly: box(8, 80, 30, 102), note: '梅溪湖片区 2008 年后启动开发（史实参考）' },
      { id: 'lito', name: '黎托·高铁新城', open: 2009, plan: 'mix', poly: box(80, 102, 102, 122), note: '2009 年 12 月武广高铁开通，长沙南站启用' },
      { id: 'jinxia', name: '金霞·青竹湖', open: 2010, plan: 'resind', poly: box(46, 38, 66, 60) },
      { id: 'yanghu', name: '洋湖新城', open: 2011, plan: 'res', poly: box(33, 112, 48, 132) },
      { id: 'hanpu', name: '含浦·学士', open: 2012, plan: 'res', poly: box(14, 116, 36, 150) },
      { id: 'myt', name: '大托·暮云', open: 2013, plan: 'res', poly: box(50, 130, 82, 170) },
      { id: 'changsha_e', name: '浏阳河以东（㮾梨·黄兴镇）', open: 2014, plan: 'res', poly: box(102, 80, 142, 120) },
      // 图内机场：用地不开发，但允许地下设站与地下穿越
      { id: 'huanghua', name: '黄花机场', open: null, hub: true, poly: box(144, 82, 159, 104),
        lockNote: '民用机场照常运营，用地不开发', note: '重要交通枢纽：范围内可以地下设站与地下穿越' },
    ],
    defaultRegion: { id: 'outer', name: '外围地区', open: 2012, plan: 'res', pop: 9.2e6 },
    plans: CM.DATA.plans,
    // 片区设施出现门槛的人口基准（保持 2020 年全图人口量级）
    facPopRef: 8.8e6,
    // 2000 年人口与就业中心（估算，人/km²；r 约为影响半径 km）
    centers: [
      { x: 57.3, y: 90.8, pop: 42000, jobs: 62000, r: 1.1 },   // 五一广场、黄兴路
      { x: 61.6, y: 91.7, pop: 28000, jobs: 38000, r: 1.0 },   // 芙蓉广场
      { x: 59.0, y: 96.0, pop: 32000, jobs: 22000, r: 1.1 },   // 南门口、天心阁
      { x: 69.9, y: 90.0, pop: 22000, jobs: 28000, r: 1.2 },   // 长沙站
      { x: 65.0, y: 86.0, pop: 26000, jobs: 16000, r: 1.2 },   // 烈士公园、省博物馆
      { x: 72.0, y: 95.0, pop: 30000, jobs: 20000, r: 1.3 },   // 马王堆、高桥
      { x: 66.0, y: 104.0, pop: 34000, jobs: 26000, r: 1.2 },  // 东塘、侯家塘
      { x: 76.0, y: 108.0, pop: 26000, jobs: 24000, r: 1.3 },  // 雨花亭、圭塘
      { x: 60.0, y: 78.0, pop: 24000, jobs: 15000, r: 1.2 },   // 开福寺、伍家岭
      { x: 75.0, y: 70.0, pop: 20000, jobs: 14000, r: 1.3 },   // 月湖、湖南广电
      { x: 47.5, y: 89.9, pop: 26000, jobs: 16000, r: 1.1 },   // 溁湾镇
      { x: 43.0, y: 95.5, pop: 28000, jobs: 14000, r: 1.2 },   // 湖南大学、岳麓书院
      { x: 40.0, y: 105.0, pop: 22000, jobs: 12000, r: 1.2 },  // 中南大学、麓山南路
      { x: 27.5, y: 82.0, pop: 12000, jobs: 28000, r: 1.5 },   // 麓谷高新区
      { x: 23.0, y: 91.0, pop: 6000, jobs: 6000, r: 1.4 },     // 梅溪湖（起始年）
      { x: 98.0, y: 67.8, pop: 24000, jobs: 26000, r: 1.5 },   // 星沙
      { x: 89.1, y: 111.6, pop: 5000, jobs: 12000, r: 1.3 },   // 长沙南站（起始年）
      { x: 38.0, y: 124.0, pop: 5000, jobs: 4000, r: 1.3 },    // 洋湖
      { x: 10.0, y: 30.0, pop: 8000, jobs: 6000, r: 1.5 },     // 望城城区
      { x: 152.7, y: 93.5, pop: 1000, jobs: 6000, r: 1.4 },    // 黄花机场
      { x: 60.0, y: 148.0, pop: 4000, jobs: 3000, r: 1.4 },    // 暮云、大托
    ],
    rural: { pop: 600, jobs: 150 },
    // 道路与过江桥隧通车年份（名称前缀匹配；2000 年已有的道路按所在区域开放年份出现）
    railYears: { '石长铁路': 1998, '京广高速线': 2009, '沪昆高速线': 2014, '长株潭城际线': 2016, '长沙磁浮快线': 2016 },
    roadYears: {
      '橘子洲大桥': 1972, '银盆岭大桥': 1991, '猴子石大桥': 2000, '三汊矶大桥': 2006, '营盘路湘江隧道': 2011,
      '福元路大桥': 2012, '南湖路湘江隧道': 2013, '湘府路大桥': 2015, '黑石铺大桥': 2005,
      '五一大道': 1952, '芙蓉中路': 1990, '韶山中路': 1975, '中山路': 1930, '解放中路': 1955, '人民中路': 1965,
      '劳动中路': 1980, '车站中路': 1977, '枫林一路': 1980, '桐梓坡路': 1990, '咸嘉湖路': 1995,
      '麓山南路': 1960, '金星中路': 1998, '雷锋大道': 1995, '东方红路': 2003, '望岳路': 1998,
      '麓谷大道': 2003, '潇湘中路': 1998, '湘江中路': 1990, '营盘路': 2000, '福元路': 2005,
      '南湖路': 2000, '南二环': 2005, '二环线': 2007, '三环线': 2013, '湘府中路': 2005,
      '暮云南路': 2010, '含浦大道': 2010, '三一大道': 1995, '浏阳河路': 2000, '晚报大道': 2000,
      '赤岭路': 1998, '时代阳光大道': 2008, '环保大道': 2010, '万家丽中路': 2005, '古曲路': 2006,
      '沙湾路': 2008, '星沙大道': 2002, '东六路': 2008, '黄兴大道': 2005, '机场大道': 1998,
      '机场联络线': 2016, '机场高速': 1998, '长浏高速': 2010, '绕城高速': 2010,
    },
    bridgeYears: {
      '橘子洲大桥': 1972, '猴子石大桥': 2000, '三汊矶大桥': 2006, '黑石铺大桥': 2005,
      '营盘路湘江隧道': 2011, '福元路大桥': 2012, '南湖路湘江隧道': 2013, '湘府路大桥': 2015,
    },
    bridgeDefaultYear: 2000,
    simRoads: [],
    landmarks: [
      Object.assign(at(28.1830, 112.9800), { id: 'cs_txg', name: '天心阁', w: 90, d: 70, year: 1983, kind: 'pagoda' }),
      Object.assign(at(28.1800, 112.9330), { id: 'cs_awt', name: '爱晚亭', w: 60, d: 50, year: 1792, kind: 'traditional' }),
      Object.assign(at(28.1830, 112.9370), { id: 'cs_ylsy', name: '岳麓书院', w: 240, d: 200, year: 976, kind: 'palace' }),
      Object.assign(at(28.1780, 112.9680), { id: 'cs_dfjg', name: '杜甫江阁', w: 90, d: 70, year: 2005, kind: 'pagoda' }),
      Object.assign(at(28.2220, 112.9850), { id: 'cs_kfs', name: '开福寺', w: 180, d: 180, year: 927, kind: 'temple' }),
      Object.assign(at(28.1840, 112.9410), { id: 'cs_huda', name: '湖南大学', w: 1100, d: 800, year: 1926, kind: 'campus' }),
      Object.assign(at(28.1900, 112.9390), { id: 'cs_hnsd', name: '湖南师范大学', w: 900, d: 700, year: 1938, kind: 'campus' }),
      Object.assign(at(28.1630, 112.9320), { id: 'cs_csdx', name: '中南大学', w: 1200, d: 900, year: 2000, kind: 'campus' }),
      Object.assign(at(28.1150, 112.9400), { id: 'cs_clgd', name: '长沙理工大学', w: 1000, d: 700, year: 2003, kind: 'campus' }),
      Object.assign(at(28.1800, 113.1250), { id: 'cs_hnnd', name: '湖南农业大学', w: 1100, d: 800, year: 1951, kind: 'campus' }),
      Object.assign(at(28.1970, 113.0080), { id: 'cs_cszhan', name: '长沙站', w: 420, d: 200, year: 1977, kind: 'rail' }),
      Object.assign(at(28.1480, 113.0570), { id: 'cs_csnan', name: '长沙南站', w: 700, d: 450, rot: 90, year: 2009, kind: 'rail' }),
      Object.assign(at(28.2250, 112.8700), { id: 'cs_csxi', name: '长沙西站', w: 400, d: 220, year: 2017, kind: 'rail' }),
      Object.assign(at(28.1780, 112.9820), { id: 'cs_hlty', name: '贺龙体育场', w: 320, d: 280, year: 1987, kind: 'stadium' }),
      Object.assign(at(28.2400, 113.0350), { id: 'cs_gd', name: '湖南广电中心', w: 120, d: 90, year: 1996, kind: 'tvtower', style: 'needle', h: 168 }),
      Object.assign(at(28.1930, 112.9740), { id: 'cs_ifs', name: '长沙国金中心', w: 80, d: 80, year: 2018, kind: 'skyscraper', h: 452 }),
      Object.assign(at(28.2050, 113.0050), { id: 'cs_bwg', name: '湖南博物院', w: 260, d: 200, year: 2017, kind: 'museum' }),
      Object.assign(at(28.1950, 112.8880), { id: 'cs_mxhy', name: '梅溪湖国际文化艺术中心', w: 300, d: 220, year: 2017, kind: 'concert' }),
      Object.assign(at(28.1450, 113.0450), { id: 'cs_hzzx', name: '长沙国际会展中心', w: 600, d: 380, year: 2016, kind: 'expo' }),
      Object.assign(at(28.2050, 113.0000), { id: 'cs_jnt', name: '湖南烈士公园纪念塔', w: 60, d: 60, year: 1959, kind: 'tower' }),
    ],
    // 重要设施（facility.js）：位置与启用年份为史实参考或近似，规模为游戏设定
    facilities: [
      { id: 'cs_huanghua', n: '黄花机场', t: 'air', at: ll(28.1890, 113.2190), rw: [[151.0, 86.0], [152.4, 101.0]],
        pax: [[2000, 0.3], [2005, 0.7], [2010, 1.4], [2016, 2.2], [2020, 2.6], [2030, 3.4]],
        note: '1989 年 8 月启用，位于图内东部；航站区附近设枢纽，跑道一带不开发。' },
      { id: 'cs_cszhan', n: '长沙站', t: 'rail', lm: 'cs_cszhan', pax: [[2000, 3.2], [2010, 4.5], [2020, 3.0], [2030, 3.2]] },
      { id: 'cs_csnan', n: '长沙南站', t: 'rail', lm: 'cs_csnan', y0: [2009, 12], pax: [[2010, 2.2], [2015, 6.0], [2020, 8.0], [2030, 9.5]] },
      { id: 'cs_csxi', n: '长沙西站', t: 'rail', lm: 'cs_csxi', y0: [2017, 12], pax: [[2018, 0.6], [2025, 1.6], [2030, 2.0]] },
      { id: 'cs_huda', n: '湖南大学', t: 'uni', lm: 'cs_huda', w: 0.045 },
      { id: 'cs_hnsd', n: '湖南师范大学', t: 'uni', lm: 'cs_hnsd', w: 0.035 },
      { id: 'cs_csdx', n: '中南大学', t: 'uni', lm: 'cs_csdx', w: 0.04 },
      { id: 'cs_clgd', n: '长沙理工大学', t: 'uni', lm: 'cs_clgd', w: 0.025 },
      { id: 'cs_hnnd', n: '湖南农业大学', t: 'uni', lm: 'cs_hnnd', w: 0.02 },
      { id: 'cs_hnly', n: '中南林业科技大学', t: 'uni', at: ll(28.1400, 113.0050), w: 0.018 },
      { id: 'cs_zyy', n: '湖南中医药大学', t: 'uni', at: ll(28.1250, 112.9050), y0: 2005, w: 0.014 },
      { id: 'cs_xyyy', n: '湘雅医院', t: 'hosp', at: ll(28.2120, 112.9900), w: 0.06 },
      { id: 'cs_xye', n: '湘雅二医院', t: 'hosp', at: ll(28.1850, 112.9950), w: 0.055 },
      { id: 'cs_xys', n: '湘雅三医院', t: 'hosp', at: ll(28.2100, 112.9250), w: 0.045 },
      { id: 'cs_rmyy', n: '湖南省人民医院', t: 'hosp', at: ll(28.1920, 112.9820), w: 0.045 },
      { id: 'cs_zxyy', n: '长沙市中心医院', t: 'hosp', at: ll(28.1550, 113.0000), w: 0.035 },
      { id: 'cs_hxbj', n: '黄兴路步行街', t: 'shop', at: ll(28.1910, 112.9780), p: { sh: 0.75, lz: 0.25 }, w: 0.05 },
      { id: 'cs_wyg', n: '五一广场商圈', t: 'shop', at: ll(28.1950, 112.9760), w: 0.045 },
      { id: 'cs_dtsq', n: '东塘商圈', t: 'shop', at: ll(28.1660, 112.9900), w: 0.025 },
      { id: 'cs_hx', n: '红星商圈', t: 'shop', at: ll(28.1350, 113.0050), y0: 2005, w: 0.02 },
      { id: 'cs_wjl', n: '万家丽广场', t: 'shop', at: ll(28.2050, 113.0300), y0: 2010, w: 0.025 },
      { id: 'cs_mxh', n: '梅溪湖商圈', t: 'shop', at: ll(28.1950, 112.8880), y0: 2015, w: [[2015, 0.008], [2022, 0.03]] },
      { id: 'cs_yh', n: '洋湖商圈', t: 'shop', at: ll(28.1280, 112.9490), y0: 2016, w: 0.015 },
      { id: 'cs_xssq', n: '星沙商圈', t: 'shop', at: ll(28.2470, 113.0800), y0: 2006, w: 0.018 },
      { id: 'cs_gqsc', n: '高桥大市场', t: 'shop', at: ll(28.1850, 113.0250), w: 0.022 },
      { id: 'cs_frgc', n: '芙蓉广场金融街', t: 'cbd', at: ll(28.1930, 112.9870), w: 0.02 },
      { id: 'cs_bjx', n: '湖南金融中心（滨江）', t: 'cbd', at: ll(28.2450, 112.9450), y0: 2012, w: [[2012, 0.004], [2020, 0.02]] },
      { id: 'cs_mxcbd', n: '梅溪湖商务区', t: 'cbd', at: ll(28.1980, 112.8950), y0: 2016, w: [[2016, 0.003], [2025, 0.018]] },
      { id: 'cs_gtsc', n: '高铁新城商务区', t: 'cbd', at: ll(28.1500, 113.0550), y0: 2012, w: [[2012, 0.004], [2022, 0.02]] },
      { id: 'cs_yls', n: '岳麓山', t: 'scenic', lm: 'cs_ylsy', r: 2.5, w: 0.045 },
      { id: 'cs_jzz', n: '橘子洲', t: 'scenic', at: ll(28.1960, 112.9590), r: 1.8, w: 0.04 },
      { id: 'cs_txg', n: '天心阁', t: 'scenic', lm: 'cs_txg', w: 0.012 },
      { id: 'cs_kfs', n: '开福寺', t: 'scenic', lm: 'cs_kfs', w: 0.012 },
      { id: 'cs_bwg', n: '湖南博物院', t: 'scenic', lm: 'cs_bwg', w: 0.02 },
      { id: 'cs_yhwt', n: '洋湖湿地', t: 'scenic', at: ll(28.1280, 112.9490), r: 2.0, y0: 2011, w: 0.02 },
      { id: 'cs_zwy', n: '湖南省森林植物园', t: 'park', at: ll(28.1150, 113.0100), w: 0.012 },
      { id: 'cs_lsgy', n: '湖南烈士公园', t: 'park', at: ll(28.2050, 113.0000), r: 1.8, w: 0.018 },
      { id: 'cs_xhgy', n: '西湖公园', t: 'park', at: ll(28.2050, 112.9400), w: 0.01 },
      { id: 'cs_yhgy', n: '月湖公园', t: 'park', at: ll(28.2400, 113.0200), y0: 2005, w: 0.01 },
      { id: 'cs_syh', n: '松雅湖湿地', t: 'park', at: ll(28.2580, 113.0750), y0: 2010, w: 0.012 },
      { id: 'cs_hlty', n: '贺龙体育场', t: 'stadium', lm: 'cs_hlty', w: 0.012 },
      { id: 'cs_hzzx', n: '长沙国际会展中心', t: 'venue', lm: 'cs_hzzx', w: 0.012 },
      { id: 'cs_mxhy', n: '梅溪湖国际文化艺术中心', t: 'venue', lm: 'cs_mxhy', w: 0.012 },
      { id: 'cs_gdhz', n: '湖南国际会展中心', t: 'venue', at: ll(28.2420, 113.0400), y0: 2000, w: 0.008 },
    ],
    districtLabels: [
      ['岳麓', ['岳麓区']], ['芙蓉', ['芙蓉区']], ['天心', ['天心区']], ['开福', ['开福区']],
      ['雨花', ['雨花区']], ['望城', ['望城区']], ['长沙县', ['长沙县']],
      ['河西', ['岳麓街道']], ['老城', ['坡子街街道']], ['高铁新城', ['黎托街道']],
    ],
    // 纪事（只能在末尾追加：已发生记录按序号保存）
    events: [
      { y: 2000, m: 1, tag: '史实', title: '2000 年的长沙', desc: '湘江两岸尚无地铁，橘子洲大桥、银盆岭大桥与刚通车的猴子石大桥承担过江交通；五一广场是商业中心，岳麓山下集中着高校。' },
      { y: 2001, m: 10, tag: '史实', title: '麓谷高新区加速建设', desc: '河西麓谷以电子信息、工程机械与新材料为主导，岗位快速增加。', fx: { grow: { region: 'lugu', jobs: 1.5, years: 8 } } },
      { y: 2003, m: 5, tag: '估算', title: '星沙与县城扩张', desc: '长沙县城与星沙一带形成新的居住与工业片区。', fx: { grow: { region: 'xingsha', pop: 1.3, years: 6 } } },
      { y: 2005, m: 1, tag: '史实', title: '猴子石大桥与南二环分流', desc: '城南过江通道增加，湘江两岸的通勤联系更紧密。' },
      { y: 2008, m: 6, tag: '史实', title: '梅溪湖片区启动开发', desc: '湘江西岸的梅溪湖开始按新城规划建设，后续陆续形成居住、商业与文化设施。', fx: { grow: { region: 'meixi', pop: 1.6, jobs: 1.3, years: 10 } } },
      { y: 2009, m: 12, tag: '史实', title: '武广高铁开通，长沙南站启用', desc: '长沙进入高铁时代，黎托一带成为新的交通枢纽与商务片区。', fx: { grow: { region: 'lito', jobs: 1.5, years: 8 } } },
      { y: 2011, m: 9, tag: '史实', title: '营盘路湘江隧道通车', desc: '首条穿越湘江的公路隧道，缓解橘子洲大桥的压力。' },
      { y: 2014, m: 4, tag: '史实', title: '史实背景：首条地铁通车', desc: '地铁 2 号线通车并穿越湘江。本局的地铁由你规划，真实线路不会自动出现。' },
      { y: 2015, m: 4, tag: '史实', title: '湘江新区获批', desc: '湖南湘江新区成为中部地区第一个国家级新区，河西的发展重心进一步西移。', fx: { grow: { region: 'yanghu', pop: 1.4, jobs: 1.2, years: 8 } } },
      { y: 2016, m: 12, tag: '史实', title: '长株潭城际与磁浮快线开通', desc: '长沙站、长沙南站与黄花机场之间新增轨道联系，机场接驳需求上升。', fx: { demand: { hub: 1.12, months: 6 } } },
      { y: 2017, m: 12, tag: '史实', title: '长沙西站启用', desc: '长株潭城际西端车站投入运营，河西增加一处铁路枢纽。' },
      { y: 2020, m: 1, tag: '估算', title: '疫情与出行变化', desc: '一段时期里通勤与旅游出行下降，之后逐步恢复。', fx: { demand: { hw: 0.6, sc: 0.4, sh: 0.6, lz: 0.35, hub: 0.4, months: 3, fade: 1 }, sat: { v: -1.5, months: 6 } } },
      { y: 2024, m: 1, tag: '模拟', title: '进入模拟发展阶段', desc: '此后人口、道路和区域变化按模拟规则推演，不代表真实历史。' },
    ],
    // 本地历史主题任务：参考长沙 2000 年起的发展需求，不要求复刻真实线路（奖励单位：万元，2000 年价格）
    histTasks: [
      { id: 'cs1', appear: [2000, 6], deadline: [2006, 12], type: 'connect', reward: 35000, title: '河东第一条线',
        desc: '连接长沙站、芙蓉广场、五一广场与南门口，为河东老城提供第一条轨道交通。可以考虑高架线路以节省造价。',
        anchors: [anchor('长沙站', 28.1970, 113.0080, 3), anchor('芙蓉广场', 28.1930, 112.9870, 3), anchor('五一广场', 28.1950, 112.9760, 3), anchor('南门口', 28.1820, 112.9780, 3)] },
      { id: 'cs2', appear: [2004, 1], deadline: [2014, 12], type: 'connect', reward: 70000, title: '首条过江地铁',
        desc: '连接湖南大学、溁湾镇、五一广场与长沙站。湘江段需要建设越江隧道或桥梁。',
        anchors: [anchor('湖南大学', 28.1840, 112.9410, 3), anchor('溁湾镇', 28.1970, 112.9510, 3), anchor('五一广场', 28.1950, 112.9760, 3), anchor('长沙站', 28.1970, 113.0080, 3)] },
      { id: 'cs3', appear: [2008, 1], deadline: [2016, 12], type: 'connect', reward: 50000, title: '高铁新城接驳',
        desc: '长沙南站启用后，连接长沙南站、圭塘、高桥与长沙站，把高铁旅客送进主城。',
        anchors: [anchor('长沙南站', 28.1480, 113.0570, 3), anchor('圭塘', 28.1600, 113.0350, 3), anchor('高桥', 28.1850, 113.0250, 3), anchor('长沙站', 28.1970, 113.0080, 3)] },
      { id: 'cs4', appear: [2010, 1], deadline: [2018, 12], type: 'connect', reward: 50000, title: '梅溪湖与麓谷',
        desc: '连接梅溪湖、麓谷、湖南大学与溁湾镇，服务河西的高校与新兴产业。',
        anchors: [anchor('梅溪湖', 28.1950, 112.8880, 4), anchor('麓谷', 28.2150, 112.9000, 3), anchor('湖南大学', 28.1840, 112.9410, 3), anchor('溁湾镇', 28.1970, 112.9510, 3)] },
      { id: 'cs5', appear: [2012, 1], deadline: [2020, 12], type: 'coverage', target: 0.26, reward: 60000, title: '地铁覆盖两成六人口',
        desc: '2020 年底前，步行 15 分钟可到达地铁站的人口不低于全市人口的 26%。' },
      { id: 'cs6', appear: [2014, 1], deadline: [2022, 12], type: 'connect', reward: 60000, title: '机场与磁浮接驳',
        desc: '连接长沙南站、㮾梨与黄花机场，让航空旅客能换乘地铁进城。',
        anchors: [anchor('长沙南站', 28.1480, 113.0570, 3), anchor('㮾梨', 28.2150, 113.1150, 3), anchor('黄花机场', 28.1890, 113.2190, 4)] },
      { id: 'cs7', appear: [2016, 1], deadline: [2024, 12], type: 'coverage', target: 0.42, reward: 70000, title: '地铁覆盖四成二人口',
        desc: '2024 年底前，步行 15 分钟可到达地铁站的人口不低于全市人口的 42%。' },
      { id: 'cs8', appear: [2015, 1], deadline: [2023, 12], type: 'connect', reward: 55000, title: '星沙进城',
        desc: '连接星沙、月湖公园、马王堆与芙蓉广场，把长沙县城接入主城线网。',
        anchors: [anchor('星沙', 28.2470, 113.0800, 4), anchor('月湖公园', 28.2400, 113.0200, 3), anchor('马王堆', 28.2100, 113.0200, 3), anchor('芙蓉广场', 28.1930, 112.9870, 3)] },
    ],
    dynTasks: [
      { id: 'csd1', from: [2002, 1], to: [2012, 12], type: 'connect', months: 36, reward: 38000, title: '河西过江通勤',
        desc: '每天大量通勤者往返湘江两岸。连接溁湾镇、橘子洲与五一广场。',
        anchors: [anchor('溁湾镇', 28.1970, 112.9510, 3), anchor('橘子洲', 28.1960, 112.9590, 3), anchor('五一广场', 28.1950, 112.9760, 3)] },
      { id: 'csd2', from: [2006, 1], to: [2016, 12], type: 'connect', months: 36, reward: 35000, title: '大学城与东塘',
        desc: '连接中南大学、湖南大学、侯家塘与东塘。',
        anchors: [anchor('中南大学', 28.1630, 112.9320, 3), anchor('湖南大学', 28.1840, 112.9410, 3), anchor('侯家塘', 28.1720, 112.9850, 3), anchor('东塘', 28.1660, 112.9900, 3)] },
      { id: 'csd3', from: [2010, 1], to: [2020, 12], type: 'connect', months: 36, reward: 35000, title: '洋湖与南城',
        desc: '连接洋湖湿地、省政府与红星，服务城南新居民。',
        anchors: [anchor('洋湖湿地', 28.1280, 112.9490, 3), anchor('省政府', 28.1100, 112.9950, 3), anchor('红星', 28.1350, 113.0050, 3)] },
    ],
    taskNote: '历史主题任务参考长沙 2000 年起的过江、枢纽与新区需求，不要求按真实线路走向建设，只需满足目标描述。',
    // 城市策略难题（可选挑战）
    scenarios: [
      { id: 'cs-sc1', theme: '长沙：一江两岸', title: '一张网连起两岸', type: 'budgetConnect', from: [2003, 1], to: [2016, 12], months: 72, rewardMonths: 4, budgetX: 1.25,
        anchors: [['五一广场', 3], ['溁湾镇', 3], ['湖南大学', 3]],
        desc: '湘江把城市分成东西两半，每次过江都要多花一大笔钱。用有限预算把河西高校、溁湾镇与河东商圈连进同一张网。',
        tips: ['选江面最窄处过江，隧道比高架更适合老城', '河西先接溁湾镇，再向岳麓山脚下延伸', '换乘站留在河东，之后的线路都好接'] },
      { id: 'cs-sc2', theme: '长沙：远离中心的梅溪湖', title: '把地铁修到梅溪湖', type: 'regionCov', from: [2010, 1], to: [2024, 12], months: 60, rewardMonths: 3,
        regions: ['meixi'], areaName: '梅溪湖', target: 0.45,
        desc: '梅溪湖是河西新兴的居住与商务片区，离五一商圈很远。让梅溪湖接近一半的人步行就能到地铁站。',
        tips: ['梅溪湖东侧人口最密，先在这里设站', '远距离线路站距可以拉长', '与溁湾镇的线路换乘，比单独修长线便宜'] },
    ],
    dataNote: [
      ['地理数据', 'info', '湘江与橘子洲、浏阳河、捞刀河、梅溪湖等水系，岳麓山等山体，主要道路、铁路与地名按长沙公开地理信息简化建模，用于游戏示意；不是 OpenStreetMap 原始导出，也不代表精确边界。'],
      ['史实参考', 'hist', '武广高铁与长沙南站、过江桥隧、地铁与磁浮快线、长株潭城际、黄花机场启用及片区开发的年份（部分为近似）。'],
      ['估算', 'est', '2000 年人口与就业分布、人口增长曲线、出行率、时间价值、造价、票价、运营费用与拨款、地图范围 GDP。'],
      ['模拟', 'sim', '2020 年之后的发展、居民出行选择、道路拥堵、客流与财政结果。普通铁路与高速铁路不参与乘客出行与运营模拟，只模拟车站的市内接驳出行；真实的长沙地铁不会自动出现。'],
      ['社区版本', 'info', '本地图为非官方社区增补内容，原作版权归 VinsonFung 所有，仅限非商业使用；模拟结果不得作为真实长沙交通规划预测。'],
    ],
    // 线路配色参考长沙地铁
    lineColorsNice: ['#e4002b', '#0072ce', '#8dc21f', '#8e44ad', '#f6a800', '#00a8a8', '#d35400', '#c2185b', '#5c6bc0', '#7cb342', '#8d6e63', '#26a69a'],
    places: (G.places || []).map(function (p) { return [p[0], p[1], p[2], p[3]]; }),
  };

  (CM.MAP_LIST = CM.MAP_LIST || []).push({
    id: 'cs', name: '长沙', title: '长沙 · 2000', sub: '简化真实地理 · 2000 年起 · 人民币',
    desc: '从 2000 年尚无地铁的长沙开始：湘江与橘子洲把城市分成两岸，岳麓山下的大学城与五一商圈隔江相望。梅溪湖、洋湖、高铁新城与黄花机场将陆续出现，一江两岸需要你用越江线路连成一座城。',
    facts: [['范围', '40 km × 46 km'], ['起始', '2000 年'], ['人口', '约 580 万'], ['货币', '人民币（元）'], ['模式', '经营挑战 / 自由建造']],
    modes: ['challenge', 'free'], kind: 'real', mapVersion: 1, scenario: 'cs-2000',
    region: '中国内地', tagline: '一江两岸，从五一广场出发', difficulty: 2, tags: ['无地铁开局', '越江', '山水洲城'],
    intro: '2000 年的长沙没有地铁。湘江从南向北穿城而过，橘子洲静卧江心，过江只能挤上橘子洲大桥、银盆岭大桥或刚通车的猴子石大桥。你要在老城与河西之间画下第一条线，再跟着城市跨江、向东到高铁新城与黄花机场。',
    features: [['bridge', '一江两岸', '湘江与橘子洲把城市分开，越江隧道与桥梁造价更高'],
      ['map', '片区逐年开放', '梅溪湖、洋湖、星沙、高铁新城与望城按年份开放'],
      ['building', '山水洲城', '岳麓山、橘子洲与岳麓书院所在风景区不能开发'],
      ['flag', '8 项本地任务', '参考长沙 2000 年起的过江、枢纽与新区需求，不要求复刻真实线路']],
    highlights: [[2009, '长沙南站启用'], [2011, '营盘路湘江隧道通车'], [2014, '史实背景：首条过江地铁'], [2016, '磁浮快线与城际开通'], [2020, '梅溪湖与洋湖新城']],
    geo: G, data: data,
    econ: { devOffset: -6, money: 1 },   // 出行选择参数：长沙 2000 年约对应广州样本 1994 年的发展阶段
    cfg: {
      W: 160, H: 184, START: { y: 2000, m: 1, d: 1, minute: 6 * 60 },
      growth: Object.assign({}, CM.CFG.growth, {
        popCurve: [[2000, 5.80e6], [2005, 6.25e6], [2010, 7.04e6], [2015, 7.65e6], [2020, 8.80e6], [2030, 10.0e6], [2050, 11.2e6], [2300, 11.8e6]],
        histEnd: 2020, jobsRatio: [[2000, 0.45], [2005, 0.478], [2010, 0.506], [2015, 0.522], [2020, 0.535], [2040, 0.55]],
      }),
      money: { code: 'CNY', unit: '元', wan: '万元', yi: '亿元', sym: '¥' },
      econBase: 2000,
      // 造价（万元，2000 年价格；估算）：越江段附加按湘江宽度设定
      cost: Object.assign({}, CM.CFG.cost, {
        trackPerKm: { underground: 42000, surface: 7500, elevated: 14000 },
        riverPerKm: { underground: 32000, surface: 22000, elevated: 22000 },
        hillPerKm: 12000, protectedPerKm: 6500,
        station: { underground: { S: 19000, M: 30000, L: 48000 }, elevated: { S: 8500, M: 12500, L: 19000 }, surface: { S: 5500, M: 9500, L: 14000 } },
        demolishPerCell: 38000,
      }),
      ops: Object.assign({}, CM.CFG.ops, { carKmCost: 0.0011, stationDaily: { S: 1.9, M: 3.2, L: 5.6 } }),
      fareDefault: { mode: 'flat', flat: 2 }, fareRange: { min: 0, max: 10, step: 0.1, scale: true },
      economy: Object.assign({}, CM.CFG.economy, {
        startFunds: 360000, grantBase: [[2000, 18000], [2005, 32000], [2010, 65000], [2015, 100000], [2020, 125000], [2050, 175000]],
        debtLimit: -240000, rewardScale: 1.25,
      }),
      // 城市经济（macro.js）：2000 年地图范围 GDP 约 650 亿元（估算）；工程机械、传媒与消费服务比重较高
      macro: {
        area: '地图范围（湘江两岸主城区、星沙、望城与黄花机场）', region: '中国内地',
        gdp0: 6500000, revRatio: [[2000, 0.12], [2010, 0.15], [2020, 0.17], [2040, 0.16]], revElastic: 1.5,
        prod: [[2000, 0.09], [2005, 0.115], [2010, 0.12], [2014, 0.09], [2018, 0.07], [2020, 0.045], [2030, 0.03], [2050, 0.015], [2080, 0.012]],
        infl: 'cn', longRun: { infl: 0.02 }, histEnd: 2020, ref: 'cn',
        struct: { trade: 0.45, fin: 0.35, ind: 0.6, tour: 0.5, prop: 0.6 },
        events: [
          { id: 'wto2001', y: 2001, m: 12, scale: 0.7 },
          { id: 'sars2003', y: 2003, m: 4, scale: 0.3 },
          { id: 'tight2004', y: 2004, m: 4 },
          { id: 'gfc2008', y: 2008, m: 9, scale: 0.6 },
          { id: 'stim2008', y: 2008, m: 11, scale: 1.2, desc: '基建投资与湘江新区开发带动桥梁、地铁与新城建设。' },
          { id: 'cnstock2015', y: 2015, m: 6 },
          { id: 'cs2017', y: 2017, m: 4, kind: 'boom', scope: '本地', title: '新区与枢纽建设', desc: '高铁新城、梅溪湖与机场扩建集中推进。', lv: [0.002, 0.002, 0] },
          { id: 'trade2018', y: 2018, m: 7, scale: 0.7 },
          { id: 'covid2020', y: 2020, m: 1, scale: 2.2, desc: '一季度出行与消费大幅收缩，之后逐步恢复。' },
        ],
      },
    },
    cam: { cx: 57, cy: 92, zoom: 16 },
  });
})(window.CM);
