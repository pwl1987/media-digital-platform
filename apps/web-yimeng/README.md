# 沂蒙精神 PC Web

官方知识与智能传播门户，同时承担阶段性研发成果演示入口。

## 当前实现

本目录提供一套可由静态 HTTP Server 直接托管的 PC 阶段成果演示门户：

- 首页与运行状态提示
- 阶段建设成果卡片
- 红色文化数字档案检索工作台
- 人物档案、故事、历史时间轴接入位
- 数据治理与证据链展示
- 多轮智能问答接入位
- 来源、证据、相关内容展示
- 阶段成果核验看板
- PC / 移动浏览器响应式布局

门户只在配置真实服务后读取档案和智能问答接口。未配置服务时显示明确空态，不内置正式史料、完成数量或模拟模型回答。

## 运行方式

在仓库根目录运行任意静态服务器，例如：

```bash
python3 -m http.server 4173 --directory apps/web-yimeng
```

然后打开 `http://localhost:4173`。

如需联调真实服务，在页面加载前配置：

```html
<script>
  window.YIMENG_DEMO_CONFIG = {
    apiBase: "http://真实服务地址",
    projectName: "沂蒙精神数字传承平台",
    projectStage: "阶段性研发成果演示"
  };
</script>
```

主要接口：

- `GET /health`：服务健康检查
- `GET /api/v1/yimeng/archives?page=1&page_size=4`：档案预览
- `POST /api/v1/yimeng/ai/chat`：多轮问答，携带 `message`、`messages`、`session_id`

## 真实目录快照（无后端时的真实数据源）

未配置 `apiBase` 时，门户会尝试加载同源静态资产 `./data/archives-snapshot.json`（已 gitignore，不入公开仓库）。该文件由 YimengSpirit-Multimodal 私仓脚本从清洗层生成，**仅含书目、章节题名、页码定位与处理元数据，不含正文**（原始资料 license=restricted，正文展示须另行授权）：

```bash
# 在 YimengSpirit-Multimodal 仓内执行
python scripts/export_archive_snapshot.py \
  --data-root /data/AI/YimengSpirit-Multimodal/data \
  --out <本目录>/data/archives-snapshot.json
```

快照模式下：档案区显示“真实目录快照 · 非在线库”状态，支持全量检索（2010 章节目录）、筛选、分页、点击进入著录详情与来源回查；核验看板数据服务显示“目录快照”，不仍充在线库。

## 真实核验口径

页面中的“已实现”表示本目录的体验结构或前端能力已落地；“已配置 / 已连接”只根据运行时检查结果显示。正式数据规模、资源授权、审核结论、模型效果、测试结论和投资金额仍以正式台账、原始凭证及现场核验记录为准。

截图应来自实际运行页面，并同时记录分支、提交号、服务地址、接口返回状态和核验时间。
