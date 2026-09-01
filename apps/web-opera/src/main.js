// 沂蒙小戏小剧 PC 门户（SPA-lite：首页 + query 详情路由）
// 数据走 runtime/client.js（与 H5 / 小程序同源 facade + 种子），零内联内容数据。
// 样式由 index.html <link> 引入（浏览器原生 ESM 不支持 import CSS）。
import { createExperienceClient } from '../runtime/client.js';

const api = createExperienceClient();

const esc = (v) => String(v == null ? '' : v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = (s) => (s || '').replace('T', ' ').slice(0, 16);

// ---- 详情路由：?news= / ?work= / ?video= / ?event= / ?artist= / ?organization= / ?live= ----
const param = new URLSearchParams(location.search);
const newsId = param.get('news');
const workId = param.get('work');
const videoId = param.get('video');
const eventId = param.get('event');
const artistId = param.get('artist');
const orgId = param.get('organization');
const liveId = param.get('live');

const NAV = `
  <header class="site-header">
    <div class="wrap nav">
      <a class="brand" href="./index.html">沂蒙小戏小剧<span>官方宣传门户</span></a>
      <nav>
        <a href="./index.html">首页</a>
        <a href="./index.html#news">资讯</a>
        <a href="./index.html#works">剧目</a>
        <a href="./index.html#videos">影像</a>
        <a href="./index.html#events">展演</a>
        <a href="./index.html#topics">专题</a>
      </nav>
      <form class="nav-search" action="./index.html" method="get">
        <input type="search" name="q" placeholder="搜索剧目 · 演员 · 剧团 · 影像 · 资讯" value="${esc(param.get('q') || '')}" />
        <button type="submit">⌕</button>
      </form>
    </div>
  </header>`;

const FOOTER = `
  <footer>
    <div class="wrap">沂蒙小戏小剧官方数字传播平台 · 主管单位：沂蒙小戏小剧官方平台建设工作组</div>
  </footer>`;

function detailShell({ badge, badgeGold, title, meta, quote, bodyHTML, backHref, backLabel, chainsHTML }) {
  return `
    ${NAV}
    <main>
      <article class="detail wrap">
        <a class="back" href="${backHref}">← ${backLabel}</a>
        <div class="detail-hero">
          ${badge ? `<span class="badge ${badgeGold ? 'badge--gold' : ''}">${esc(badge)}</span>` : ''}
          <h1>${esc(title)}</h1>
          ${meta ? `<div class="detail-meta">${meta}</div>` : ''}
        </div>
        ${quote ? `<blockquote class="detail-quote">${esc(quote)}</blockquote>` : ''}
        ${bodyHTML || ''}
        ${chainsHTML || ''}
        <div class="live-actions">
          <button class="live-btn live-btn--primary" id="page-share-btn">分享本页</button>
        </div>
      </article>
    </main>
    ${FOOTER}`;
}

// 统一挂载：innerHTML + 分享按钮绑定
function mount(html) {
  document.querySelector('#app').innerHTML = html;
  bindShare();
}

// 详情页分享（mount 渲染后自动绑定）
function bindShare() {
  const btn = document.getElementById('page-share-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url: location.href }); } catch { /* 用户取消 */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(location.href);
      btn.textContent = '✓ 链接已复制';
      setTimeout(() => { btn.textContent = '分享本页'; }, 1600);
    }
  });
}

function sectionHead(title, moreHref, moreLabel) {
  return `<div class="section-head"><h2>${title}</h2>${moreHref ? `<a href="${moreHref}">${moreLabel} →</a>` : ''}</div>`;
}

function notFound(what) {
  document.querySelector('#app').innerHTML = `
    ${NAV}
    <main><div class="wrap state"><span class="emoji">📡</span>${esc(what)}不存在或已下架</div></main>
    ${FOOTER}`;
}

