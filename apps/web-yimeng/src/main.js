// 样式经 index.html <link> 加载：浏览器原生 ES 模块禁止 import CSS（W0 实测白屏根因）
// 网络访问一律走 utils/api.js facade（AGENTS.md 原则 3，R0-HARDEN-01 收口）
import { API_BASE, api, loadArchiveSnapshot as fetchArchiveSnapshot } from '../utils/api.js';

const config = window.YIMENG_DEMO_CONFIG || {};
const PROJECT_NAME = String(config.projectName || '沂蒙精神数字传承平台');
const PROJECT_STAGE = String(config.projectStage || '阶段性研发成果演示');
const state = {
  service: { health: 'unknown', archives: 'unknown', ai: 'unknown', checkedAt: null },
  archiveItems: [],
  archiveFilter: '全部',
  archiveQuery: '',
  archiveDetail: null,
  archiveLimit: 24,
  snapshotMeta: null,
  snapshotError: null,
  conversation: [],
  sessionId: null,
  currentKnowledge: 'people'
};

const platforms = [
  { code: '基', title: '基础设施', status: '已建研发环境', tone: 'ready', desc: '开发机、GPU 服务器与共享存储组成的研发与数据环境；正式算力与采购以台账为准。' },
  { code: 'P1', title: '多模态人工智能服务平台', status: '待接入演示', tone: 'pending', desc: 'MiniCPM-V 多轮/图像问答代码已落地；本轮演示机无 GPU 且远程服务未接通，按真实状态登记。' },
  { code: 'P2', title: '数字资源与知识服务平台', status: '目录快照可用', tone: 'ready', desc: '6 部志书 2010 章节目录级快照可检索、可查详情、可回溯来源；正文展示受使用限制待授权。' },
  { code: 'P3', title: '智能视听与数字资产生产平台', status: '待接入入口', tone: 'pending', desc: '复用既有智能视听工作站；本轮未接通入口，不显示为已建成。' },
  { code: 'P4', title: '数字文化应用服务平台', status: '部分可用', tone: 'ready', desc: '本门户为阶段成果演示入口；小程序等公众端产品另行核验，不混入平台完成量。' },
  { code: '安', title: '国产化适配与安全可信支撑体系', status: '规划建设中', tone: 'pending', desc: '安全扫描与审计日志已有研发基础；国产化适配与测评以正式记录为准，不预标完成。' }
];

const stages = [
  {
    code: '01',
    title: '红色文化数据治理',
    status: '结构已实现',
    tone: 'ready',
    desc: '围绕来源登记、内容整理、质量检查、审核状态和版本追溯建立展示结构。正式数据与审核记录需接入后方可核验。',
    points: ['来源与权利状态', '清洗与重复检测', '质量检查与审核', '版本与追溯信息']
  },
  {
    code: '02',
    title: '领域知识与智能服务',
    status: '接口接入位',
    tone: 'pending',
    desc: '门户已提供统一问答入口和来源展示组件；模型服务、知识库和多轮会话能力以真实接口返回为准。',
    points: ['统一服务入口', '多轮会话承载', '来源与证据回链', '图文能力接入位']
  },
  {
    code: '03',
    title: '数字档案与知识组织',
    status: '前端已实现',
    tone: 'ready',
    desc: '形成史料、人物、故事、时间轴和引用关系的体验结构。工程测试数据不在门户中伪装为正式史料。',
    points: ['史料检索工作台', '人物与故事入口', '历史时间轴', '来源引用展示']
  },
  {
    code: '04',
    title: '多端应用与现场核验',
    status: '待现场核验',
    tone: 'pending',
    desc: 'PC 演示门户用于集中展示阶段成果；小程序、服务部署、测试记录和截图证据需要在现场逐项核验。',
    points: ['PC 演示门户', '小程序入口', '运行环境检查', '截图与记录归档']
  }
];

