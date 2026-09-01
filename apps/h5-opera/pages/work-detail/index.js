import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter, backBar, actionBar, bindShare } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">🎭</span>剧目档案未找到</div>`;
} else {
  const [wRes, perfRes, newsRes, aRes] = await Promise.all([
    api.getWork(id),
    api.getPerformances({ workId: id }),
    api.getNews({ pageSize: 50 }),
    api.getArtists()
  ]);
  if (wRes.error || !wRes.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>剧目加载失败</div>`;
  } else {
    const w = wRes.data;
    const perfs = (perfRes.data && perfRes.data.items) || [];
    const relatedNews = ((newsRes.data && newsRes.data.items) || []).filter((n) => (n.relatedWorkIds || []).includes(w.id)).slice(0, 3);
    // 演员名 → 档案链接（按姓名反查 id）；剧团直接有 id
    const allArtists = (aRes.data && aRes.data.items) || [];
    const artistLink = (name) => {
      const hit = allArtists.find((a) => a.title === name);
      return hit ? `<a class="inline-link" href="../artist-detail/index.html?id=${encodeURIComponent(hit.id)}">${esc(name)}</a>` : esc(name);
    };
    const orgLink = w.organization && w.organization.id
      ? `<a class="inline-link" href="../organization-detail/index.html?id=${encodeURIComponent(w.organization.id)}">${esc(w.organization.title)}</a>`
      : esc((w.organization && w.organization.title) || '');
    root.innerHTML = `
      ${backBar("返回剧目", "../works/index.html")}
      <section class="detail-hero">
        <span class="official-badge">官方收录</span>
        <span class="badge badge--gold">${esc(w.tag || '精品剧目')}</span>
        <h1>《${esc(w.title)}》</h1>
        <div class="meta">${orgLink}${w.artists && w.artists.length ? ' · ' + w.artists.map((a) => artistLink(a.title)).join(' / ') : ''}</div>
      </section>
      ${w.summary ? `<blockquote class="detail-quote">${esc(w.summary)}</blockquote>` : ''}
      <div class="detail-body">
        <div class="body">
          ${(w.body || w.summary || '正式内容接入后展示。').split('\n').filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('')}
        </div>
      </div>
      ${perfs.length ? `<div class="section-head"><h2>演出场次</h2></div>
      <div class="grid">${perfs.map((p) => `<div class="card">
        <div class="title">${esc(p.title)}</div>
        <div class="meta">${esc((p.startAt || '').replace('T', ' ').slice(0, 16))} · ${esc(p.place || '')}</div>
      </div>`).join('')}</div>` : ''}
      ${relatedNews.length ? `<div class="section-head"><h2>相关资讯</h2></div>
      <div class="grid">${relatedNews.map((n) => `<a class="card" href="../news-detail/index.html?id=${encodeURIComponent(n.id)}">
        <div class="title">${esc(n.title)}</div>
        <div class="meta">${esc(n.date || '')} · ${esc(n.sourceName || '')}</div>
      </a>`).join('')}</div>` : ''}
      ${actionBar({ shareLabel: "分享剧目" })}
      ${officialFooter()}
    `;
    bindShare('page-share-btn', { title: `《${w.title}》` });
  }
}