// ---- 卡片 ----
// 注意：外层是 div（不能 <a> 套 <a>——meta 里有剧团 inline-link）；跳转链接放在海报位与标题上
function posterCard(w) {
  const orgLink = w.organization && w.organization.id ? `<a class="inline-link" href="./index.html?organization=${encodeURIComponent(w.organization.id)}">${esc(w.organization.title)}</a>` : esc((w.organization && w.organization.title) || '');
  const href = `./index.html?work=${encodeURIComponent(w.id)}`;
  return `<div class="poster-card">
    <a class="poster" href="${href}"><span class="poster-title">${esc(w.title)}</span></a>
    <div class="poster-body">
      <a class="title title-link" href="${href}">《${esc(w.title)}》</a>
      <div class="meta">${orgLink}${w.tag ? ' · ' + esc(w.tag) : ''}</div>
    </div>
  </div>`;
}

function mediaCard(v) {
  return `<a class="media-card" href="./index.html?video=${encodeURIComponent(v.id)}">
    <div class="cover">
      <span class="cat">${esc(v.category || '影像')}</span>
      <span class="cover-glyph">${esc(v.title.slice(0, 8))}</span>
      <span class="play">▶</span>
      <span class="duration">${esc(v.durationLabel || '')}</span>
    </div>
    <div class="media-body"><div class="title">${esc(v.title)}</div><div class="meta">${esc(v.sourceName || '')} · ${esc(v.resolution || '')}</div></div>
  </a>`;
}

// ---- 各类型详情 ----
async function renderNewsDetail(id) {
  const [nRes, wRes, vRes] = await Promise.all([api.getNewsDetail(id), api.getWorks(), api.getVideos()]);
  const n = nRes.data;
  if (!n) return notFound('资讯');
  const works = (wRes.data && wRes.data.items) || [];
  const videos = (vRes.data && vRes.data.items) || [];
  const rw = works.filter((w) => (n.relatedWorkIds || []).includes(w.id));
  const rv = videos.filter((v) => (n.relatedVideoIds || []).includes(v.id));
  mount(detailShell({
    badge: n.sourceLevelLabel || '官方资讯',
    title: n.title,
    meta: `${n.date || ''} · ${n.sourceName || ''} · ${n.category || ''}`,
    quote: n.summary,
    bodyHTML: `<div class="detail-body"><div class="body">${(n.body || '').split('\n').filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('')}</div></div>`,
    backHref: './index.html#news',
    backLabel: '返回资讯',
    chainsHTML: [
      rw.length ? sectionHead('相关剧目') + `<div class="poster-grid">${rw.map((w) => posterCard(w)).join('')}</div>` : '',
      rv.length ? sectionHead('相关影像') + `<div class="media-grid">${rv.map((v) => mediaCard(v)).join('')}</div>` : ''
    ].join('')
  }));
}

async function renderWorkDetail(id) {
  const [wRes, perfRes, newsRes, aRes] = await Promise.all([api.getWork(id), api.getPerformances({ workId: id }), api.getNews({ pageSize: 50 }), api.getArtists()]);
  const w = wRes.data;
  if (!w) return notFound('剧目');
  const perfs = (perfRes.data && perfRes.data.items) || [];
  const rn = ((newsRes.data && newsRes.data.items) || []).filter((n) => (n.relatedWorkIds || []).includes(w.id)).slice(0, 3);
  const allArtists = (aRes.data && aRes.data.items) || [];
  const artistLink = (name) => {
    const hit = allArtists.find((a) => a.title === name);
    return hit ? `<a class="inline-link" href="./index.html?artist=${encodeURIComponent(hit.id)}">${esc(name)}</a>` : esc(name);
  };
  const orgLink = w.organization && w.organization.id ? `<a class="inline-link" href="./index.html?organization=${encodeURIComponent(w.organization.id)}">${esc(w.organization.title)}</a>` : esc((w.organization && w.organization.title) || '');
  mount(detailShell({
    badge: w.tag || '精品剧目',
    title: `《${w.title}》`,
    meta: `${orgLink}${w.artists && w.artists.length ? ' · ' + w.artists.map((a) => artistLink(a.title)).join(' / ') : ''}`,
    quote: w.summary,
    bodyHTML: `<div class="detail-body"><div class="body">${(w.body || w.summary || '正式内容接入后展示。').split('\n').filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('')}</div></div>`,
    backHref: './index.html#works',
    backLabel: '返回剧目',
    chainsHTML: [
      perfs.length ? sectionHead('演出场次') + `<div class="grid-3">${perfs.map((p) => `<div class="card"><div class="title">${esc(p.title)}</div><div class="meta">${esc(fmtDate(p.startAt))} · ${esc(p.place || '')}</div></div>`).join('')}</div>` : '',
      rn.length ? sectionHead('相关资讯') + `<div class="grid-3">${rn.map((n) => `<a class="card" href="./index.html?news=${encodeURIComponent(n.id)}"><div class="title">${esc(n.title)}</div><div class="meta">${esc(n.date || '')} · ${esc(n.sourceName || '')}</div></a>`).join('')}</div>` : ''
    ].join('')
  }));
}