const verificationItems = [
  ['前端门户', '首页、阶段成果、档案、知识组织、治理、智能服务、核验看板', '已实现', 'ready'],
  ['数字档案体验', '筛选、检索、空态、服务状态和来源字段展示', '已实现', 'ready'],
  ['人物 / 故事 / 时间轴', '结构入口和未接入状态表达，不伪造正式条目', '待接入数据', 'pending'],
  ['数据治理展示', '来源—整理—审核—发布的过程与核验字段', '已实现', 'ready'],
  ['智能问答', '真实 API 调用、会话携带、来源 / 证据 / 相关内容', '待接入服务', 'pending'],
  ['运行与证据', '健康检查、接口状态、代码版本和现场记录', '待现场核验', 'pending']
];

const archiveTypes = ['全部', '文献', '图片', '报刊', '档案', '口述历史', '视频', '音频'];
const sourceGradeLabels = {
  A: '官方档案', B: '权威出版物', C: '权威媒体', D: '一般资料'
};

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function statusBadge(label, tone = 'pending') {
  return `<span class="status-badge status-${tone}"><i></i>${esc(label)}</span>`;
}

function gradeLabel(grade) {
  return sourceGradeLabels[String(grade || 'D').toUpperCase()] || '来源待标注';
}

// 权威声明 fail-closed 展示：authority_claim 仅是原始来源标签，未经独立分级认定
function authorityClaimLabel(claim, compact = false) {
  return compact ? '未经独立分级' : claim ? `原始声明 ${claim}（未经独立认定）` : '未经独立分级';
}

function stageCards() {
  return stages.map((stage) => `
    <article class="stage-card">
      <div class="stage-top"><span class="stage-code">${esc(stage.code)}</span>${statusBadge(stage.status, stage.tone)}</div>
      <h3>${esc(stage.title)}</h3>
      <p>${esc(stage.desc)}</p>
      <ul>${stage.points.map((point) => `<li>${esc(point)}</li>`).join('')}</ul>
    </article>
  `).join('');
}

function verificationRows() {
  return verificationItems.map(([name, evidence, label, tone]) => `
    <div class="verify-row">
      <strong>${esc(name)}</strong>
      <span>${esc(evidence)}</span>
      ${statusBadge(label, tone)}
    </div>
  `).join('');
}

