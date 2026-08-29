# 沂蒙精神智能平台小程序

第一阶段目标：完成可独立演示的微信小程序体验层，通过 API Client + Mock 数据与后端解耦。

## 页面基线

- 首页
- AI 问答
- 搜索 / 搜索结果
- 知识分类
- 人物列表 / 详情
- 故事列表 / 详情
- 数字展馆
- 内容详情
- 我的

## 开发边界

页面不得直接调用 `wx.request`。所有网络访问必须通过后续统一的 API Client 层，以便从 Mock API 平滑切换到 `news-media-system` / Intelligence Plane 的真实 API。
