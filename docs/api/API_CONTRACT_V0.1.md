# API Contract V0.1

> 前端先行、契约先行。具体实现后续接入 `news-media-system` 与 Yimeng Intelligence。

## 0. Contract Scope

本 Contract 服务于两个公众体验应用：沂蒙精神智能平台、沂蒙小戏小剧展演平台。

API 按领域对象组织，不按页面组织。页面、Mock 与真实服务必须遵守同一语义。

## 1. Common Envelope

所有接口建议统一前缀 `/api/v1`。

成功响应：

```json
{
  "data": {},
  "meta": { "request_id": "..." },
  "error": null
}
```

失败响应：

```json
{
  "data": null,
  "meta": { "request_id": "..." },
  "error": { "code": "CONTENT_NOT_FOUND", "message": "内容不存在" }
}
```

## 2. Canonical Resources

稳定 `id` 是资源身份；URL 只是 locator。

核心对象：`Content`、`Person`、`Organization`、`Place`、`Work`、`Story`、`Event`、`Performance`、`MediaAsset`、`Collection`、`Topic`、`Evidence`、`Knowledge`、`Session`。

详情资源应尽量返回 `relations`，让客户端继续导航到关联内容。

## 3. Experience Feeds

首页不直接绑定数据库栏目，而由产品 Feed 返回有序 sections：

```text
GET /api/v1/feeds/yimeng-home
GET /api/v1/feeds/opera-home
GET /api/v1/feeds/:feed_id
```

建议 payload：

```json
{
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "title": "重点内容",
      "items": []
    }
  ]
}
```

这样运营位可以调整而不要求客户端重新发版。

## 4. Shared Content APIs

```text
GET /api/v1/search?q=...
GET /api/v1/contents
GET /api/v1/contents/:id
GET /api/v1/collections/:id
GET /api/v1/topics/:id
GET /api/v1/media/:id
GET /api/v1/persons
GET /api/v1/persons/:id
GET /api/v1/organizations
GET /api/v1/organizations/:id
GET /api/v1/places
GET /api/v1/places/:id
GET /api/v1/events
GET /api/v1/events/:id
GET /api/v1/performances
GET /api/v1/performances/:id
```

## 5. Yimeng Experience APIs

产品领域入口只表达体验语义，底层内容仍使用共享对象：

```text
GET  /api/v1/yimeng/knowledge
GET  /api/v1/yimeng/stories
GET  /api/v1/yimeng/people
GET  /api/v1/yimeng/places
GET  /api/v1/yimeng/exhibitions
POST /api/v1/yimeng/ai/chat
GET  /api/v1/yimeng/ai/sessions/:id
```

AI response minimum fields：

```json
{
  "session_id": "...",
  "answer": "...",
  "sources": [],
  "evidence": [],
  "related": []
}
```

## 6. Opera Experience APIs

```text
GET /api/v1/opera/works
GET /api/v1/opera/works/:id
GET /api/v1/opera/artists
GET /api/v1/opera/artists/:id
GET /api/v1/opera/organizations
GET /api/v1/opera/organizations/:id
GET /api/v1/opera/events
GET /api/v1/opera/events/:id
GET /api/v1/opera/performances
GET /api/v1/opera/performances/:id
GET /api/v1/opera/live
GET /api/v1/opera/live/:id
```

`Performance` 表达具体演出场次；`Work` 表达作品本体；`Event` 表达展演/活动，三者不可混为一个对象。

## 7. Relations

详情接口可以返回：

```json
{
  "relations": [
    {
      "type": "PERFORMED_BY",
      "target": {
        "id": "...",
        "type": "Organization",
        "title": "..."
      }
    }
  ]
}
```

第一版 relation type 至少包括：`RELATED_TO`、`PART_OF`、`CREATED_BY`、`PERFORMED_BY`、`PERFORMED_AT`、`PARTICIPATED_IN`、`REFERENCES`、`HAS_MEDIA`、`HAS_EVIDENCE`、`OCCURRED_AT`。

## 8. User

```text
GET    /api/v1/me
GET    /api/v1/me/favorites
POST   /api/v1/me/favorites
DELETE /api/v1/me/favorites/:id
GET    /api/v1/me/history
POST   /api/v1/me/history
```

未登录情况下，客户端可退化到本地历史/收藏；真实账号能力以后接微信身份体系。

## 9. Client Rules

1. 页面不得直接拼接业务 URL。
2. 页面不得直接调用 `wx.request`。
3. Mock 与真实 API 使用相同 payload schema。
4. ID 与访问 URL 分离。
5. 时间使用 ISO 8601。
6. 列表统一保留分页元数据。
7. 空结果、错误、未找到、下架使用显式状态表达。
8. AI 必须能够表达来源与证据。
9. 所有详情页必须允许继续导航到 `relations`。
10. Content / Media / Knowledge 的身份不可用显示标题代替。
