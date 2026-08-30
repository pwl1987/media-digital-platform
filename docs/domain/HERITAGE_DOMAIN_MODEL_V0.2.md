# 沂蒙精神领域模型 V0.2（Heritage Domain Model Freeze）

> 状态：**冻结候选**，评审通过后由 Phase Y1 落地到 `packages/domain-types/index.ts`。
> 与 `CONTENT_DOMAIN_V0.1.md` 的关系：**扩展而非取代**——小戏小剧侧 Content/News/Work 体系不变，
> 本模型为沂蒙知识层（Heritage Knowledge Layer）的领域结构。配套
> `YIMENG_HERITAGE_PRD_V1.0.md` §6 与 `YIMENG_UI_VISUAL_BASELINE_V0.2.md`。

## 1. 顶层抽象 HeritageResource

沂蒙侧所有知识资产实现 `HeritageResourceBase`（扩展既有 `BaseContent`）：

```ts
export type HeritageSourceGrade = 'A' | 'B' | 'C' | 'D';
// A=官方档案  B=权威出版物  C=权威媒体  D=一般资料

export type ArchiveType = 'document' | 'image' | 'press' | 'file'
  | 'oral-history' | 'video' | 'audio';

export type HeritageEra = '1910s' | '1920s' | '1930s' | '1940s' | '1950s'
  | '1960s-70s' | '1980s-90s' | '2000s' | '2010s' | 'new-era';

export interface SourceReference {
  id: string;
  name: string;          // 来源名（文献名/档案馆藏/出版物）
  locator?: string;      // 定位（卷宗号/页码/URL）
  grade: HeritageSourceGrade;
  note?: string;
}

export interface HeritageResourceBase extends BaseContent {
  grade: HeritageSourceGrade;            // 权威分级（AI 徽章显示用）
  sourceReferences?: SourceReference[];  // 著录来源
  era?: HeritageEra;                     // 年代分期
  topicIds?: string[];
  references?: string[];   // 引用的其他资源（citation graph，Y2 交付）
  citedBy?: string[];      // 被引用（Y2 交付）
}
```

字段分工（避免语义混用）：

| 字段 | 用途 |
| --- | --- |
| `status`（沿用 BaseContent） | 发布状态，走中台治理 |
| `sourceLevel`（沿用 BaseContent） | 跨平台内容信任层级（official/media/historical…） |
| `grade`（新增） | 沂蒙知识层权威分级 A–D，AI 回答与著录区徽章的数据源 |

## 2. 子对象

### 2.1 ArchiveItem（史料，核心资产）

```ts
export interface ArchiveItem extends HeritageResourceBase {
  type: 'ArchiveItem';
  archiveType: ArchiveType;      // 七类
  custody?: string;              // 藏所
  citationId?: string;           // 可引用标识（如 YM-1942-0031）
  physical?: 'original' | 'copy';
  transcript?: string;           // 口述历史/文献转录文字稿
  relatedPersonIds?: string[];
  relatedEventIds?: string[];
}
```

### 2.2 HeritageStory（新时代故事，现实延续载体）

```ts
export type StoryType = 'new-era-practice' | 'grassroots' | 'education-case' | 'culture';

export interface HeritageStory extends HeritageResourceBase {
  type: 'Story';
  storyType: StoryType;
  happenedAt?: string;
  place?: string;
  personIds?: string[];
}
```

> 命名协调：`ContentType` 已有通用 `'Story'`，TS 实现名用 `HeritageStory` 避免接口冲突，
> 判别值仍为 `'Story'`。新时代案例**不归入 Archive**（PRD §6 评审结论）。

### 2.3 HeritagePerson（人物档案）

```ts
export interface HeritagePerson extends Person {
  birthYear?: number;
  deathYear?: number;
  identity?: string;        // 身份（如 支前模范 / 英烈）
  deeds?: string;           // 事迹长文
  archiveIds?: string[];    // 相关史料
  mediaIds?: string[];      // 相关影像
  honors?: string[];        // 荣誉（金色勋章唯一使用场景）
}
```

### 2.4 TimelineEvent（时间轴事件）

```ts
export interface TimelineEvent extends BaseContent {
  type: 'TimelineEvent';
  date: string;             // ISO 8601
  era: HeritageEra;
  place?: string;
  summary?: string;
  personIds?: string[];
  resourceIds?: string[];   // 聚合的史料/文献/图片/视频
}
```

### 2.5 MediaAsset / Evidence / Knowledge（沿用扩展）

- `MediaAsset`：沿用；**双色调规则不新增字段**——历史单色/当代彩色由 `era` 或发布年代推导，属视觉层规则（视觉基线 V0.2 §3）。
- `Evidence`：扩展 `grade: HeritageSourceGrade` 与 `refId?: string; refType?: ContentType`（指向 HeritageResource）。
- `Knowledge`：沿用，作为精神源流词条载体（`evidenceIds` 挂证据）。

### 2.6 HeritagePlace（评审新增，**Y1.1 extension 预留，暂不实现**）

沂蒙精神强烈依赖空间（沂蒙山区、革命旧址、纪念馆、根据地、红色教育基地），
未来必然出现 地点—事件—人物—史料 关系：

```ts
export interface HeritagePlace extends BaseContent {
  type: 'HeritagePlace';
  location?: string;                               // 地址描述
  coordinates?: { lng: number; lat: number };
  placeType?: 'memorial' | 'site' | 'base' | 'museum' | 'region';
  relatedResourceIds?: string[];                   // 关联人物/事件/史料
}
```

标记为 Y1.1 extension：Y1 首批实现不含本对象，落地时需同步 `ContentType` 联合与契约增补。

## 3. 引用关系（citation graph，Y2 交付）

- 存储：`HeritageResourceBase.references` / `citedBy`（双向 id 数组）。
- 展示：史料详情 CitationList（"本史料引用 / 被引用"），AI 回答 sources 可回跳。
- 一致性：中台负责写入时的完整性校验，体验层只读。

## 4. 契约 V0.2 映射

| 端点 | 返回 | 说明 |
| --- | --- | --- |
| `GET /api/v1/yimeng/archives` | `Paginated<ArchiveItem>` | archiveType / era / personId 筛选 + 分页 |
| `GET /api/v1/yimeng/archives/:id` | `ArchiveItem` | 含著录与引用关系 |
| `GET /api/v1/yimeng/timeline` | `Era → TimelineEvent[]` 聚合 | 时间轴 |
| `GET /api/v1/yimeng/origin` | `Knowledge[]` + `Topic` | 精神源流 |
| `POST /api/v1/yimeng/ai/chat` | 响应内 `sources[]` 携带 `grade` | 满足 PRD §5.1 显示要求 |

统一响应包 `{ data, meta, error }`、ISO 8601、ID 与 URL 分离等契约总则不变。

## 5. 实现与守卫（Phase Y1）

1. `ContentType` 联合新增 `'ArchiveItem' | 'TimelineEvent'`；`Content` 联合同步。
2. 上述接口落入 `packages/domain-types/index.ts`，字段名与本文件一致，不得改写语义。
3. 建议将"契约端点 ↔ transport ↔ mock"一致性纳入 `scripts/check-contract.mjs`（Phase 0.8-B B3），并覆盖 archives/timeline/origin 四端点。
4. 本模型冻结后修改须升 V0.3 并同步 PRD §6。
