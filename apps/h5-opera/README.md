# 沂蒙小戏小剧 H5

定位：官方宣传传播落地页（同源方案：零构建、零依赖）。

## 启动

```bash
node scripts/serve-h5.mjs          # 默认 4173 端口
node scripts/serve-h5.mjs 8080      # 自定义端口
```

浏览器访问 `http://127.0.0.1:4173/`。

## 工程结构

```
apps/h5-opera/
├── index.html            首页（头条 + 4 大栏目瀑布）
├── main.js              首页数据装配
├── styles.css           全局样式（import 共享 tokens.css）
├── runtime/
│   ├── client.js        ESM 端 api facade（与小程序 facade 同源 ESM 镜像）
│   ├── decorator.js     端无关装饰函数（formatDuration / decorateNews / ...）
│   ├── seed.js          自动同步生成：共享 mock-data ESM 转写
│   └── nav.js           公共顶栏 + 工具函数
├── shared/packages/     vendored 共享包（与小程序同源）
│   ├── design-system/tokens-opera.css
│   ├── api-client/
│   └── mock-data/
└── pages/
    ├── news/            列表 + 详情（Tab: 资讯）
    ├── works/           列表 + 详情（Tab: 剧目）
    ├── events/          列表 + 详情（Tab: 展演）
    ├── videos/          列表 + 详情（Tab: 影像）
    └── search/          全站搜索
```

## 同源方案要点

- 与小程序端共享**同一份** `packages/api-client/facade.js`（ESM 镜像在 `runtime/client.js`）
- 与小程序端共享**同一份** `packages/design-system/tokens-opera.{wxss,css}`
- 与小程序端共享**同一份** `packages/mock-data/opera.js`（自动 ESM 同步）
- 装饰层（`decorateNews` / `decorateVideo`）零依赖、纯函数

## 数据流

```
seed.js（ESM 镜像共享 mock）
   ↓
client.js（端 facade）
   ↓
runtime/nav.js（顶栏 + 工具）
   ↓
pages/*/index.js（页面装配）
```

## 同步脚本

```bash
node scripts/sync-shared.mjs     # 同步 packages → apps/*/shared/
node scripts/sync-h5-seed.mjs    # CJS mock-data → ESM seed.js
```

每次修改 `packages/mock-data/opera.js` 后跑一次 sync-h5-seed 即可。

## 当前阶段

- ✅ 5 个 Tab + 4 个详情 + 全站搜索 全部落地
- ✅ 共享 token 一致（与小程序的视觉基线对齐）
- ⏳ 接真实后端时把 `runtime/client.js` 中的 mock 替换为 `fetch` + `baseURL` 即可