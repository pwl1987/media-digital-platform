# Media Digital Platform

> 多端公众体验平台（Experience Plane）
>
> 面向沂蒙文化数字传播的微信小程序、H5 与 PC Web 统一体验层。

## 当前阶段

**Product Baseline: V0.1 / Frontend-first**

当前优先完成：

1. 沂蒙精神小程序
2. 小戏小剧展演小程序
3. API Contract 与 Mock 数据
4. 后续扩展 H5 / PC Web

## 平台边界

本仓库负责：

- 用户侧体验
- 页面与交互
- 多端应用
- API Client
- Mock 数据
- Design System / Design Tokens
- 前端领域类型

本仓库不负责：

- 内容最终事实与业务控制
- 模型训练
- 生产 LLM Runtime
- 媒体处理 Runtime

对应平台：

- `media-digital-architecture`：母架构与跨系统契约
- `news-media-system`：Business Control Plane
- `YimengSpirit-Multimodal` / `yimengjingshen`：AI / Model Research

## Planned Structure

```text
apps/
├── miniapp-yimeng/
├── miniapp-opera/
├── web-yimeng/
└── web-opera/

packages/
├── api-client/
├── domain-types/
├── mock-data/
├── design-system/
└── config/

docs/
├── product/
├── api/
└── release/
```

## Development Principle

- Frontend-first, API-contract-first
- Mock API 可独立运行
- 页面不得直接耦合具体后端 URL
- 领域对象优先于页面对象
- 两个小程序视觉与体验独立，底层 API/领域类型可共享
- 真实后端接入时尽量不修改页面业务逻辑