async function renderVideoDetail(id) {
  const [vRes, wRes] = await Promise.all([api.getVideo(id), api.getWorks()]);
  const v = vRes.data;
  if (!v) return notFound('影像');
  const works = (wRes.data && wRes.data.items) || [];
  const rw = works.find((w) => (w.media || []).some((m) => m.id === v.id));
  mount(`
    ${NAV}
    <main>
      <article class="detail wrap">
        <a class="back" href="./index.html#videos">← 返回影像</a>
        <div class="video-stage">
          <span class="official-badge">官方影像</span>
          <span class="cat">${esc(v.category || '影像')}</span>
          <div class="stage-title">${esc(v.title)}</div>
          <div class="play">▶</div>
          <span class="duration">${esc(v.durationLabel || '')}</span>
        </div>
        ${v.tags && v.tags.length ? `<div class="detail-tags">${v.tags.map((t) => `<span class="badge">${esc(t)}</span>`).join('')}</div>` : ''}
        <div class="detail-body"><div class="body">
          <div class="meta" style="font-size:13px;color:var(--ym-text-3);margin-bottom:14px">${esc(v.sourceName || '')} · ${esc(v.resolution || '')} · 时长 ${esc(v.durationLabel || '')}</div>
          <p>媒资接入后支持在线播放。当前为官方影像档案演示，播放源由媒体服务接入后提供。</p>
        </div></div>
        ${rw ? sectionHead('相关剧目') + `<div class="poster-grid">${posterCard(rw)}</div>` : ''}
        <div class="live-actions"><button class="live-btn live-btn--primary" id="page-share-btn">分享本页</button></div>
      </article>
    </main>
    ${FOOTER}`);
}

async function renderEventDetail(id) {
  const [eRes, perfRes, wRes] = await Promise.all([api.getEvent(id), api.getPerformances({ eventId: id }), api.getWorks()]);
  const e = eRes.data;
  if (!e) return notFound('活动');
  const perfs = (perfRes.data && perfRes.data.items) || [];
  const rws = ((wRes.data && wRes.data.items) || []).filter((w) => (e.workIds || []).includes(w.id));
  const percent = e.capacity ? Math.min(100, Math.round((e.signedUp || 0) / e.capacity * 100)) : 0;
  mount(detailShell({
    badge: e.category || '展演',
    title: e.title,
    meta: `${fmtDate(e.startAt)} · ${e.place || ''} · ${e.free ? '免费' : '售票'}`,
    bodyHTML: `<div class="detail-body"><div class="body"><p>${esc(e.desc || '正式内容接入后展示。')}</p></div></div>
      ${sectionHead('报名情况')}<div class="card sign-card"><div class="sign-bar"><div class="sign-fill" style="width:${percent}%"></div></div><span class="sign-num">${e.signedUp || 0}/${e.capacity || 0} 人</span></div>`,
    backHref: './index.html#events',
    backLabel: '返回展演',
    chainsHTML: [
      perfs.length ? sectionHead('演出场次') + `<div class="grid-3">${perfs.map((p) => `<div class="card"><div class="title">${esc(p.title)}</div><div class="meta">${esc(fmtDate(p.startAt))} · ${esc(p.place || '')}</div></div>`).join('')}</div>` : '',
      rws.length ? sectionHead('参演剧目') + `<div class="poster-grid">${rws.map((w) => posterCard(w)).join('')}</div>` : ''
    ].join('')
  }));
}

