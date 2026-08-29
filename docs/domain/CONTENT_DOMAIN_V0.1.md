# 内容域 V0.1

## 目标

为两个小程序以及后续 PC/H5 建立统一的内容语义。体验层不直接绑定某个页面的字段模型。

## Canonical Objects

### Content

面向用户可消费的内容单元。可承载标题、摘要、正文、封面、发布时间、状态、来源、标签等。

### Person

人物实体。可用于历史人物、文化人物、演员、主创等场景。

### Organization

机构实体。可用于剧团、文化机构、主办/承办单位等。

### Place

地点实体。可用于历史地点、纪念馆、红色基地、剧场、活动地点等。

### Work

作品实体。可用于小戏小剧、戏曲、歌曲、文艺作品等。

### Story

故事 / 事迹实体。用于沂蒙精神内容中的故事、人物事迹、历史故事等。

### Event

活动实体。用于展演活动、比赛、主题活动、讲座等。

### Performance

具体演出场次。它连接 Work 与 Event，并保存时间、地点、演出状态、节目单等信息。

### MediaAsset

图片、视频、音频、直播资源、文档等媒体资产的逻辑身份。访问 URL 不是资产身份。

### Evidence

支持内容或 AI 结论的来源证据。必须可追溯到来源媒体、文档或人工审核记录。

### Knowledge

从内容和证据治理后形成的可检索知识单元，用于 Intelligence Plane。

### Collection

内容集合。用于专题、栏目、数字展馆、首页运营集合等场景。

### Topic

面向传播与运营的主题集合，可关联多种对象。

## 关系原则

使用关系对象表达跨内容关联，不在页面里维护手工字符串关系。

推荐关系：

- Person `related_to` Story
- Person `member_of` Organization
- Story `occurred_at` Place
- Work `performed_by` Organization
- Performance `presents` Work
- Performance `belongs_to` Event
- Performance `held_at` Place
- Event `produces` MediaAsset
- Content `references` Evidence
- Content `related_to` Content
- Collection `contains` Content
- Collection `contains` Work
- Knowledge `derived_from` Content
- Knowledge `supported_by` Evidence

## 内容生命周期

```text
Draft
  ↓
PendingReview
  ↓
Approved
  ↓
Published
  ↓
Archived / Unpublished
```

AI 产生的内容必须带来源与生成信息；未经审核不得自动成为权威公开内容。

## 渠道分发

一个 Content / Work / Event 可以被多个渠道引用：

- PC Web
- H5
- 沂蒙精神小程序
- 小戏小剧小程序
- 搜索
- Knowledge Pipeline

渠道选择属于 Publishing 语义，不复制内容实体。

## 与母架构关系

本文件落实 `media-digital-architecture` 的 Asset / Artifact / Evidence / Knowledge 统一领域语言；业务事实由 Business Control Plane 管理，AI 执行由 Intelligence Plane 管理。