function shell() {
  document.querySelector('#app').innerHTML = `
    <header class="site-header">
      <div class="wrap nav">
        <a class="brand" href="#home" aria-label="返回首页">
          <span class="brand-mark">沂</span>
          <span><strong>${esc(PROJECT_NAME)}</strong><small>YIMENG SPIRIT · DIGITAL HERITAGE</small></span>
        </a>
        <button class="menu-toggle" id="menu-toggle" aria-label="打开导航">☰</button>
        <nav id="site-nav">
          <a href="#home">首页</a>
          <a href="#overview">项目总览</a>
          <a href="#progress">阶段成果</a>
          <a href="#archive">数字档案</a>
          <a href="#knowledge">人物故事</a>
          <a href="#governance">数据治理</a>
          <a href="#ai">智能问答</a>
          <a href="#verification">成果核验</a>
        </nav>
        <span class="stage-label">${esc(PROJECT_STAGE)}</span>
      </div>
    </header>

    <main id="home">
      <section class="hero">
        <div class="wrap hero-grid">
          <div class="hero-copy">
            <div class="eyebrow">数字文化 · 红色文化智能传播</div>
            <h1>让红色文化资源<br><em>可整理、可检索、可理解、可传播</em></h1>
            <p>围绕沂蒙精神红色文化资源数字化、知识组织、人工智能服务和多端传播，展示当前可运行、可核验的阶段性建设成果。</p>
            <div class="hero-actions">
              <a class="primary-btn" href="#progress">查看阶段成果</a>
              <a class="ghost-btn" href="#verification">进入核验看板</a>
            </div>
          </div>
          <div class="hero-panel">
            <div class="hero-panel-head"><span>DEMO STATUS</span>${statusBadge(API_BASE ? '正在检查服务' : '未配置服务', API_BASE ? 'checking' : 'pending')}</div>
            <h2>阶段性成果演示入口</h2>
            <p>门户自身可直接运行；正式档案与智能服务不在未接入时生成模拟内容。</p>
            <div class="hero-metrics">
              <div><b>01</b><span>体验门户</span></div>
              <div><b>02</b><span>档案接入</span></div>
              <div><b>03</b><span>智能服务</span></div>
            </div>
            <div class="hero-service-line"><span>运行环境</span><strong id="hero-service-state">检测中…</strong></div>
          </div>
        </div>
      </section>

      <section class="status-strip">
        <div class="wrap status-strip-inner">
          <div><span class="section-kicker">CURRENT STATE</span><strong>本页面只展示已实现结构与真实接入状态</strong></div>
          <div id="global-service-state" class="global-service-state">${statusBadge(API_BASE ? '正在检查' : '服务未配置', API_BASE ? 'checking' : 'pending')}</div>
        </div>
      </section>

      <section id="overview" class="wrap section">
        <div class="section-head"><div><span class="section-kicker">PROJECT OVERVIEW · 1+4+1</span><h2>沂蒙精神大模型 · 项目总览</h2></div><p>备案项目名称为“沂蒙精神大模型”，本门户为其公众传播产品“沂蒙精神数字传承平台”的阶段成果演示入口。下列 1+4+1 架构状态按实际核验登记，未建成不显示为已建成。</p></div>
        <div class="stage-grid platform-grid">${platforms.map((p) => `
          <article class="stage-card">
            <div class="stage-top"><span class="stage-code">${esc(p.code)}</span>${statusBadge(p.status, p.tone)}</div>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.desc)}</p>
          </article>
        `).join('')}</div>
      </section>

      <section id="progress" class="wrap section">
        <div class="section-head"><div><span class="section-kicker">PROJECT PROGRESS</span><h2>阶段建设成果</h2></div><p>将软件能力、接口接入和现场核验分开表达，避免把规划内容或测试数据写成正式完成量。</p></div>
        <div class="stage-grid">${stageCards()}</div>
      </section>

      <section id="archive" class="paper-section section">
        <div class="wrap">
          <div class="section-head"><div><span class="section-kicker">DIGITAL ARCHIVE</span><h2>红色文化数字档案</h2></div><p>档案区默认展示真实服务状态。未配置正式服务时只展示接入说明，不显示伪造史料。</p></div>
          <div class="archive-layout">
            <div class="archive-panel">
              <div class="archive-toolbar"><div class="panel-title">史料检索工作台</div><span id="archive-count" class="result-count">未接入数据</span></div>
              <div class="archive-filters">${archiveTypes.map((type) => `<button class="filter-btn${type === '全部' ? ' active' : ''}" data-archive-filter="${esc(type)}">${esc(type)}</button>`).join('')}</div>
              <label class="search-box"><span>⌕</span><input id="archive-query" placeholder="输入关键词检索已接入档案" aria-label="档案关键词" /><button id="archive-search" type="button">检索</button></label>
              <div id="archive-state" class="service-state">正在检测数据服务…</div>
              <div id="archive-list" class="archive-list"></div>
            </div>
            <aside class="archive-aside">
              <div class="aside-label">ARCHIVE NOTE</div><h3>来源可追溯，事实可核验</h3>
              <p>正式资源应保留来源、权利状态、审核状态、原件或复制品说明以及可回链的引用标识。</p>
              <div class="flow"><span>来源登记</span><i>→</i><span>整理加工</span><i>→</i><span>人工审核</span><i>→</i><span>发布使用</span></div>
              <div class="aside-note">当前展示策略：无服务返回时显示空态，不使用工程 seed 充当正式史料。</div>
            </aside>
          </div>
        </div>
      </section>

      <section id="knowledge" class="wrap section">
        <div class="section-head"><div><span class="section-kicker">KNOWLEDGE ORGANIZATION</span><h2>人物 · 故事 · 历史时间轴</h2></div><p>展示知识组织的入口与字段结构；正式条目必须来自已审核数据服务，并附来源或核验记录。</p></div>
        <div class="knowledge-shell">
          <div class="knowledge-tabs" role="tablist">
            <button class="knowledge-tab active" data-knowledge="people">人物档案</button>
            <button class="knowledge-tab" data-knowledge="stories">新时代故事</button>
            <button class="knowledge-tab" data-knowledge="timeline">历史时间轴</button>
          </div>
          <div id="knowledge-panel" class="knowledge-panel"></div>
        </div>
      </section>

      <section id="governance" class="paper-section section">
        <div class="wrap">
          <div class="section-head"><div><span class="section-kicker">DATA GOVERNANCE</span><h2>数据治理与证据链</h2></div><p>面向现场核验展示数据从来源进入平台后的处理边界与留痕字段，不把过程图等同于已完成数量。</p></div>
          <div class="governance-grid">
            <div class="governance-flow">
              <div class="governance-step"><b>01</b><div><strong>来源登记</strong><span>记录来源主体、出处、权利状态和接收时间。</span></div></div>
              <div class="governance-step"><b>02</b><div><strong>02 · 整理加工</strong><span>进行格式统一、文本清洗、媒体关联和重复检查。</span></div></div>
              <div class="governance-step"><b>03</b><div><strong>人工审核</strong><span>保留审核人、审核时间、审核意见和状态变化。</span></div></div>
              <div class="governance-step"><b>04</b><div><strong>发布使用</strong><span>仅将可对外使用的记录提供给档案或智能服务。</span></div></div>
            </div>
            <div class="governance-card"><span class="aside-label">RECORD FIELDS</span><h3>一条资源至少应能回答</h3><ul><li>它来自哪里，是否获得使用授权？</li><li>谁在什么时候完成了审核？</li><li>它与哪些人物、故事、事件相关？</li><li>智能回答引用它时能否回到原始记录？</li></ul><div class="governance-state">${statusBadge('字段结构已展示 · 数据待接入', 'pending')}</div></div>
          </div>
        </div>
      </section>

      <section id="ai" class="wrap section">
        <div class="section-head"><div><span class="section-kicker">AI SERVICE</span><h2>沂蒙精神智能问答</h2></div><p>仅调用已配置的真实智能服务；回答、来源、证据与相关内容全部以接口返回为准。</p></div>
        <div class="ai-shell">
          <div class="ai-intro"><span class="ai-badge">AI</span><h3>从可靠资料出发回答问题</h3><p>支持多轮会话承载、领域问答和来源展示。没有模型服务时，页面只提示接入状态，不生成模拟答案。</p><div class="suggestions"><button data-question="什么是沂蒙精神？">什么是沂蒙精神？</button><button data-question="请介绍沂蒙红嫂的代表性事迹。">沂蒙红嫂代表性事迹</button><button data-question="沂蒙精神有哪些时代价值？">沂蒙精神的时代价值</button></div></div>
          <div class="chat-card"><div class="chat-card-head"><strong>智能服务会话</strong><span id="ai-service-state">服务状态检测中…</span></div><div id="chat-log" class="chat-log"><div class="assistant-message">请输入问题。系统将优先调用已配置的真实智能服务。</div></div><form id="chat-form" class="composer"><input id="chat-input" placeholder="输入您想了解的问题" autocomplete="off" /><button type="submit">发送</button></form></div>
        </div>
      </section>

      <section id="verification" class="verification section"><div class="wrap"><div class="section-head light"><div><span class="section-kicker">VERIFICATION DASHBOARD</span><h2>成果核验看板</h2></div><p>现场可结合仓库代码、运行页面、服务日志、测试记录和正式台账逐项核验。</p></div><div class="verification-summary"><div><span>门户状态</span><strong id="verification-portal">可运行</strong></div><div><span>数据服务</span><strong id="verification-data">未配置</strong></div><div><span>智能服务</span><strong id="verification-ai">未配置</strong></div><div><span>最后检查</span><strong id="verification-time">尚未检查</strong></div></div><div class="verify-table">${verificationRows()}</div><div class="verification-note"><strong>核验口径</strong><span>本门户用于展示阶段性研发成果。正式数据规模、资源授权、审核结论、测试结论和财务投资以正式台账、原始凭证及现场核验记录为准。</span></div></div></section>
    </main>

    <footer><div class="wrap footer-inner"><div><strong>${esc(PROJECT_NAME)}</strong><span>${esc(PROJECT_STAGE)}</span></div><div>保护 · 研究 · 传播 · 传承</div></div></footer>
  `;
  wireInteractions();
  renderKnowledgePanel();
  checkServices();
}

