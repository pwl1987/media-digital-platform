import { createExperienceClient } from '../../runtime/client.js';
import { mountHeader, esc, getQuery, officialFooter, backBar, actionBar, bindShare } from '../../runtime/nav.js';
mountHeader();

const api = createExperienceClient();
const id = getQuery('id');
const root = document.getElementById('root');

if (!id) {
  root.innerHTML = `<div class="state"><span class="emoji">📅</span>活动未找到</div>`;
} else {
  const [eRes, perfRes, wRes] = await Promise.all([
    api.getEvent(id),
    api.getPerformances({ eventId: id }),
    api.getWorks()
  ]);
  if (eRes.error || !eRes.data) {
    root.innerHTML = `<div class="state"><span class="emoji">📡</span>活动加载失败</div>`;
  } else {
    const e = eRes.data;
    const perfs = (perfRes.data && perfRes.data.items) || [];
    const works = (wRes.data && wRes.data.items) || [];
    const relatedWorks = works.filter((w) => (e.workIds || []).includes(w.id));
    const life = e.lifecycleStatus === 'ongoing' ? '进行中' : e.lifecycleStatus === 'ended' ? '已结束' : '预告';
    const percent = e.capacity ? Math.min(100, Math.round((e.signedUp || 0) / e.capacity * 100)) : 0;
    root.innerHTML = `
      ${backBar("返回展演", "../events/index.html")}
      <section class="detail-hero">
        <span class="badge badge--gold">${esc(e.category || '展演')}</span>
        <span class="badge">${life}</span>
        <h1>${esc(e.title)}</h1>
        <div class="meta">${esc((e.startAt || '').replace('T', ' ').slice(0, 16))} · ${esc(e.place || '')} · ${e.free ? '免费' : '售票'}</div>
      </section>
      <div class="detail-body">
        <div class="body"><p>${esc(e.desc || '正式内容接入后展示。')}</p></div>
      </div>
      <div class="section-head"><h2>报名情况</h2></div>
      <div class="card">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="flex:1;height:10px;border-radius:5px;background:var(--ym-paper-deep);overflow:hidden">
            <div style="height:100%;width:${percent}%;background:linear-gradient(90deg,var(--ym-gold-500),var(--ym-red-700));border-radius:5px"></div>
          </div>
          <span style="font-size:13px;color:var(--ym-red-700);font-weight:650;font-variant-numeric:tabular-nums">${e.signedUp || 0}/${e.capacity || 0}人</span>
        </div>
      </div>
      ${perfs.length ? `<div class="section-head"><h2>演出场次</h2></div>
      <div class="grid">${perfs.map((p) => `<div class="card">
        <div class="title">${esc(p.title)}</div>
        <div class="meta">${esc((p.startAt || '').replace('T', ' ').slice(0, 16))} · ${esc(p.place || '')}</div>
      </div>`).join('')}</div>` : ''}
      ${relatedWorks.length ? `<div class="section-head"><h2>参演剧目</h2></div>
      <div class="grid">${relatedWorks.map((w) => `<a class="poster-card" href="../work-detail/index.html?id=${encodeURIComponent(w.id)}">
        <div class="poster"><span class="poster-title">${esc(w.title)}</span></div>
        <div class="poster-body">
          <div class="title">《${esc(w.title)}》</div>
          <div class="meta">${esc((w.organization && w.organization.title) || '')}</div>
        </div>
      </a>`).join('')}</div>` : ''}
      ${actionBar({ shareLabel: "分享活动" })}
      ${officialFooter()}
    `;
    bindShare('page-share-btn', { title: e.title });
  }
}