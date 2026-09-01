// H5 首页数据装配（同源方案零依赖）
// 走 runtime/client.js（与小程序端 packages/api-client/facade.js 同源 ESM 镜像）
import { createExperienceClient } from './runtime/client.js';

// 分享直达路由：?news=<id> / ?work=<id> 落到对应详情页（资讯传播闭环）
const param = new URLSearchParams(location.search);
const newsId = param.get('news');
const workId = param.get('work');
const videoId = param.get('video');
const eventId = param.get('event');
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
}

const api = createExperienceClient();

function cardHTML({ title, summary, badge, meta, href }) {
  return `<a class="card" href="${href}" style="display:block;color:inherit">
    ${badge ? `<span class="badge">${badge}</span>` : ''}
    <div class="title">${title}</div>
    ${summary ? `<div class="summary">${summary}</div>` : ''}
    ${meta ? `<div class="meta">${meta}</div>` : ''}
  </a>`;
}

function render(target, html) {
  const el = document.getElementById(target);
  if (el) el.innerHTML = html || `<div class="state">暂无内容</div>`;
}

async function loadNews() {
  const res = await api.getNews({ pageSize: 6 });
  if (res.error || !res.data) { render('news-list', `<div class="state">资讯加载失败</div>`); return; }
  const items = res.data.items.slice(0, 6).map((n) => cardHTML({
    title: n.title,
    summary: n.summary || '',
    badge: n.sourceLevelLabel || '官方资讯',
    meta: `${n.date || ''} · ${n.sourceName || ''}`,
    href: `./pages/news-detail/index.html?id=${encodeURIComponent(n.id)}`
  })).join('');
  render('news-list', items);
}

async function loadWorks() {
  const res = await api.getWorks();
  if (res.error || !res.data) { render('works-list', `<div class="state">剧目加载失败</div>`); return; }
  const items = res.data.items.slice(0, 6).map((w) => cardHTML({
    title: `《${w.title}》`,
    summary: w.summary || '',
    badge: w.tag || '精品剧目',
    meta: (w.organization && w.organization.title) || '',
    href: `./pages/work-detail/index.html?id=${encodeURIComponent(w.id)}`
  })).join('');
  render('works-list', items);
}

async function loadEvents() {
  const res = await api.getEvents();
  if (res.error || !res.data) { render('events-list', `<div class="state">活动加载失败</div>`); return; }
  const items = res.data.items.slice(0, 6).map((e) => cardHTML({
    title: e.title,
    summary: e.desc || '',
    badge: e.category || '展演',
    meta: `${e.startAt || ''} · ${e.place || ''}`,
    href: `./pages/event-detail/index.html?id=${encodeURIComponent(e.id)}`
  })).join('');
  render('events-list', items);
}

async function loadVideos() {
  const res = await api.getVideos();
  if (res.error || !res.data) { render('videos-list', `<div class="state">影像加载失败</div>`); return; }
  const items = res.data.items.slice(0, 6).map((v) => cardHTML({
    title: v.title,
    summary: v.tags ? v.tags.join(' · ') : '',
    badge: v.category || '影像',
    meta: `${v.sourceName || ''} · ${v.resolution || ''} · ${v.durationLabel || ''}`,
    href: `./pages/video-detail/index.html?id=${encodeURIComponent(v.id)}`
  })).join('');
  render('videos-list', items);
}

(async () => {
  await Promise.all([loadNews(), loadWorks(), loadEvents(), loadVideos()]);
})();