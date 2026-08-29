# Product Baseline V0.1

## 1. 产品范围

本阶段交付两个微信小程序：

- 沂蒙精神智能平台
- 沂蒙小戏小剧展演平台

同时建立可复用的 API Client、领域类型、Mock 数据和设计基础，为后续 H5 / PC Web 留出统一入口。

## 2. 沂蒙精神小程序

核心能力：

- 首页内容聚合
- AI 智能问答
- 人物
- 故事
- 历史文化
- 数字展馆
- 全局搜索
- 收藏 / 浏览历史

核心演示闭环：

首页 → AI 问答 → 回答 → 参考资料 → 内容详情 → 相关内容

## 3. 小戏小剧小程序

核心能力：

- 首页内容聚合
- 精品剧目
- 剧目详情与视频播放
- 展演活动
- 直播
- 演员
- 剧团
- 全局搜索
- 收藏 / 浏览历史

核心演示闭环：

首页 → 精品剧目 → 剧目详情 → 播放 → 演员 / 剧团 → 展演活动

## 4. 第一版非目标

暂不建设复杂社交、私信、商业化、电商、打赏、复杂会员体系以及 AI 创作生产工作流。

## 5. API 原则

API 采用领域对象优先设计，避免按页面产生大量一次性接口。

候选核心对象：

- Content
- Person
- Organization
- Work
- Event
- Place
- Media
- Collection
- Knowledge
- Evidence
- Session

## 6. 后续接入

Mock API → `news-media-system` 真实 API → Yimeng Intelligence / Knowledge API。
