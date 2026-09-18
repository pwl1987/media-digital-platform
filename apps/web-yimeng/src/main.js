import './style.css';

const config = window.YIMENG_DEMO_CONFIG || {};
const API_BASE = String(config.apiBase || '').replace(/\/$/, '');

const stages = [
  {
    code: '01',
    title: '红色文化数据治理',
    status: '已形成阶段性能力',
    desc: '已具备来源登记、批量导入、内容清洗、重复检测、质量检查和版本追溯等基础能力。',
    points: ['来源与权利状态记录', '文本与图片清洗', '重复检测与质量检查', '数据分层与版本管理']
  },
  {
    code: '02',
    title: '模型与智能服务',
    status: '已形成阶段性能力',
    desc: '已完成基础模型服务、领域适配、多轮问答和多模态交互等研发验证，并预留统一服务接口。',
    points: ['模型服务接口', '领域训练与适配', '多轮问答', '图文多模态交互']
  },
  {
    code: '03',
    title: '数字档案与知识组织',
    status: '持续完善',
    desc: '已形成史料、人物、故事、时间轴、来源引用等领域结构，档案检索和引用回链持续完善。',
    points: ['史料著录', '人物与故事关联', '历史时间轴', '来源引用与回链']
  },
  {
    code: '04',
    title: '多端应用与传播',
    status: '持续完善',
    desc: '已建设微信小程序等公众体验端，本门户用于集中展示阶段成果并承载后续 PC 端演示。',
    points: ['沂蒙精神小程序', '数字展馆', '智能服务入口', 'PC 阶段成果门户']
  }
];

const verificationItems = [
  ['数据资源处理', '来源登记、导入、清洗、去重、质量检查', '可核验'],
  ['领域模型能力', '领域适配训练、模型服务、接口调用', '可核验'],
  ['智能问答', '多轮问答、来源与证据展示接口', '可核验'],
  ['数字档案', '史料列表、详情、筛选、引用关系', '可核验'],
  ['应用系统', '小程序、智能问答原型、PC 演示门户', '可核验'],
  ['测试资料', '功能测试、接口测试、训练验证和阶段报告', '可核验']
];

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

async function api(path, options = {}) {
  if (!API_BASE) throw new Error('API_NOT_CONFIGURED');
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) throw new Error(`HTTP_${response.status}`);
  const payload = await response.json();
  if (payload && payload.error) throw new Error(payload.error.message || payload.error.code || 'API_ERROR');
  return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload;
}

function renderStageCards() {
  return stages.map((stage) => `
    <article class="stage-card">
      <div class="stage-top">
        <span class="stage-code">${esc(stage.code)}</span>
        <span class="status-pill">${esc(stage.status)}</span>
      </div>
      <h3>${esc(stage.title)}</h3>
      <p>${esc(stage.desc)}</p>
      <ul>${stage.points.map((point) => `<li>${esc(point)}</li>`).join('')}</ul>
    </article>
  `).join('');
}

function renderVerificationRows() {
  return verificationItems.map(([name, evidence, status]) => `
    <div class="verify-row">
      <strong>${esc(name)}</strong>
      <span>${esc(evidence)}</span>
      <b>${esc(status)}</b>
    </div>
  `).join('');
}