async function renderArtistDetail(id) {
  const [aRes, wRes, vRes] = await Promise.all([api.getArtist(id), api.getWorks(), api.getVideos()]);
  const a = aRes.data;
  if (!a) return notFound('演员档案');
  const name = a.title;
  const works = ((wRes.data && wRes.data.items) || []).filter((w) => (w.artists || []).some((x) => x.title === name) || (name && (w.summary || '').includes(name)));
  const titles = new Set(works.map((w) => w.title));
  const videos = ((vRes.data && vRes.data.items) || []).filter((v) => {
    if (!v.title) return false;
    for (const t of titles) if (v.title.includes(t)) return true;
    return name && v.title.includes(name);
  }).slice(0, 6);
  mount(`
    ${NAV}
    <main>
      <article class="detail wrap">
        <a class="back" href="./index.html#works">← 返回剧目</a>
        <div class="portrait-hero"><span class="official-badge">官方收录</span><div class="portrait-glyph">${esc(String(a.title || '').slice(0, 1))}</div></div>
        <div class="name-bar"><span class="name">${esc(a.title)}</span><span class="role">${esc(a.role || '演员')}</span></div>
        <div class="org-line">${esc(a.organization || '')}</div>
        ${a.honors && a.honors.length ? `<div class="honors">${a.honors.map((h) => `<span class="badge badge--gold">🏅 ${esc(h)}</span>`).join('')}</div>` : ''}
        <div class="detail-body"><div class="body"><p>${esc(a.bio || '正式内容接入后展示。')}</p></div></div>
        ${works.length ? sectionHead('代表作品') + `<div class="poster-grid">${works.map((w) => posterCard(w)).join('')}</div>` : ''}
        ${videos.length ? sectionHead('主演影像') + `<div class="media-grid">${videos.map((v) => mediaCard(v)).join('')}</div>` : ''}
        <div class="live-actions"><button class="live-btn live-btn--primary" id="page-share-btn">分享本页</button></div>
      </article>
    </main>
    ${FOOTER}`);
}

async function renderOrgDetail(id) {
  const [oRes, wRes, vRes] = await Promise.all([api.getOrganization(id), api.getWorks(), api.getVideos()]);
  const o = oRes.data;
  if (!o) return notFound('剧团档案');
  const works = ((wRes.data && wRes.data.items) || []).filter((w) => w.organization && w.organization.id === o.id);
  const titles = new Set(works.map((w) => w.title));
  const videos = ((vRes.data && vRes.data.items) || []).filter((v) => {
    if (!v.title) return false;
    for (const t of titles) if (v.title.includes(t)) return true;
    return v.title.includes(o.title || '');
  }).slice(0, 6);
  mount(`
    ${NAV}
    <main>
      <article class="detail wrap">
        <a class="back" href="./index.html#works">← 返回剧目</a>
        <div class="org-hero"><span class="official-badge">官方收录</span><div class="org-glyph">${esc(String(o.title || '').slice(0, 1))}</div></div>
        <div class="name-bar"><span class="name">${esc(o.title)}</span></div>
        <div class="org-line">官方剧团 · 资料持续补充中</div>
        <div class="detail-body"><div class="body"><p>${esc(o.summary || '正式内容接入后展示。')}</p></div></div>
        ${works.length ? sectionHead('代表剧目') + `<div class="poster-grid">${works.map((w) => posterCard(w)).join('')}</div>` : ''}
        ${videos.length ? sectionHead('院团影像') + `<div class="media-grid">${videos.map((v) => mediaCard(v)).join('')}</div>` : ''}
        <div class="live-actions"><button class="live-btn live-btn--primary" id="page-share-btn">分享本页</button></div>
      </article>
    </main>
    ${FOOTER}`);
}

