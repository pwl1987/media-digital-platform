# API Contract V0.1

> 前端先行、契约先行。具体实现后续接入 `news-media-system` 与 Yimeng Intelligence。

## Common

所有接口建议统一前缀：`/api/v1`。

统一响应：

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

## Shared Content

```text
GET /api/v1/home
GET /api/v1/search?q=...
GET /api/v1/contents
GET /api/v1/contents/:id
GET /api/v1/media/:id
GET /api/v1/collections/:id
GET /api/v1/persons
GET /api/v1/persons/:id
GET /api/v1/organizations
GET /api/v1/organizations/:id
GET /api/v1/events
GET /api/v1/events/:id
```

## Yimeng

```text
GET  /api/v1/yimeng/home
GET  /api/v1/yimeng/knowledge
GET  /api/v1/yimeng/stories
GET  /api/v1/yimeng/people
GET  /api/v1/yimeng/exhibitions
POST /api/v1/yimeng/ai/chat
GET  /api/v1/yimeng/ai/sessions/:id
```

## Opera

```text
GET /api/v1/opera/home
GET /api/v1/opera/works
GET /api/v1/opera/works/:id
GET /api/v1/opera/artists
GET /api/v1/opera/artists/:id
GET /api/v1/opera/organizations
GET /api/v1/opera/organizations/:id
GET /api/v1/opera/events
GET /api/v1/opera/events/:id
GET /api/v1/opera/live
GET /api/v1/opera/live/:id
```

## User

```text
GET    /api/v1/me
GET    /api/v1/me/favorites
POST   /api/v1/me/favorites
DELETE /api/v1/me/favorites/:id
GET    /api/v1/me/history
```

## Contract Rules

1. 页面不得直接拼接业务 URL。
2. 所有真实 API 与 Mock API 使用相同数据契约。
3. ID 与 URL 分离；URL 只是资源定位符。
4. AI 回答支持 `sources` / `evidence` / `related` 字段。
5. 时间统一使用 ISO 8601。
6. 列表接口支持 `page`、`page_size`、`cursor` 等分页策略，但具体选择在实现阶段冻结。