function renderKnowledgePanel() {
  const panel = document.querySelector('#knowledge-panel');
  if (!panel) return;
  const configs = {
    people: { title: '人物档案', desc: '人物卡片预留姓名、身份、年代、相关事迹和来源字段。', fields: ['人物身份', '生平与事迹', '关联史料', '来源与审核状态'] },
    stories: { title: '新时代故事', desc: '故事入口预留故事类型、发生地、时间、主体和佐证材料字段。', fields: ['故事标题', '时间与地点', '关联人物', '佐证材料'] },
    timeline: { title: '历史时间轴', desc: '时间轴预留年代锚点、事件节点、关联人物与史料的聚合视图。', fields: ['年代锚点', '事件节点', '人物关联', '史料回链'] }
  };
  const item = configs[state.currentKnowledge];
  panel.innerHTML = `<div class="knowledge-empty"><div class="empty-mark">${state.currentKnowledge === 'timeline' ? '年' : state.currentKnowledge === 'stories' ? '事' : '人'}</div><div><span class="aside-label">${esc(item.title)}</span><h3>${esc(item.title)}接入位已就绪</h3><p>${esc(item.desc)}当前未配置可公开展示的正式条目，因此不展示工程测试数据。</p><div class="field-list">${item.fields.map((field) => `<span>${esc(field)}</span>`).join('')}</div>${statusBadge('待接入真实数据 · 现场核验', 'pending')}</div></div>`;
}