async function renderLiveDetail(id) {
  const res = await api.getLive(id);
  const item = res.data;
  if (!item) return notFound('直播');
  const st = item.status === 'upcoming' ? 'scheduled' : item.status;
  mount(detailShell({
    badge: st === 'ended' ? '已结束' : st === 'live' ? '直播中' : '即将直播',
    badgeGold: st === 'ended',
    title: item.title,
    meta: `${fmtDate(item.startAt)} · ${item.place || ''}`,
    quote: item.subtitle,
    bodyHTML: `<div class="detail-body"><div class="body"><p>${st === 'ended' ? '精彩回顾 · 录播由直播服务接入后提供。' : '官方直播演示占位；开播后在此观看。'}</p></div></div>`,
    backHref: './index.html#topics',
    backLabel: '返回首页'
  }));
}

// ---- 搜索（六类检索，与 H5 同逻辑） ----
const SEARCH_LABELS = { Work: '剧目', Artist: '演员', Organization: '剧团', Event: '活动', Video: '影像', News: '资讯' };
const SEARCH_ROUTES = { Work: 'work', Artist: 'artist', Organization: 'organization', Event: 'event', Video: 'video', News: 'news' };

async function renderSearch(q) {
  const [wRes, aRes, oRes, eRes, vRes, nRes] = await Promise.all([
    api.getWorks(), api.getArtists(), api.getOrganizations(), api.getEvents(), api.getVideos(), api.getNews({ pageSize: 50 })
  ]);
  const source = {
    Work: (wRes.data && wRes.data.items) || [],
    Artist: (aRes.data && aRes.data.items) || [],
    Organization: (oRes.data && oRes.data.items) || [],
    Event: (eRes.data && eRes.data.items) || [],
    Video: (vRes.data && vRes.data.items) || [],
    News: (nRes.data && nRes.data.items) || []
  };
  const lower = q.toLowerCase();
  const hits = [];
  Object.keys(source).forEach((type) => {
    source[type].forEach((x) => {
      if (`${x.title || ''} ${x.summary || ''}`.toLowerCase().includes(lower)) {
        hits.push({ id: x.id, type, title: x.title, summary: x.summary || x.desc || '', label: SEARCH_LABELS[type] });
      }
    });
  });
  const ORDER = { Work: 0, Video: 1, News: 2, Event: 3, Artist: 4, Organization: 5 };
  hits.sort((x, y) => ORDER[x.type] - ORDER[y.type]);
  document.querySelector('#app').innerHTML = `
    ${NAV}
    <main>
      <div class="wrap detail">
        <div class="section-head"><h2>搜索“${esc(q)}”</h2></div>
        ${hits.length ? `<div class="grid-3">${hits.slice(0, 24).map((h) => `
          <a class="card" href="./index.html?${SEARCH_ROUTES[h.type]}=${encodeURIComponent(h.id)}">
            <div><span class="badge">${esc(h.label)}</span></div>
            <div class="title" style="margin-top:10px">${esc(h.title)}</div>
            <div class="meta">${esc(h.summary.slice(0, 60))}</div>
          </a>`).join('')}</div>`
        : `<div class="state"><span class="emoji">🔍</span>没有找到相关结果</div>`}
      </div>
    </main>
    ${FOOTER}`;
}