function shell() {
  document.querySelector('#app').innerHTML = `
    <header class="site-header">
      <div class="wrap nav">
        <a class="brand" href="#top">
          <span class="brand-mark">沂</span>
          <span><strong>沂蒙精神数字传承平台</strong><small>YIMENG SPIRIT · DIGITAL HERITAGE</small></span>
        </a>
        <nav>
          <a href="#overview">建设成果</a>
          <a href="#archive">数字档案</a>
          <a href="#ai">智能服务</a>
          <a href="#verification">成果核验</a>
        </nav>
        <span class="stage-label">${esc(config.projectStage || '阶段性研发成果')}</span>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div class="wrap hero-grid">
          <div>
            <div class="eyebrow">数字文化 · 红色文化智能传播</div>
            <h1>让红色文化资源<br/>可整理、可检索、可理解、可传播</h1>
            <p>围绕沂蒙精神红色文化资源数字化、人工智能模型、知识组织和多端应用，形成可持续建设的数字传承平台。</p>
            <div class="hero-actions">
              <a class="primary-btn" href="#overview">查看阶段成果</a>
              <a class="ghost-btn" href="#ai">体验智能服务</a>
            </div>
          </div>
          <div class="hero-panel">
            <div class="hero-panel-title">阶段建设脉络</div>
            <div class="timeline-step"><b>资源</b><span>红色文化数据采集与治理</span></div>
            <div class="timeline-step"><b>智能</b><span>模型服务与领域能力适配</span></div>
            <div class="timeline-step"><b>知识</b><span>史料、人物、故事与关系组织</span></div>
            <div class="timeline-step"><b>应用</b><span>小程序、数字展馆与公众服务</span></div>
          </div>
        </div>
      </section>

      <section id="overview" class="wrap section">
        <div class="section-head">
          <div><span class="section-kicker">PROJECT PROGRESS</span><h2>阶段建设成果</h2></div>
          <p>展示当前已经形成的研发能力和可核验的软件成果，不以规划内容替代实际完成内容。</p>
        </div>
        <div class="stage-grid">${renderStageCards()}</div>
      </section>

      <section id="archive" class="soft section">
        <div class="wrap">
          <div class="section-head">
            <div><span class="section-kicker">DIGITAL ARCHIVE</span><h2>红色文化数字档案</h2></div>
            <p>接入正式数据服务后，可在此展示经审核确认的史料、人物、故事、时间轴和来源引用。</p>
          </div>
          <div class="archive-layout">
            <div class="archive-panel">
              <div class="panel-title">档案服务状态</div>
              <div id="archive-state" class="service-state">正在检测数据服务…</div>
              <div id="archive-list" class="archive-list"></div>
            </div>
            <aside class="archive-aside">
              <div class="aside-label">数据治理原则</div>
              <h3>来源可追溯，事实可核验</h3>
              <p>正式资源应保留来源、权利状态、审核状态和引用信息；未经确认的数据不作为正式史实对外发布。</p>
              <div class="flow">
                <span>来源登记</span><i>→</i><span>整理加工</span><i>→</i><span>人工审核</span><i>→</i><span>发布使用</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="ai" class="wrap section">
        <div class="section-head">
          <div><span class="section-kicker">AI SERVICE</span><h2>沂蒙精神智能服务</h2></div>
          <p>演示入口调用统一智能服务接口；未接入模型服务时不生成模拟回答。</p>
        </div>
        <div class="ai-shell">
          <div class="ai-intro">
            <span class="ai-badge">AI</span>
            <h3>从可靠资料出发回答问题</h3>
            <p>支持领域问答、多轮交互，并为后续来源引用、证据回链和多模态内容理解提供统一入口。</p>
            <div class="suggestions">
              <button data-question="什么是沂蒙精神？">什么是沂蒙精神？</button>
              <button data-question="请介绍沂蒙红嫂的代表性事迹。">沂蒙红嫂代表性事迹</button>
              <button data-question="沂蒙精神有哪些时代价值？">沂蒙精神的时代价值</button>
            </div>
          </div>
          <div class="chat-card">
            <div id="chat-log" class="chat-log">
              <div class="assistant-message">请输入问题。系统将优先调用已配置的真实智能服务。</div>
            </div>
            <form id="chat-form" class="composer">
              <input id="chat-input" placeholder="输入您想了解的问题" autocomplete="off" />
              <button type="submit">发送</button>
            </form>
          </div>
        </div>
      </section>

      <section id="verification" class="verification section">
        <div class="wrap">
          <div class="section-head light">
            <div><span class="section-kicker">VERIFICATION</span><h2>阶段成果核验</h2></div>
            <p>现场核验时，可结合代码、运行系统、测试资料和项目文档逐项查看。</p>
          </div>
          <div class="verify-table">${renderVerificationRows()}</div>
          <div class="verification-note">
            <strong>说明</strong>
            <span>本页面用于展示项目阶段性研发成果。正式数据规模、资源授权、审核结论和财务投资以项目正式台账及原始凭证为准。</span>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="wrap footer-inner">
        <div><strong>沂蒙精神数字传承平台</strong><span>阶段性研发成果演示门户</span></div>
        <div>保护 · 研究 · 传播 · 传承</div>
      </div>
    </footer>
  `;

  wireInteractions();
  loadArchivePreview();
}

async function loadArchivePreview() {
  const state = document.querySelector('#archive-state');
  const list = document.querySelector('#archive-list');
  if (!API_BASE) {
    state.innerHTML = '<b>数据服务接入位已就绪</b><span>当前演示入口尚未配置正式数据服务地址。</span>';
    list.innerHTML = '';
    return;
  }
  try {
    const data = await api('/api/v1/yimeng/archives?page=1&page_size=4');
    const items = Array.isArray(data?.items) ? data.items : [];
    state.innerHTML = `<b>数据服务已连接</b><span>已读取 ${items.length} 条当前页记录。</span>`;
    list.innerHTML = items.length ? items.map((item) => `
      <article>
        <span>${esc(item.archiveType || item.type || '史料')}</span>
        <h4>${esc(item.title || '未命名资料')}</h4>
        <p>${esc(item.summary || '')}</p>
      </article>
    `).join('') : '<div class="empty-state">当前接口未返回可展示记录。</div>';
  } catch (error) {
    state.innerHTML = '<b>数据服务暂不可用</b><span>请检查部署环境中的数据服务配置。</span>';
    list.innerHTML = '';
  }
}

function appendMessage(role, content) {
  const log = document.querySelector('#chat-log');
  const div = document.createElement('div');
  div.className = role === 'user' ? 'user-message' : 'assistant-message';
  div.textContent = content;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

async function ask(question) {
  const text = String(question || '').trim();
  if (!text) return;
  appendMessage('user', text);
  if (!API_BASE) {
    appendMessage('assistant', '智能服务接入位已就绪，当前演示入口尚未配置真实模型服务。接入部署环境后可在此进行现场问答。');
    return;
  }
  appendMessage('assistant', '正在查询…');
  const log = document.querySelector('#chat-log');
  const pending = log.lastElementChild;
  try {
    const data = await api('/api/v1/yimeng/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text, session_id: null })
    });
    pending.textContent = data?.answer || '服务已返回，但未包含可展示回答。';
    if (Array.isArray(data?.sources) && data.sources.length) {
      const sources = document.createElement('div');
      sources.className = 'source-box';
      sources.textContent = `参考来源：${data.sources.map((item) => item.title || item.name || item.id).join('；')}`;
      log.appendChild(sources);
    }
  } catch (error) {
    pending.textContent = '智能服务暂不可用，请检查部署环境中的模型服务配置。';
  }
}

function wireInteractions() {
  const form = document.querySelector('#chat-form');
  const input = document.querySelector('#chat-input');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = '';
    ask(value);
  });
  document.querySelectorAll('.suggestions button').forEach((button) => {
    button.addEventListener('click', () => ask(button.dataset.question));
  });
}

shell();
