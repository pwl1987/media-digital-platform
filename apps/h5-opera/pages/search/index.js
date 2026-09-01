import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const input = document.getElementById('q');
const results = document.getElementById('results');
const empty = document.getElementById('empty');

const source = {
  Work: [], Artist: [], Organization: [], Event: [], Video: [], News: []
};
const LABELS = { Work: '剧目', Artist: '演员', Organization: '剧团', Event: '活动', Video: '影像', News: '资讯' };
const ROUTES = { Work: 'work-detail', Artist: 'artist-detail', Organization: 'organization-detail', Event: 'event-detail', Video: 'video-detail', News: 'news-detail' };

const [works, artists, orgs, events, videos, news] = await Promise.all([
  api.getWorks(), api.getArtists(), api.getOrganizations(), api.getEvents(), api.getVideos(), api.getNews({ pageSize: 50 })
]);
source.Work = (works.data && works.data.items) || [];
source.Artist = (artists.data && artists.data.items) || [];
source.Organization = (orgs.data && orgs.data.items) || [];
source.Event = (events.data && events.data.items) || [];
source.Video = (videos.data && videos.data.items) || [];
source.News = (news.data && news.data.items) || [];

function search(q) {
  if (!q) { results.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  const lower = q.toLowerCase();
  const hits = [];
  Object.keys(source).forEach((type) => {
    source[type].forEach((x) => {
      if (`${x.title || ''} ${x.summary || ''}`.toLowerCase().includes(lower)) {
        hits.push({ id: x.id, type, title: x.title, summary: x.summary || x.desc || '', label: LABELS[type] });
      }
    });
  });
  if (!hits.length) { results.innerHTML = `<div class="state"><span class="emoji">🔍</span>没有找到相关结果</div>`; return; }
  results.innerHTML = hits.slice(0, 20).map((h) => {
    const page = ROUTES[h.type];
    return `<a class="card" href="../${page}/index.html?id=${encodeURIComponent(h.id)}" style="display:block;color:inherit">
      <span class="badge">${esc(h.label)}</span>
      <div class="title">${esc(h.title)}</div>
      <div class="summary">${esc(h.summary.slice(0, 80))}</div>
    </a>`;
  }).join('');
}

input.addEventListener('input', (e) => search(e.target.value.trim()));