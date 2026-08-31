# PROJECT STATUS

> 仓库状态一页纸。每次阶段推进/合入 main 后更新。管理规则见文末。

- 更新日期：2026-08-31（Gate U 模拟器验收完成）
- 稳定基线（main）：`faf2638`（v0.1 集成 + Y0/Y1 全部冻结成果：定位/视觉/领域模型/契约 V0.2/内容治理/种子数据）
- 已打 Tag：`v0.1.0-integration`

## Active 开发分支

| 分支 | 领先 main | 内容 | 状态 |
| --- | --- | --- | --- |
| `feature/opera` | 13 commits | OPERA UI Phase 1：五页 + Media UX + 死路由修复 + 数据密度达标 + WXSS 跨根修复 | **Gate U 模拟器验收通过**（六页全渲染，截图 E:codegate-u-screenshots；遗留：列表卡点击链路人工补验、分享菜单提示待查）→ 待人工复核后合 main + tag |
| `feature/yimeng` | 8 commits | Y2 数字档案馆 MVP：四屏 + 检索工作台 + 引用回链 | **Gate Y 档案体验验收中** → 通过后合 main + tag |

验收数据密度下限（Gate U，2026-08-31 补齐）：新闻 ≥8 ✅ / 剧目 ≥6 ✅ / 视频 ≥8 ✅ / 活动 ≥4 ✅ / 专题 ≥3 ✅（静态专题位）。

## 当前 Sprint

- **Sprint O-1「能宣传」**（feature/opera）：Media UX ✅ → 真机验收 ⬜ → H5 真实数据化 ⬜ → PC 门户 ⬜ → 专题 ⬜。KPI：一篇新闻能把用户带到整个内容生态。
- **Sprint Y-2「能沉淀」**（feature/yimeng）：史料馆/筛选/详情/引用回链 ✅ → 档案 UX 验收 ⬜ → 展馆三厅 ⬜ → 智能服务重定位 ⬜ → origin 源流页 ⬜。KPI：一份史料可以连接完整的知识关系。

## Blocked / 外部依赖

- 微信开发者工具真机验收（两分支 UI 均需导入实测，含小屏/刘海/无网/慢网/分享回跳）
- `news-media-system` 真实 API 接入（待两平台 MVP 成品级后启动）
- 媒资接入（视频 coverUrl/playUrl 接入后 UI 零改动即可点亮）

## 已知技术债

- `apps/miniapp-opera` 旧页面（works/events/artist-detail 等）仍读 `utils/mock.js` 兼容层，待迁 `utils/api.js`
- `apps/miniapp-*/utils/mock.js`（yimeng 侧）仍是内联数据，待收口 `packages/mock-data`
- npm workspaces 已声明，但无 pnpm-workspace.yaml、无 `@media/*` 跨包别名、无 CI（Phase 0.8-B）
- 无 `.gitignore`（`.mimosa/` 为本地扫描工具状态，保持未跟踪）

## 分支治理规则（2026-08-31 冻结）

1. 永久分支只有：`main` / `feature/opera` / `feature/yimeng`。main 是稳定可发布基线，不直接开发。
2. 每条产品线一个长期开发分支，阶段用 **Tag / Sprint / Commit** 表达，不再开阶段分支。
3. 临时分支仅限"连续多天的独立试验"（如 `feature/yimeng-rag-experiment`），完成即 merge 回产品线分支并删除，不长存。
4. PR 固定两条：`feature/opera → main`、`feature/yimeng → main`；commit 保持细粒度 Conventional Commits。
5. 删除分支前必须确认 `git rev-list --count main..<branch>` 为 0 或已并入目标分支。
6. **产品线分支互不合并**：`feature/opera` 与 `feature/yimeng` 不得互相 merge，共享基础能力（api-client/domain-types/mock-data/design-system）只能经 main 流转，避免跨产品线影响。
7. 里程碑合入 main 后打 Tag，命名描述里程碑而非绑定产品版本序列：`v0.2-opera-ui-phase1`、`v0.2-yimeng-archive-mvp`、后续 `v0.3-multi-channel`、`v1.0-official-platform`。
