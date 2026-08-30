# AGENTS.md

本仓库的 ZCode agent 工作指引（AI 协作规则文件，地位等同 README / CONTRIBUTING）。

## 仓库定位

面向沂蒙文化数字传播的体验层（Experience Plane）：官方文化传播平台的多端实现——
微信小程序（`miniapp-yimeng` 沂蒙精神数字传承平台、`miniapp-opera` 小戏小剧官方平台）、
H5（`h5-opera`）、PC Web（`web-opera`、`web-yimeng`）与移动 App 壳（`mobile-app`），以及共享包。
当前阶段：**v0.1 集成基线**，小戏小剧产品主线见
`docs/product/OPERA_OFFICIAL_PROMOTION_PRD_V0.2.md`；沂蒙精神定位以
`docs/product/YIMENG_HERITAGE_PRD_V1.0.md` 为准（数字传承平台，AI 为能力模块，冻结前该方向暂停编码）。

本仓库只负责体验层。业务控制、模型训练、生产 LLM Runtime、媒体处理 Runtime
均属于兄弟仓库（`news-media-system`、`media-digital-architecture`、
`YimengSpirit-Multimodal` / `yimengjingshen`）——不要在本仓库中实现。

## 必读文档（唯一事实来源）

- `docs/api/API_CONTRACT_V0.2.md` —— API 契约（当前权威；V0.1 为历史版本）。修改 `packages/api-client`、transport 或任何数据代码前必读。
- `docs/product/PRODUCT_BASELINE_V0.1.md` —— 产品范围与各端功能闭环。
- `docs/domain/CONTENT_DOMAIN_V0.1.md` —— 领域模型（News / Work / Person / Organization / Event / MediaAsset / Topic 等）。
- `docs/architecture/HERITAGE_PLATFORM_BASELINE_V0.1.md`、`docs/domain/HERITAGE_DOMAIN_MODEL_V0.2.md` —— 沂蒙侧架构与领域模型权威（HeritageResource 体系）。
- `docs/engineering/SHARED_LAYER_IMPLEMENTATION_V0.1.md` —— 共享层实现基线。
- `docs/product/OPERA_CONTENT_PROPAGATION_V0.1.md`、`OPERA_MEDIA_AND_TOPIC_V0.1.md` —— 小戏小剧内容传播与媒体/专题设计。

## 目录结构

- `apps/miniapp-yimeng/`、`apps/miniapp-opera/` —— 原生微信小程序（`Page({...})`、`wx.*`），未使用跨端框架。
- `apps/h5-opera/`、`apps/web-opera/`、`apps/web-yimeng/`、`apps/mobile-app/` —— 分享传播入口、官方门户与移动壳。
- `packages/domain-types/` —— 领域类型，唯一数据模型来源。
- `packages/api-client/` —— 基于 transport 的 API Client（`index.js` 运行时入口 + `index.ts` 类型）与 mock transport（`transports/mock.js`）。
- `packages/mock-data/` —— 共享 Mock 数据集（如 `opera.js`）。
- `packages/design-system/` —— 多端设计基础（建设中）。
- `docs/` —— 产品、API、领域、工程、治理、平台文档；版本化文档具有权威性。
- `scripts/` —— 独立 Node 校验脚本。

## 项目原则（必须遵守）

1. `packages/domain-types` 是唯一数据模型来源；apps 内禁止自定义 News/Work 等类型，只能从 domain-types 导入。
2. `packages/api-client` 是唯一接口入口。
3. 页面禁止直接发起 HTTP 请求（`wx.request` / `fetch`），必须走 api-client 或 `apps/*/utils/api.js` facade。
4. Mock 只能替代 transport 层，不得在各端散落独立 Mock 定义。
5. 所有新功能必须同步更新 `docs/` 对应文档。

## 常用命令

根 `package.json` 已声明 npm workspaces（`packages/*`、`apps/*`），尚无构建步骤与 node_modules，
模块为裸 Node 可直接运行的 CommonJS。

- 冒烟检查：`node scripts/smoke-shared-client.mjs`
- 包结构校验：`npm run validate:packages`（或 `node scripts/validate-packages.mjs`）
- 资讯传播校验：`node scripts/validate-news-propagation.mjs`

以上三项在提交前必须全部通过（当前无 CI，本地即门禁）。

## AI 开发规则

修改代码前：

- 检查 architecture / engineering 文档，确认方案与基线一致。
- 检查已有 package，优先复用；不重复创建类型或接口。
- 新增端点先对齐 `API_CONTRACT_V0.2.md`，契约是权威。

提交前：

- 运行三项校验脚本（smoke / validate-packages / validate-news-propagation）。
- 提交信息使用带 scope 的 Conventional Commits，例如 `feat(api):`、`fix(mock):`、`docs:`、`test:`、`chore:`。
- 文档与面向用户的文案使用中文；代码标识符使用英文。

## 代码约定

- `packages/` 与 `scripts/` 使用 CommonJS（`require` / `module.exports`）；需要 ESM 的脚本用 `createRequire` 桥接（参考 `scripts/smoke-shared-client.mjs`）。
- 统一响应包：`{ data, meta, error }`；统一前缀 `/api/v1`；时间使用 ISO 8601；ID 与 URL 分离。
- 状态语义分离：`Content.status` = 发布状态；`Event.lifecycleStatus` = upcoming/ongoing/ended/cancelled；`MediaAsset.liveStatus` = upcoming/live/ended/offline。不要混用单一 `status` 表达不同含义。
- 两个小程序视觉与体验独立，但底层共享 api-client 与领域类型。

## 已知坑

- `apps/miniapp-*/utils/mock.js` 仍是页面内联 Mock 数据，未统一收口到 `packages/mock-data`——Phase 0.8-B 工程治理的冻结项，新代码不要再扩大这种写法。
- npm workspaces 已声明，但尚无 pnpm-workspace.yaml、无跨包别名（`@media/*`）、无 CI；跨包引用仍是相对路径。
- 尚无 `.gitignore`。`.mimosa/` 是本地安全扫描工具的状态目录，保持未跟踪，不要提交。
