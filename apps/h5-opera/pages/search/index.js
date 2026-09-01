import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const input = document.getElementById('q');
const results = document.getElementById('results');
const empty = document.getElementById('empty');
const historyWrap = document.getElementById('history');

// ---- 搜索历史（localStorage，最多 8 条） ----
const HIST_KEY = 'opera_h5_search_history';
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch { return []; }
}
function saveHistory(list) {
  try { localStorage.setItem(HIST_KEY, JSON.stringify(list.slice(0, 8))); } catch { /* 隐私模式忽略 */ }
}
function pushHistory(q) {
  if (!q) return;
  const list = loadHistory().filter((x) => x !== q);
  list.unshift(q);
  saveHistory(list);
  renderHistory();
}
function renderHistory() {
  if (!historyWrap) return;
  const list = loadHistory();
  historyWrap.innerHTML = list.length
    ? `<span class="hist-label">最近搜索</span>` + list.map((q) => `<span class="hist-chip" data-q="${esc(q)}">${esc(q)}</span>`).join('') + `<span class="hist-clear" id="hist-clear">清空</span>`
    : '';
  historyWrap.querySelectorAll('.hist-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.q;
      input.value = q;
      search(q);
    });
  });
  const clear = historyWrap.querySelector('#hist-clear');
  if (clear) clear.addEventListener('click', () => { saveHistory([]); renderHistory(); });
}

// ---- 检索 ----
const source = { Work: [], Artist: [], Organization: [], Event: [], Video: [], News: [] };
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
  if (!q) { results.innerHTML = ''; empty.style.display = 'block'; if (historyWrap) historyWrap.style.display = 'flex'; return; }
  empty.style.display = 'none';
  if (historyWrap) historyWrap.style.display = 'none';
  pushHistory(q);
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
    return `<a class="card" href="../${page}/index.html?id=${encodeURIComponent(h.id)}">
      <div><span class="badge">${esc(h.label)}</span></div>
      <div class="title">${esc(h.title)}</div>
      <div class="summary">${esc(h.summary.slice(0, 80))}</div>
    </a>`;
  }).join('');
}

renderHistory();
input.addEventListener('input', (e) => {
  const v = e.target.value.trim();
  if (!v) search('');
});
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') search(input.value.trim()); });