function archiveMatches() {
  const query = state.archiveQuery.trim().toLowerCase();
  return state.archiveItems.filter((item) => {
    const type = item.archiveType || item.type || '史料';
    const text = `${item.title || ''} ${item.summary || ''} ${item.book_name || ''} ${type}`.toLowerCase();
    return (state.archiveFilter === '全部' || type === state.archiveFilter) && (!query || text.includes(query));
  });
}

function renderArchiveList() {
  const list = document.querySelector('#archive-list');
  const count = document.querySelector('#archive-count');
  if (!list || !count) return;
  if (state.archiveDetail) return renderArchiveDetail();
  if (state.service.archives === 'snapshot') {
    const items = archiveMatches();
    const shown = items.slice(0, state.archiveLimit);
    const meta = state.snapshotMeta || {};
    count.textContent = `快照 ${items.length} / ${meta.total_chapters || items.length} 条`;
    list.innerHTML = shown.length ? shown.map((item, index) => `
      <article class="archive-card archive-clickable" data-index="${state.archiveItems.indexOf(item)}" tabindex="0" role="button" aria-label="查看 ${esc(item.title)} 详情">
        <div class="archive-card-meta"><span>${esc(item.subtype || item.archiveType || item.type || '史料')}</span><b class="grade-badge-muted">${esc(authorityClaimLabel(item.authority_claim, true))}</b></div>
        <h4>${esc(item.title || '未题名章节')}</h4>
        <p>${esc(item.summary || `${item.book_name || ''} 第${item.chapter_no}章 · 页码 ${item.page_range || '待标注'}`)}</p>
        <div class="archive-card-foot"><span>${esc(item.book_name || '来源待标注')}</span><span>点击查看详情</span></div>
      </article>`).join('') + (items.length > state.archiveLimit ? `<div class="empty-state"><button class="load-more" id="archive-more" type="button">加载更多（已显示 ${shown.length} / ${items.length}）</button></div>` : '') : '<div class="empty-state">当前筛选条件没有返回记录。</div>';
    list.querySelectorAll('.archive-clickable').forEach((card) => {
      const open = () => { state.archiveDetail = state.archiveItems[Number(card.dataset.index)]; renderArchiveDetail(); };
      card.addEventListener('click', open);
      // 键盘可达（R0-HARDEN-01 验收项）：Enter/Space 触发，Esc 在详情页返回
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
      });
    });
    document.querySelector('#archive-more')?.addEventListener('click', () => { state.archiveLimit += 24; renderArchiveList(); });
    return;
  }
  if (!state.service.archives || state.service.archives !== 'ready') {
    count.textContent = '未接入数据';
    const failNote = state.snapshotError
      ? `目录快照加载失败（${esc(state.snapshotError)}）。可按 apps/web-yimeng/README.md 的命令从主仓清洗层重新生成后刷新。`
      : '当前没有配置可公开展示的真实档案服务。接入并完成审核后，此处展示史料卡、著录信息和来源回链。';
    list.innerHTML = `<div class="archive-empty"><div class="empty-mark">档</div><h3>正式档案服务接入位已就绪</h3><p>${failNote}</p>${statusBadge('待接入真实数据', 'pending')}</div>`;
    return;
  }
  const items = archiveMatches();
  count.textContent = `当前页 ${items.length} 条`;
  list.innerHTML = items.length ? items.map((item) => `<article class="archive-card"><div class="archive-card-meta"><span>${esc(item.archiveType || item.type || '史料')}</span>${item.grade ? `<b>${esc(gradeLabel(item.grade))}</b>` : ''}</div><h4>${esc(item.title || '未命名资料')}</h4><p>${esc(item.summary || '已接入记录，详情以服务返回为准。')}</p><div class="archive-card-foot"><span>${esc(item.year || item.date || '年代待标注')}</span><span>${esc(item.source || '来源待标注')}</span></div></article>`).join('') : '<div class="empty-state">当前筛选条件没有返回记录。</div>';
}

