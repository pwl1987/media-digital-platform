# API Contract V0.2

> 取代 `API_CONTRACT_V0.1.md`（保留作历史版本）。前端先行、契约先行。
> 实现接入 `news-media-system` 与 Yimeng Intelligence；沂蒙侧领域结构以
> `docs/domain/HERITAGE_DOMAIN_MODEL_V0.2.md` 为准。

## 变更记录（V0.1 → V0.2）

1. 新增沂蒙史料/时间轴/源流端点：`/yimeng/origin`、`/yimeng/timeline`、`/yimeng/archives`、`/yimeng/archives/:id`。
2. `/yimeng/people` 语义升级：返回 `HeritagePerson[]`（路径沿用 V0.1，不另设 `/yimeng/persons`，避免同类资源双端点）。
3. 领域对象新增 `ArchiveItem`、`TimelineEvent`、`SourceReference`；`Evidence` 扩展 `grade / refId / refType`。
4. AI chat 的 `sources[]` 增加 `grade`（A–D 来源等级）；回答生成标识统计由前端从 `grade` 分布推导，不新增字段。
5. `/yimeng/stories` 语义明确：返回 `HeritageStory[]`（现实延续：新时代实践/基层故事/教育案例）。

## 0. Contract Scope

本 Contract 服务于公众体验层，包括：

- 沂蒙精神数字传承平台小程序
- 沂蒙小戏小剧官方宣传小程序
- 沂蒙小戏小剧 H5
- 后续 PC Web / H5 Experience

API 按领域对象组织，不按页面组织；Mock 与真实 API 必须遵守相同语义。

## 1. Common Envelope

```json
{
  "data": {},
  "meta": { "request_id": "..." },
  "error": null
}
```

错误响应必须保留稳定 `error.code`。

## 2. Canonical Resources

核心领域对象：

- `Content` / `News` / `Story` / `Person` / `Organization` / `Place` / `Work`
- `Event` / `Performance` / `MediaAsset` / `Collection` / `Topic` / `Evidence` / `Knowledge` / `Session`
- 沂蒙知识层：`ArchiveItem` / `TimelineEvent` / `SourceReference`（详见 `HERITAGE_DOMAIN_MODEL_V0.2.md`）

资源身份使用稳定 `id`。详情响应应尽量提供 `relations`，允许客户端继续发现关联内容。

## 3. Feeds / Home

```text
GET /api/v1/yimeng/home
GET /api/v1/opera/home
GET /api/v1/feeds/:feed_id
```

Feed 使用有序 `sections`，运营位不写死在客户端：

```json
{
  "sections": [
    { "id": "hero", "type": "hero", "title": "...", "items": [] },
    { "id": "latest-news", "type": "news", "items": [] }
  ]
}
```

## 4. Shared Content

```text
GET /api/v1/search?q=...
GET /api/v1/contents
GET /api/v1/contents/:id
GET /api/v1/news
GET /api/v1/news/:id
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

`News` 是官方宣传内容的一等对象；新闻详情可以关联 `Work / Event / Person / MediaAsset / Topic`。

## 5. Yimeng Heritage

```text
GET  /api/v1/yimeng/origin            精神源流（Knowledge[] + Topic）
GET  /api/v1/yimeng/timeline          时间轴（Era → TimelineEvent[] 聚合）
GET  /api/v1/yimeng/archives          史料列表（Paginated<ArchiveItem>）
GET  /api/v1/yimeng/archives/:id      史料详情（含著录与引用关系）
GET  /api/v1/yimeng/knowledge
GET  /api/v1/yimeng/stories           HeritageStory[]（现实延续）
GET  /api/v1/yimeng/people            HeritagePerson[]（人物档案）
GET  /api/v1/yimeng/places
GET  /api/v1/yimeng/exhibitions
POST /api/v1/yimeng/ai/chat
GET  /api/v1/yimeng/ai/sessions/:id
```

### 5.1 archives 查询参数

```text
archiveType  document|image|press|file|oral-history|video|audio
era          HeritageEra（1930s…new-era）
personId     关联人物筛选
q            关键词
page / page_size / cursor
```

### 5.2 ArchiveItem 详情著录区字段

`era`（年代）、`sourceReferences[]`（来源引用，含 `grade`）、`custody`（藏所）、
`citationId`（可引用标识）、`physical`（原件/复制品）、`transcript`（文字稿）、
`references[] / citedBy[]`（引用关系，Y2 交付）。

### 5.3 AI chat 响应

最低返回：

```json
{
  "session_id": "...",
  "answer": "...",
  "sources": [
    { "id": "arch-001", "type": "ArchiveItem", "title": "1942年××档案", "grade": "A", "locator": "卷宗号..." }
  ],
  "evidence": [],
  "related": []
}
```

- `sources[].grade`：A=官方档案 / B=权威出版物 / C=权威媒体 / D=一般资料，前端据此显示等级徽章与
  "参考资料 N 项（A 类 x · B 类 y）"生成标识（PRD §5.1 / §5.3）。
- 时间敏感问题（当代实践类）回答需同时包含历史依据与新时代案例内容组（PRD §5.2）。

## 6. Opera Promotion

```text
GET /api/v1/opera/news
GET /api/v1/opera/news/:id
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
GET /api/v1/opera/videos
GET /api/v1/opera/videos/:id
GET /api/v1/opera/live
GET /api/v1/opera/live/:id
```

小戏小剧的一级传播重点为 `News / Work / Media / Event`；直播是内容的一种传播场景，不强制成为一级导航。

`Work` 表达作品本体；`Performance` 表达具体演出场次；`Event` 表达展演/活动。

## 7. Relations

统一关系形式：

```json
{
  "relations": [
    {
      "type": "REFERENCES",
      "target": { "id": "...", "type": "ArchiveItem", "title": "..." }
    }
  ]
}
```

第一版至少支持：

- `RELATED_TO` / `PART_OF` / `CREATED_BY` / `PERFORMED_BY` / `PERFORMED_AT`
- `PARTICIPATED_IN` / `REFERENCES` / `HAS_MEDIA` / `HAS_EVIDENCE` / `OCCURRED_AT`
- `REPORTS_ON` / `FEATURES`
- `CITES` / `CITED_BY`（沂蒙史料引用关系，Y2 交付）

## 8. User

```text
GET    /api/v1/me
GET    /api/v1/me/favorites
POST   /api/v1/me/favorites
DELETE /api/v1/me/favorites/:id
GET    /api/v1/me/history
POST   /api/v1/me/history
```

未登录客户端允许本地收藏/历史；登录后再同步。

## 9. H5 Rules

H5 复用上述资源接口，不创建另一套 H5 内容 API。

重点支持：

- `/news/:id` / `/works/:id` / `/events/:id` / `/videos/:id` / `/topics/:id`
- `/archives/:id`（沂蒙史料分享落地）

分享链接必须可以直接落到内容详情，不能要求先进入首页。

## 10. Client Rules

1. 页面不得直接拼接业务 URL。
2. 页面不得直接调用 `wx.request`；统一经 API Client。
3. Mock 与真实 API 使用相同 payload schema。
4. ID 与访问 URL 分离。
5. 时间使用 ISO 8601。
6. 列表必须有分页元数据。
7. 空结果、网络错误、未找到、下架必须有显式状态。
8. AI 必须能够表达来源与证据（含来源等级）。
9. 详情页允许继续导航到 `relations`。
10. 标题不得作为资源身份。
11. H5、小程序、PC 尽可能共享同一 Content / News / Media / Event / Archive 语义。