// ---- 首页 ----
async function renderHome() {
  const [nRes, wRes, eRes, vRes, lRes] = await Promise.all([api.getNews({ pageSize: 7 }), api.getWorks(), api.getEvents(), api.getVideos(), api.getLives()]);
  const news = (nRes.data && nRes.data.items) || [];
  const works = (wRes.data && wRes.data.items) || [];
  const events = (eRes.data && eRes.data.items) || [];
  const videos = (vRes.data && vRes.data.items) || [];
  const lives = (lRes.data && lRes.data.items) || [];
  const [head, ...rest] = news;
  const life = (e) => e.lifecycleStatus === 'ongoing' ? '进行中' : e.lifecycleStatus === 'ended' ? '已结束' : '预告';
  const upcoming = lives.find((x) => x.status === 'upcoming' || x.status === 'scheduled');

  document.querySelector('#app').innerHTML = `
    ${NAV}
    <main>
      <section class="hero">
        <div class="wrap hero-inner">
          <div>
            <div class="eyebrow">YIMENG OPERA · OFFICIAL</div>
            <h1>让好戏被看见<br/>让沂蒙故事被传播</h1>
            <p>权威发布小戏小剧最新资讯、精品剧目、展演动态与舞台影像。</p>
            <a class="hero-link" href="#news">浏览最新资讯 →</a>
          </div>
          <div class="hero-art">小<br/>戏<br/>小<br/>剧</div>
        </div>
      </section>

      <section id="news" class="wrap section">
        ${sectionHead('最新资讯', '#news', '更多资讯')}
        <div class="news-split">
          ${head ? `<a class="news-lead" href="./index.html?news=${encodeURIComponent(head.id)}">
            <div class="lead-cover">
              <span class="badge badge--gold">${esc(head.category || '资讯')}</span>
              <span class="lead-title">${esc(head.title)}</span>
              <span class="lead-summary">${esc(head.summary || '')}</span>
              <span class="lead-meta">${esc(head.date || '')} · ${esc(head.sourceName || '')}</span>
            </div>
          </a>` : ''}
          <div class="news-list">
            ${rest.slice(0, 5).map((n) => `<a class="news-item" href="./index.html?news=${encodeURIComponent(n.id)}">
              <div class="tag-row"><span class="badge ${n.sourceLevel === 'media' ? 'badge--gold' : ''}">${esc(n.sourceLevelLabel || '官方资讯')}</span><span class="badge badge--gold">${esc(n.category || '')}</span></div>
              <h3>${esc(n.title)}</h3>
              <p>${esc(n.summary || '')}</p>
              <small>${esc(n.date || '')} · ${esc(n.sourceName || '')}</small>
            </a>`).join('')}
          </div>
        </div>
      </section>

      ${upcoming ? `<section class="wrap" style="padding-top:36px">
        <a class="live-strip" href="./index.html?live=${encodeURIComponent(upcoming.id)}">
          <span class="ls-dot"></span>
          <span class="ls-body">
            <strong>${esc(upcoming.title)}</strong>
            <span>${esc(fmtDate(upcoming.startAt))} 开播 · ${esc(upcoming.place || '')}</span>
          </span>
          <span class="ls-go">观看直播 ›</span>
        </a>
      </section>` : ''}

      <section id="works" class="tone section">
        <div class="wrap">
          ${sectionHead('精品剧目', '#works', '浏览全部')}
          <div class="poster-grid">${works.map((w) => posterCard(w)).join('')}</div>
        </div>
      </section>

      <section id="events" class="wrap section">
        <div class="split">
          <div>
            ${sectionHead('近期展演', '#events', '全部活动')}
            <div class="event-list">
              ${events.map((e) => `<a class="event" href="./index.html?event=${encodeURIComponent(e.id)}">
                <strong>${esc(e.title)}</strong>
                <span>${esc(fmtDate(e.startAt))} · ${esc(e.place || '')}</span>
                <em>${esc(life(e))}</em>
                <b>→</b>
              </a>`).join('')}
            </div>
          </div>
          <aside id="topics" class="feature">
            <div class="eyebrow">专题策划</div>
            <h2>一台好戏，讲好沂蒙故事</h2>
            <p>汇集专题报道、幕后花絮、人物访谈与舞台影像。</p>
            <a class="hero-link" href="#videos">进入专题 →</a>
          </aside>
        </div>
      </section>

      <section id="videos" class="tone section">
        <div class="wrap">
          ${sectionHead('精彩影像', '#videos', '更多视频')}
          <div class="media-grid">${videos.slice(0, 8).map((v) => mediaCard(v)).join('')}</div>
        </div>
      </section>
    </main>
    ${FOOTER}`;
}

// ---- 路由分发 ----
const q = (param.get('q') || '').trim();
if (q) renderSearch(q);
else if (newsId) renderNewsDetail(newsId);
else if (workId) renderWorkDetail(workId);
else if (videoId) renderVideoDetail(videoId);
else if (eventId) renderEventDetail(eventId);
else if (artistId) renderArtistDetail(artistId);
else if (orgId) renderOrgDetail(orgId);
else if (liveId) renderLiveDetail(liveId);
else renderHome();