function renderArchiveDetail() {
  const list = document.querySelector('#archive-list');
  const count = document.querySelector('#archive-count');
  const item = state.archiveDetail;
  if (!item) return;
  count.textContent = '资料详情';
  const row = (label, value) => `<div class="detail-row"><span>${esc(label)}</span><strong>${esc(value || '—')}</strong></div>`;
  list.innerHTML = `
    <article class="archive-detail">
      <div class="archive-card-meta"><span>${esc(item.subtype || item.type || '史料')}</span><b class="grade-badge-muted">${esc(authorityClaimLabel(item.authority_claim))}</b></div>
      <h4>${esc(item.title)}</h4>
      <div class="detail-grid">
        ${row('所属书目', `${item.book_name}（${item.book_id}）`)}
        ${row('章节序号', `第 ${item.chapter_no} 章`)}
        ${row('页码定位', item.page_range)}
        ${row('来源', item.source)}
        ${row('权威等级', authorityClaimLabel(item.authority_claim))}
        ${row('采集日期', item.date_added)}
        ${row('内容哈希', item.shash256 ? `${item.shash256.slice(0, 16)}…` : '—')}
        ${row('权利状态', `${item.rights === 'restricted' ? '受限（restricted）' : item.rights}`)}
        ${row('允许用途', item.allowed_usage)}
        ${row('处理状态', item.processing_status)}
        ${row('审核状态', item.review_status)}
      </div>
      <div class="detail-note">正文内容受使用限制（${esc(item.allowed_usage || '未登记')}），本页仅提供目录级著录信息；全部条目未经独立人工审核，权威等级为原始声明而非认定结论；原始来源系统为内部志书库，其 URL 未获对外披露授权，故不提供可点击链接，来源定位以上方书目 ID、章节序号与页码为准。</div>
      <div class="detail-actions">
        <button class="primary-btn archive-back" type="button">← 返回检索列表</button>
      </div>
      <div class="detail-proof">来源回查凭据：shash256=${esc(item.shash256 || '未登记')} · 记录 ID ${esc(item.id)}（凭主仓清洗层比对）</div>
    </article>`;
  list.querySelector('.archive-back')?.addEventListener('click', () => { state.archiveDetail = null; renderArchiveList(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.archiveDetail) { state.archiveDetail = null; renderArchiveList(); }
  });
}

