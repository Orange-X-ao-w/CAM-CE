# 城市与地铁 · 长沙地图（社区修改版）

> **这是非官方社区修改版，不是官方版本。** 在原项目基础上新增「长沙」地图，其余城市、功能与存档格式保持不变。
> 原作版权归 **VinsonFung** 所有，**仅限非商业使用**。不得收费游玩、出售、投放广告、接受商业赞助或用于其他商业变现；免费发布、修改或改名不构成例外。

- 原作者：**VinsonFung**
- 本游戏网站：[城市与地铁](https://city-and-metro.pages.dev)
- 原始仓库：[VinsonFung/city-and-metro](https://github.com/VinsonFung/city-and-metro)
- 原版许可：`LICENSE.txt`（Copyright © 2026 VinsonFung，保留所有权利，严禁商业使用）
- 第三方声明：`THIRD_PARTY_NOTICES.txt`、`licenses/`

发布本修改版时，请在网站醒目位置标注「社区修改版」，保留以上署名与链接，并清楚说明改动内容，不要冒充官方版本。原版及社区改版均严禁商业使用。

---

## 本次改动

| 文件 | 说明 |
| --- | --- |
| `js/geo_cs.js` | 新增长沙地理数据（水系、道路、街区、铁路、山体、行政区界、地名），格式与 `geo_*.js` 完全一致，按需异步载入 |
| `js/data_cs.js` | 新增长沙场景数据：片区与开放年份、发展阶段、人口就业中心、地标、设施、历史事件、本地任务、经营参数与城市经济 |
| `index.html` | 按现有加载顺序登记上面两个文件；页面描述标注「非官方社区修改版，仅新增长沙地图，原作者 VinsonFung」 |
| `js/screens.js` | 开始菜单底部新增一行醒目署名「社区修改版 · 非官方 — 本版仅新增长沙地图」，纯文本，不改动任何交互逻辑 |
| `js/geo-index.js` | 由 `scripts/geo-index.mjs` 重新生成，加入长沙地理索引 |
| `js/locales/en.js` | 加入长沙地图专属英文地名表（简中 / 繁中 / English 三语可用） |
| `js/sim-stamp.js`、`game-manifest.json` | 由 `scripts/verify-game.mjs --write` 依据新数据重新生成 |
| `scripts/test-v24.mjs`、`test-v25.mjs`、`test-v251.mjs`、`test-v27-fixes.mjs`、`test-v27.mjs` | 5 个回归脚本里硬编码的地图总数断言由 15 同步为 16（新增长沙），其余断言与逻辑不变 |
| `dist/` | 与源码逐字节一致的可直接部署副本，已通过 `verify-game.mjs --dist` 校验 |
| `README-Changsha-Community.md` | 本说明 |

**没有改动**任何原有城市的 `data_*.js` / `geo_*.js`，没有改动模拟、渲染、存档、UI 与地铁核心逻辑，原有地图与旧存档按原逻辑运行。运行时代码的改动只有开始菜单的一行署名文本与入口描述，不涉及游戏逻辑。长沙使用全新地图 id `cs`、`mapVersion: 1`，不与任何已有存档冲突；不注册范围扩展迁移，因此不会触发旧存档的坐标平移。

## 长沙地图内容

- **范围**：160 × 184 格（40 km × 46 km，每格 250 m），覆盖望城、岳麓山与河西、五一广场老城、长沙站、星沙、长沙南站、洋湖与暮云、黄花机场。
- **开局**：2000 年，尚无地铁；经营挑战与自由建造均可，人民币计价。
- **地形**：湘江自南向北穿城，江心橘子洲以水面内环（岛屿）表示；浏阳河、捞刀河、靳江河、圭塘河，以及梅溪湖、洋湖、年嘉湖、松雅湖等湖泊；岳麓山、谷山、黑麋峰、桃花岭、大王山等山体与风景区。
- **路网**：五一大道、芙蓉路、韶山路、万家丽路、潇湘/湘江两岸道路、二环与三环、机场高速等；橘子洲大桥、猴子石大桥、营盘路湘江隧道、福元路大桥、湘府路大桥等按年份通车。
- **铁路**：京广铁路、石长铁路、京广高速线（2009）、沪昆高速线（2014）、长株潭城际线与长沙磁浮快线（2016）。真实的长沙地铁不会自动出现，线路由玩家规划。
- **城市特色**：一江两岸（越江附加造价）、岳麓山与橘子洲（风景区不可开发）、湘江新区与梅溪湖（片区逐年开放）、内地融资制度。
- **任务**：8 项历史主题任务、3 项动态任务、2 个策略难题，以及 5 个历史发展阶段与阶段目标。

### 数据口径

地理数据是按长沙公开地理信息做的**简化建模**（用于游戏示意），不是 OpenStreetMap 原始导出，不代表精确边界；因此本图不引入 OSM 数据，也不改变原项目其他地图的 ODbL 归属说明。桥梁、隧道、车站、地铁与新区年份部分为史实参考或近似值；2000 年人口与就业分布、增长曲线、造价、票价、拨款、GDP 与 2020 年之后的发展均为**游戏估算或模拟结果**，不得作为真实长沙交通规划预测。详见游戏内「数据与说明」页。

## 运行

- **最简单**：用桌面版 Chrome / Edge / Firefox 直接打开根目录 `index.html`，无需安装依赖或构建。
- **推荐**：在本目录启动静态服务器后访问，例如 `python3 -m http.server 8000`，再打开 `http://localhost:8000/`。地理数据按需异步加载，`file://` 与 `http://` 都支持。
- 进度与设置保存在浏览器本地，无需账号；换电脑或浏览器前请先导出存档备份。

## 验证

本修改版已通过以下检查（脚本均为原项目自带，随包保留）：

- `node scripts/verify-game.mjs`：资源清单、脚本加载顺序、地理索引一致性、城市特色配置校验、许可文本一致性、所有 JS 语法检查，输出 `{"version":"2.9.4","maps":16,"files":114}`。
- `scripts/test-map-opening.mjs`、`test-map-migrations.mjs`、`test-city-balance.mjs`、`test-coastal-development.mjs`、`test-development-layer.mjs`、`test-event-operations.mjs`、`test-rail-takeover.mjs`、`test-replay.mjs`、`test-responsive-ui.mjs`、`test-save-storage.mjs`、`test-v22.mjs`、`test-v23.mjs`、`test-v25.mjs`、`test-v251.mjs`、`test-v27.mjs`、`test-v27-fixes.mjs`、`test-v27-lifecycle.mjs`、`test-web-sync.mjs` 等原有回归脚本全部通过。新增地图后，5 个脚本中硬编码的地图总数断言已由 15 同步为 16，其余断言与逻辑不变。
- 真实 Chromium 无头浏览器冒烟测试（Playwright 驱动）：页面加载无控制台报错 / 页面异常 / 资源加载失败；长沙地理数据按需异步载入成功（15 片水面、112 条道路、86 个地名）；选图卡片与缩略图正常；简中 / 繁中 / English 三语地名正确；长沙开局生成 160 × 184 城市、建三站线路并确认建设、跳月 12 个月完成结算；视图、图层、统计、任务与菜单快捷键无异常；可切回广州等原有地图，其他城市地理数据仍可载入。

两处与原项目自带测试环境有关的说明（均与长沙改动无关，已用未改动的原始仓库同环境对照确认）：

- `scripts/test-v24.mjs` 的 `generated remote connections` 断言在当前 Node 20 环境下，原始仓库同样报 `Cannot read properties of null (reading 'type')`；这是原脚本 fixture 与当前代码的既有差异。
- `scripts/test-mobile-layout.mjs` 与 `scripts/test-v27-browser.mjs` 依赖 CDP 调试端口和全局 `WebSocket`，在本沙盒无头环境会超时；在补上 `--experimental-websocket` 与浏览器启动参数后已能跑过前段断言。上面的 Playwright 冒烟测试覆盖了等价的真实浏览器路径。

如需自行复验，可在项目根目录执行：

```bash
node scripts/verify-game.mjs
node scripts/test-map-opening.mjs
node scripts/test-v27.mjs
```
