// H5 首页数据装配（同源方案零依赖）
// 走 runtime/client.js（与小程序端 packages/api-client/facade.js 同源 ESM 镜像）
import { createExperienceClient } from './runtime/client.js';

// 分享直达路由：?news=<id> / ?work=<id> / ?artist=<id> / ?organization=<id> / ?live=<id> 落到对应详情页（传播闭环）
const param = new URLSearchParams(location.search);
const newsId = param.get('news');
const workId = param.get('work');
const videoId = param.get('video');
const eventId = param.get('event');
const artistId = param.get('artist');
const orgId = param.get('organization');
const liveId = param.get('live');
if (newsId) {
  location.replace(`./pages/news-detail/index.html?id=${encodeURIComponent(newsId)}`);
  throw new Error('redirecting to news detail');
} else if (workId) {
  location.replace(`./pages/work-detail/index.html?id=${encodeURIComponent(workId)}`);
  throw new Error('redirecting to work detail');
} else if (videoId) {
  location.replace(`./pages/video-detail/index.html?id=${encodeURIComponent(videoId)}`);
  throw new Error('redirecting to video detail');
} else if (eventId) {
  location.replace(`./pages/event-detail/index.html?id=${encodeURIComponent(eventId)}`);
  throw new Error('redirecting to event detail');
} else if (artistId) {
  location.replace(`./pages/artist-detail/index.html?id=${encodeURIComponent(artistId)}`);
  throw new Error('redirecting to artist detail');
} else if (orgId) {
  location.replace(`./pages/organization-detail/index.html?id=${encodeURIComponent(orgId)}`);
  throw new Error('redirecting to organization detail');
} else if (liveId) {
  location.replace(`./pages/live-detail/index.html?id=${encodeURIComponent(liveId)}`);
  throw new Error('redirecting to live detail');
}

const api = createExperienceClient();

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function render(target, html) {
  const el = document.getElementById(target);
  if (el) el.innerHTML = html || `<div class="state">暂无内容</div>`;
}

// ---- Hero 统计 ----
function renderStats(counts) {
  const items = [
    { value: counts.news, label: '官方资讯' },
    { value: counts.works, label: '精品剧目' },
    { value: counts.videos, label: '舞台影像' },
    { value: counts.events, label: '展演活动' }
  ];
  render('hero-stats', items.map((s) => `<div class="hero-stat"><b>${s.value}</b><span>${s.label}</span></div>`).join(''));
}

// ---- 资讯卡 ----
function newsCard(n) {
  return `<a class="card" href="./pages/news-detail/index.html?id=${encodeURIComponent(n.id)}">
    <div><span class="badge ${n.sourceLevel === 'media' ? 'badge--gold' : ''}">${esc(n.sourceLevelLabel || '官方资讯')}</span><span class="badge badge--gold">${esc(n.category || '')}</span></div>
    <div class="title">${esc(n.title)}</div>
    <div class="summary">${esc(n.summary || '')}</div>
    <div class="meta">${esc(n.date || '')} · ${esc(n.sourceName || '')}</div>
  </a>`;
}

// ---- 剧目海报卡 ----
function workCard(w) {
  return `<a class="poster-card" href="./pages/work-detail/index.html?id=${encodeURIComponent(w.id)}">
    <div class="poster"><span class="poster-title">${esc(w.title)}</span></div>
    <div class="poster-body">
      <div class="title">《${esc(w.title)}》</div>
      <div class="summary">${esc(w.summary || '')}</div>
      <div class="meta">${esc((w.organization && w.organization.title) || '')}${w.tag ? ' · ' + esc(w.tag) : ''}</div>
    </div>
  </a>`;
}

// ---- 活动卡 ----
function eventCard(e) {
  const life = e.lifecycleStatus === 'ongoing' ? '进行中' : e.lifecycleStatus === 'ended' ? '已结束' : '预告';
  return `<a class="card" href="./pages/event-detail/index.html?id=${encodeURIComponent(e.id)}">
    <div><span class="badge">${esc(e.category || '展演')}</span><span class="badge badge--gold">${life}</span></div>
    <div class="title">${esc(e.title)}</div>
    <div class="summary">${esc(e.desc || '')}</div>
    <div class="meta">${esc((e.startAt || '').replace('T', ' ').slice(0, 16))} · ${esc(e.place || '')}</div>
  </a>`;
}

// ---- 影像卡（MediaCard：封面 + 播放钮 + 时长角标） ----
function videoCard(v) {
  return `<a class="media-card" href="./pages/video-detail/index.html?id=${encodeURIComponent(v.id)}">
    <div class="cover">
      <span class="cat">${esc(v.category || '影像')}</span>
      <span class="cover-glyph">${esc(v.title.slice(0, 8))}</span>
      <span class="play">▶</span>
      <span class="duration">${esc(v.durationLabel || '')}</span>
    </div>
    <div class="media-body">
      <div class="title">${esc(v.title)}</div>
      <div class="meta">${esc(v.sourceName || '')} · ${esc(v.resolution || '')}</div>
      ${v.tags && v.tags.length ? `<div class="tags">${v.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    </div>
  </a>`;
}

(async () => {
  const [nRes, wRes, eRes, vRes] = await Promise.all([
    api.getNews({ pageSize: 6 }),
    api.getWorks(),
    api.getEvents(),
    api.getVideos()
  ]);
  renderStats({
    news: (nRes.data && nRes.data.total) || (nRes.data && nRes.data.items.length) || 0,
    works: (wRes.data && wRes.data.items.length) || 0,
    videos: (vRes.data && vRes.data.items.length) || 0,
    events: (eRes.data && eRes.data.items.length) || 0
  });
  render('news-list', (nRes.data ? nRes.data.items : []).slice(0, 6).map(newsCard).join(''));
  render('works-list', (wRes.data ? wRes.data.items : []).slice(0, 6).map(workCard).join(''));
  render('events-list', (eRes.data ? eRes.data.items : []).slice(0, 4).map(eventCard).join(''));
  render('videos-list', (vRes.data ? vRes.data.items : []).slice(0, 6).map(videoCard).join(''));
})();