function appendMessage(role, content, extra = '') {
  const log = document.querySelector('#chat-log');
  const div = document.createElement('div');
  div.className = role === 'user' ? 'user-message' : 'assistant-message';
  div.textContent = content;
  log.appendChild(div);
  if (extra) { const source = document.createElement('div'); source.className = 'source-box'; source.innerHTML = extra; log.appendChild(source); }
  log.scrollTop = log.scrollHeight;
  return div;
}

function renderSources(data) {
  const sources = Array.isArray(data?.sources) ? data.sources : [];
  const evidence = Array.isArray(data?.evidence) ? data.evidence : [];
  const related = Array.isArray(data?.related) ? data.related : [];
  if (!sources.length && !evidence.length && !related.length) return '';
  const sourceItems = sources.map((item) => `<li><span class="grade-badge">${esc(gradeLabel(item.grade))}</span><span>${esc(item.title || item.name || item.id || '未命名来源')}</span></li>`).join('');
  const evidenceItems = evidence.map((item) => `<li>${esc(item.title || item.text || item.id || item)}</li>`).join('');
  const relatedItems = related.map((item) => `<li>${esc(item.title || item.name || item.id || item)}</li>`).join('');
  return `<div class="sources-title">回答依据与关联内容</div>${sourceItems ? `<strong>参考来源</strong><ul>${sourceItems}</ul>` : ''}${evidenceItems ? `<strong>证据片段</strong><ul>${evidenceItems}</ul>` : ''}${relatedItems ? `<strong>相关内容</strong><ul>${relatedItems}</ul>` : ''}`;
}

async function ask(question) {
  const text = String(question || '').trim();
  if (!text) return;
  appendMessage('user', text);
  state.conversation.push({ role: 'user', content: text });
  if (!API_BASE || state.service.ai !== 'configured') {
    appendMessage('assistant', '智能服务接入位已就绪，但当前没有可调用的真实模型服务。请在部署环境配置 API 地址后再进行现场问答。');
    return;
  }
  const pending = appendMessage('assistant', '正在查询…');
  try {
    const data = await api('/api/v1/yimeng/ai/chat', { method: 'POST', body: JSON.stringify({ message: text, messages: state.conversation, session_id: state.sessionId }) });
    if (data?.session_id) state.sessionId = data.session_id;
    const answer = data?.answer || data?.content || data?.message || '服务已返回，但未包含可展示回答。';
    pending.textContent = answer;
    state.conversation.push({ role: 'assistant', content: answer });
    const sources = renderSources(data);
    if (sources) {
      const source = document.createElement('div');
      source.className = 'source-box';
      source.innerHTML = sources;
      document.querySelector('#chat-log').appendChild(source);
    }
  } catch (error) {
    pending.textContent = '智能服务调用失败，请检查服务地址、健康状态和接口契约。';
  }
}

async function loadArchiveSnapshot() {
  // 目录级快照经 facade 加载；失败 fail-closed（不仍充在线库，不降级到伪数据）
  try {
    const data = await fetchArchiveSnapshot();
    state.archiveItems = data.items;
    state.snapshotMeta = data.meta || {};
    state.service.archives = 'snapshot';
  } catch (error) {
    state.snapshotError = String(error?.message || error);
    state.service.archives = 'not-configured';
  }
}

async function checkServices() {
  const now = new Date();
  state.service.checkedAt = now;
  if (!API_BASE) {
    state.service.health = 'not-configured';
    state.service.ai = 'not-configured';
    await loadArchiveSnapshot();
    updateServiceLabels(); renderArchiveList(); return;
  }
  try { await api('/health'); state.service.health = 'ready'; } catch { state.service.health = 'error'; }
  try { const data = await api('/api/v1/yimeng/archives?page=1&page_size=4'); state.service.archives = 'ready'; state.archiveItems = Array.isArray(data?.items) ? data.items : []; } catch { state.service.archives = 'error'; }
  state.service.ai = 'configured';
  updateServiceLabels(); renderArchiveList();
}

