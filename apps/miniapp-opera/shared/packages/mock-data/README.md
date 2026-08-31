# Mock Data

共享体验层的最小 Mock 数据边界。

目标：让微信小程序、H5、PC Web、Mobile App 在没有真实后端时，可以按与生产 API 相同的领域语义演示完整链路。

原则：
- Mock 不是第二事实源；生产数据最终来自 `news-media-system` / Intelligence Plane。
- Mock 对象使用稳定 ID。
- Mock payload 与 API Contract 保持一致。
- 官方内容必须显式包含 `status`、`sourceLevel`、`sourceName`、`publishedAt`。
