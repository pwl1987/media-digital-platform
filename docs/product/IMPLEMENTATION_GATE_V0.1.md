# Implementation Gate V0.1

> 进入真实 UI 批量开发前，两个小程序必须同时满足“结构正确、链路可走、契约稳定、状态完整”。

## Gate A — Navigation

- [x] 两个小程序均采用独立产品定位与 5 Tab 主导航。
- [x] Tab 页面与详情页面路径分离。
- [x] 详情页可由列表项携带稳定 ID 进入。

## Gate B — Content Model

- [x] Yimeng：Person / Story / Place / Content / Media / Evidence / Knowledge 已预留。
- [x] Opera：Work / Performance / Event / Artist / Organization / Media 已预留。
- [x] Work、Performance、Event 三者不混用。
- [x] 详情页通过 relations 继续导航，而不是结束在单页。

## Gate C — Data Boundary

- [x] 页面不直接调用 wx.request。
- [x] Mock 与真实 API 共用 payload 语义。
- [x] ID 与 locator 分离。
- [x] Home 使用 feed/sections 思路，避免运营位硬编码。

## Gate D — UX States

每个列表/详情/媒体/AI 页面进入正式实现时必须补齐：

- loading / skeleton
- empty
- error / retry
- not found / offline
- disabled / unavailable
- success / completion feedback

## Gate E — AI

沂蒙 AI 页面必须支持：

- 新建会话
- 多轮对话
- 生成中
- 停止
- 重试
- 复制
- sources / evidence / related
- 不支持问题的明确降级
- 从人物/故事/地点/内容详情带上下文进入 AI

## Gate F — Media

小戏小剧媒体页面必须支持：

- cover
- media type
- explicit playback entry
- playback loading/failure
- live upcoming/live/ended states
- related content

## Gate G — Release Readiness

正式提审前补做：

- 微信真机验证
- 域名 / HTTPS / 业务域名
- 隐私与用户协议
- 内容审核策略
- 分享卡片
- 适老化与可访问性复核
- 性能与弱网测试