function stateLabel(value) {
  return { ready: '已连接', configured: '已配置', snapshot: '目录快照', error: '不可用', 'not-configured': '未配置', unknown: '检测中…' }[value] || '待检查';
}

function updateServiceLabels() {
  const serviceLabel = API_BASE ? `运行检查：${stateLabel(state.service.health)}` : '服务未配置';
  const global = document.querySelector('#global-service-state');
  if (global) global.innerHTML = statusBadge(serviceLabel, state.service.health === 'ready' ? 'ready' : 'pending');
  const hero = document.querySelector('#hero-service-state');
  if (hero) hero.textContent = serviceLabel;
  const ai = document.querySelector('#ai-service-state');
  if (ai) ai.textContent = `智能服务：${stateLabel(state.service.ai)}`;
  const data = document.querySelector('#verification-data');
  if (data) data.textContent = stateLabel(state.service.archives);
  const archiveState = document.querySelector('#archive-state');
  if (archiveState) {
    if (state.service.archives === 'snapshot' && state.snapshotMeta) {
      const books = Array.isArray(state.snapshotMeta.books) ? state.snapshotMeta.books.map((b) => `${b.name}（${b.chapters}章）`).join('；') : '';
      archiveState.innerHTML = `${statusBadge('真实目录快照 · 非在线库 · 未独立审核', 'ready')}<span>生成于 ${esc(String(state.snapshotMeta.generated_at || '').slice(0, 10))}，来自 ${esc(state.snapshotMeta.source_dataset || '清洗层')}：${esc(books)}。${esc(state.snapshotMeta.scope_note || '')}${state.snapshotMeta.counting_note ? ` 计数口径：${esc(state.snapshotMeta.counting_note)}` : ''}</span>`;
    } else if (state.snapshotError) {
      archiveState.innerHTML = `${statusBadge('快照加载失败', 'pending')}<span>目录快照不可用（${esc(state.snapshotError)}），档案区按无数据处理；恢复步骤见 apps/web-yimeng/README.md。</span>`;
    } else {
      archiveState.textContent = API_BASE ? '正在检测数据服务…' : '未配置正式档案服务；如存在本地目录快照将在加载后显示。';
    }
  }
  const aiState = document.querySelector('#verification-ai');
  if (aiState) aiState.textContent = stateLabel(state.service.ai);
  const time = document.querySelector('#verification-time');
  if (time) time.textContent = state.service.checkedAt ? state.service.checkedAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '尚未检查';
}

function wireInteractions() {
  document.querySelector('#menu-toggle')?.addEventListener('click', () => document.querySelector('#site-nav')?.classList.toggle('open'));
  document.querySelectorAll('#site-nav a').forEach((link) => link.addEventListener('click', () => document.querySelector('#site-nav')?.classList.remove('open')));
  document.querySelectorAll('[data-archive-filter]').forEach((button) => button.addEventListener('click', () => { state.archiveFilter = button.dataset.archiveFilter; document.querySelectorAll('[data-archive-filter]').forEach((item) => item.classList.toggle('active', item === button)); renderArchiveList(); }));
  document.querySelector('#archive-query')?.addEventListener('input', (event) => { state.archiveQuery = event.target.value; renderArchiveList(); });
  document.querySelector('#archive-search')?.addEventListener('click', renderArchiveList);
  document.querySelectorAll('[data-knowledge]').forEach((button) => button.addEventListener('click', () => { state.currentKnowledge = button.dataset.knowledge; document.querySelectorAll('[data-knowledge]').forEach((item) => item.classList.toggle('active', item === button)); renderKnowledgePanel(); }));
  document.querySelector('#chat-form')?.addEventListener('submit', (event) => { event.preventDefault(); const input = document.querySelector('#chat-input'); const value = input.value; input.value = ''; ask(value); });
  document.querySelectorAll('.suggestions button').forEach((button) => button.addEventListener('click', () => ask(button.dataset.question)));
}

shell();
