# Shared Layer Implementation V0.1

## 已落地

- `packages/domain-types/index.ts`：跨渠道领域类型
- `packages/domain-types/package.json`：包元数据
- `packages/api-client/index.js`：浏览器/移动端/小程序可复用的运行时 API Facade 基础实现
- `packages/api-client/package.json`：包元数据
- `packages/mock-data/opera.js`：小戏小剧共享 Mock 数据
- `scripts/validate-packages.mjs`：共享层轻量结构校验
- `package.json`：npm workspace 基线
- `apps/miniapp-opera/utils/api.js`：小戏小剧小程序本地 API Facade，当前实现由 Mock 提供

## 语义约束

`status` 仅表示内容发布生命周期：draft / review / approved / scheduled / published / unpublished / retracted。

活动自身的业务进行状态使用 `lifecycleStatus`：upcoming / ongoing / ended / cancelled。

直播状态使用 `liveStatus`：upcoming / live / ended / offline。

## 后续切换真实后端

小程序、H5、PC、App 不应直接依赖 `mock.js`。各渠道应通过自身薄 Facade 使用共享 API 语义；真实接入时仅替换 Transport/endpoint 配置，不修改页面领域逻辑。

## 当前验证边界

GitHub 侧已完成文件落盘与契约检查；微信开发者工具、Android Studio/Xcode 和真实后端联调仍需在可运行开发环境执行，不能由仓库静态检查替代。
