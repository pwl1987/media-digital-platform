import './style.css';

const news = [
  { id: 'news-001', tag: '官方资讯', title: '2026沂蒙小戏小剧展演工作持续推进', summary: '汇聚精品剧目、优秀创作与舞台力量，持续讲好沂蒙故事。', source: '沂蒙小戏小剧官方平台', date: '2026-08-29', body: '围绕精品创作、展演推广和全媒体传播，平台持续发布小戏小剧相关官方资讯与舞台内容。' },
  { id: 'news-002', tag: '剧目动态', title: '红色题材小戏作品集中亮相', summary: '从优秀作品中感受地方文化与时代精神的交融。', source: '沂蒙小戏小剧官方平台', date: '2026-08-28', body: '一批红色题材小戏作品集中亮相，平台将持续推出剧目介绍和精彩影像。' },
  { id: 'news-003', tag: '媒体报道', title: '聚焦沂蒙小戏小剧：让好作品走近更多观众', summary: '通过舞台、影像与全媒体传播持续扩大品牌影响力。', source: '媒体报道', date: '2026-08-27', body: '相关媒体持续关注小戏小剧传承创新与传播实践。' }
];
const works = [
  { title: '沂蒙山小调', tag: '精品剧目', org: '沂蒙艺术团' },
  { title: '红嫂情', tag: '红色题材', org: '临沂地方戏剧团' },
  { title: '乡音里的沂蒙', tag: '地方戏', org: '沂蒙文化艺术团队' }
];
const events = [
  { title: '2026沂蒙小戏小剧展演', meta: '2026-09-05 · 临沂文化艺术中心' },
  { title: '红色题材精品专场', meta: '2026-09-12 · 临沂剧院' }
];
const esc = (value) => String(value).replace(/[&<>\"']/g, (ch) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;' }[ch]));

function renderHome() {
  document.querySelector('#app').innerHTML = `
    <header class="site-header"><div class="wrap nav"><div class="brand">沂蒙小戏小剧<span>官方宣传平台</span></div><nav><a href="./index.html">首页</a><a href="#news">资讯</a><a href="#works">剧目</a><a href="#videos">视频</a><a href="#events">展演</a><a href="#topics">专题</a></nav><div class="search">搜索新闻、剧目、演员、活动</div></div></header>
    <main>
      <section class="hero"><div class="wrap hero-inner"><div><div class="eyebrow">YIMENG OPERA · OFFICIAL</div><h1>让好戏被看见<br/>让沂蒙故事被传播</h1><p>权威发布小戏小剧最新资讯、精品剧目、展演动态与舞台影像。</p><a class="hero-link" href="#news">浏览最新资讯 →</a></div><div class="hero-art">小<br/>戏<br/>小<br/>剧</div></div></section>
      <section id="news" class="wrap section"><div class="section-head"><h2>最新资讯</h2><a href="#news">更多资讯 →</a></div><div class="news-grid">${news.map((n,i)=>`<article class="news ${i===0?'lead':''}"><div class="thumb">${i===0?'重点报道':'官方资讯'}</div><div class="tag">${esc(n.tag)}</div><h3><a href="./index.html?news=${encodeURIComponent(n.id)}">${esc(n.title)}</a></h3><p>${esc(n.summary)}</p><small>${esc(n.source)} · ${esc(n.date)}</small></article>`).join('')}</div></section>
      <section id="works" class="tone section"><div class="wrap"><div class="section-head"><h2>精品剧目</h2><a href="#works">浏览全部 →</a></div><div class="work-grid">${works.map(w=>`<article class="work"><div class="poster">舞台<br/>影像</div><div class="tag">${esc(w.tag)}</div><h3>${esc(w.title)}</h3><p>${esc(w.org)}</p></article>`).join('')}</div></div></section>
      <section id="events" class="wrap section"><div class="split"><div><div class="section-head"><h2>近期展演</h2><a href="#events">全部活动 →</a></div>${events.map(e=>`<article class="event"><strong>${esc(e.title)}</strong><span>${esc(e.meta)}</span><b>→</b></article>`).join('')}</div><aside id="topics" class="feature"><div class="eyebrow">专题策划</div><h2>一台好戏，讲好沂蒙故事</h2><p>汇集专题报道、幕后花絮、人物访谈与舞台影像。</p><a class="hero-link" href="#topics">进入专题 →</a></aside></div></section>
      <section id="videos" class="tone section"><div class="wrap"><div class="section-head"><h2>精彩视频</h2><a href="#videos">更多视频 →</a></div><div class="work-grid">${['沂蒙山小调·舞台精彩片段','红嫂情·演出实录','小戏小剧展演现场'].map((v,i)=>`<article class="work"><div class="poster">▶</div><div class="tag">${i===0?'精品剧目':i===1?'演出片段':'活动现场'}</div><h3>${esc(v)}</h3><p>官方舞台影像</p></article>`).join('')}</div></div></section>
    </main><footer><div class="wrap">沂蒙小戏小剧官方宣传平台 · 内容由统一数字内容平台提供</div></footer>`;
}

function renderNewsDetail(item) {
  document.querySelector('#app').innerHTML = `
    <header class="site-header"><div class="wrap nav"><div class="brand">沂蒙小戏小剧<span>官方宣传平台</span></div><nav><a href="./index.html">首页</a><a href="./index.html#news">资讯</a><a href="./index.html#works">剧目</a><a href="./index.html#videos">视频</a><a href="./index.html#events">展演</a></nav></div></header>
    <main><article class="detail wrap"><a class="back" href="./index.html#news">← 返回资讯</a><div class="official-badge">官方资讯</div><h1>${esc(item.title)}</h1><div class="detail-meta">${esc(item.source)} · ${esc(item.date)}</div><p class="detail-summary">${esc(item.summary)}</p><div class="detail-body"><p>${esc(item.body)}</p><p>本平台持续聚合小戏小剧新闻稿件、剧目资料、展演信息与舞台影像，方便公众在不同渠道了解官方发布内容。</p></div><section class="detail-relations"><h2>相关内容</h2><a href="./index.html#works">精品剧目</a><a href="./index.html#events">近期展演</a><a href="./index.html#videos">精彩视频</a></section></article></main><footer><div class="wrap">沂蒙小戏小剧官方宣传平台</div></footer>`;
}

const newsId = new URLSearchParams(location.search).get('news');
const selected = newsId ? news.find((item) => item.id === newsId) : null;
selected ? renderNewsDetail(selected) : renderHome();
