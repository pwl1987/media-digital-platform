# 小戏小剧 PC Web

官方宣传门户（Sprint O-1）。SPA-lite：单 `index.html` + query 详情路由，零构建零依赖。

## 启动

```bash
node scripts/serve-web.mjs          # 默认 4273 端口
node scripts/serve-web.mjs 8080      # 自定义端口
```

浏览器访问 `http://127.0.0.1:4273/`。

## 架构（与 H5 / 小程序同源）

```
packages/mock-data/opera.js（唯一数据源）
   ↓ scripts/sync-h5-seed.mjs（双端输出 ESM 种子）
apps/web-opera/runtime/seed.js
   ↓
runtime/client.js（ESM facade，装饰 durationLabel / sourceLevelLabel）
   ↓
src/main.js（SPA-lite：首页 + ?news=/?work=/?video=/?event=/?artist=/?organization=/?live= 详情路由）
```

- **token**：`shared/packages/design-system/tokens-opera.css`（与小程序/H5 严格同源）
- **详情路由**：7 类全支持（与 H5 分享直达参数一致）
- **传播链**：资讯→剧目/影像、剧目→场次/资讯/演员/剧团、活动→场次/剧目、演员→作品/影像、剧团→剧目/影像
- **og 分享**：站点级静态 og + SVG favicon

## 已知约定

- `<a>` 不可嵌套 `<a>`：poster-card 外层是 div，链接在海报位/标题/剧团名上（浏览器会把嵌套 a 拆裂）
- 样式由 index.html `<link>` 引入（浏览器原生 ESM 不支持 `import './style.css'`）
- 真实后端接入：把 `runtime/client.js` 的 mock 实现换成 `fetch` + `baseURL`，页面零改动

## 同步脚本

```bash
node scripts/sync-shared.mjs     # packages → apps/*/shared/
node scripts/sync-h5-seed.mjs    # CJS mock → h5-opera + web-opera 双端 ESM seed
```