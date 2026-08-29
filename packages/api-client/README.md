# API Client

统一 API Client 边界。

原则：页面组件不直接调用 `wx.request`。真实环境与 Mock 环境通过同一接口切换。

第一版域对象：Content / Person / Story / Work / Artist / Organization / Event / Live / Media / Search / AI。
