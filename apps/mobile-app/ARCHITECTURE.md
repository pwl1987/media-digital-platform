# 移动端 App 架构基线

## 产品形态

一个 App，多频道、多主题内容。首期包括“沂蒙精神”和“小戏小剧”两个频道，不维护两套独立 App 代码库。

## 核心层次

```text
App Shell
  ├── Navigation
  ├── Auth
  ├── Push
  ├── Media Player
  ├── Share / Deep Link
  ├── Download / Cache
  └── Analytics
       ↓
Experience Modules
  ├── Yimeng
  └── Opera
       ↓
Shared API Client / Domain Types
       ↓
Content / Business / Intelligence APIs
```

## 技术原则

- API Contract-first。
- 业务对象与平台 UI 解耦。
- 原生能力通过 adapter 接入，避免散落在业务页面。
- App Deep Link 与 H5 URL 可以建立映射。
- 离线缓存只作为体验能力，不成为内容事实来源。

## 框架决策

在正式编码前通过小型技术 Spike 比较 React Native 与 Flutter，至少验证：视频播放、微信/系统分享、推送、深链、Android/iOS 构建、中文字体与现有团队维护成本。验证后再冻结框架。
