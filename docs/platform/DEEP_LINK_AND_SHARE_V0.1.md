# 全渠道 Deep Link 与分享规范 V0.1

## 1. 原则

同一内容在小程序、H5、PC Web、App 使用同一个稳定内容身份；不同渠道只改变展示方式。

## 2. Canonical Routes

```text
/news/:id
/work/:id
/event/:id
/video/:id
/topic/:id
/person/:id
/organization/:id
```

## 3. 微信小程序

小程序分享应携带稳定内容 ID，并直达对应详情页；不得只分享首页。

## 4. H5

H5 是主要外链落地层。新闻、剧目、活动、视频、专题均必须支持直接打开详情。

## 5. PC Web

PC 使用可读 URL，详情页可被搜索引擎索引；内容 canonical identity 与 H5 保持一致。

## 6. App

App 接收 Universal Link / App Link 后，若已安装进入原生详情；未安装进入对应 H5 落地页。

## 7. 分享元数据

每种内容提供：

- share_title
- share_description
- share_image
- canonical_locator
- fallback_h5_url

## 8. 撤稿处理

旧分享链接保持可解析，但内容状态为 RETRACTED/UNPUBLISHED 时展示状态页，不返回陈旧正文。
