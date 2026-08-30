# 沂蒙精神内容治理规范 V0.1

> 状态：**原则冻结**。适用于沂蒙精神数字传承平台全部 Heritage 内容资产
> （ArchiveItem / HeritageStory / HeritagePerson / MediaAsset / TimelineEvent）。
> 配套 `HERITAGE_DOMAIN_MODEL_V0.2.md` 与 `HERITAGE_PLATFORM_BASELINE_V0.1.md`。

## 1. 内容状态门禁（contentStatus）

```text
Mock Seed（工程测试数据）
    ↓ 内容审核
REVIEWING（核验中）
    ↓ 权威来源核验
VERIFIED（已核验）
    ↓
PUBLISHED（官方发布）
    ↓
ARCHIVED（归档/下线）
```

枚举（domain-types `HeritageContentStatus`，小写存储）：
`draft / reviewing / verified / published / archived`。

**规则**：`packages/mock-data/heritage.js` 是工程测试种子集，**全部 `draft`**，
不得视为官方史料库；未达 `verified/published` 的内容不得以"官方发布"口吻呈现，
Mock 页面须标注示例属性。

## 2. 三轴分离（不得混用）

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `grade` | 来源等级：A 官方档案 / B 权威出版物 / C 权威媒体 / D 一般资料 | `A` |
| `contentStatus` | 内容治理状态：事实核验与编辑审核进度 | `verified` |
| `status` | 渠道发布状态（沿用 BaseContent） | `published` |

`grade: A + contentStatus: VERIFIED` 表示"来源权威，且已经平台审核"。
grade 高不等于免审，两者独立流转。

## 3. 原则一：官方资料优先

引用与展示优先级：

```text
官方档案 > 权威出版物 > 权威媒体 > 一般资料
```

同一事实存在多级来源时，以高等级来源为准；D 级资料仅作线索，不单独支撑事实表述。

## 4. 原则二：不确定事实不强行补全（宁缺毋错）

史料著录中无法从权威来源确证的字段（生卒年、具体日期、人数、番号等）一律留空，
**不得推测补全**。空缺是诚实，错填是事故。

## 5. 原则三：AI 不得改变原始史料语义

AI 智能服务只能：**检索、整理、解释**。不得：

- 自行"润色"为新的历史事实；
- 生成或修改人物评价、事件定性、时间、数字、引文；
- 在无来源支撑时给出确定性表述。

凡 AI 输出必须带生成标识与来源等级统计（PRD §5.3），证据链可回溯
（Evidence 为 AI 输出最小可信单元）。涉史表述与原始史料冲突时，以史料为准并提示冲突。

## 6. 治理流程（后续接入）

正式内容由 `news-media-system` 中台生产、Heritage Knowledge Layer 结构化，
经"来源等级标注 → 事实核验 → 编辑审核 → 发布"四步入库；本仓库体验层只读治理状态。
