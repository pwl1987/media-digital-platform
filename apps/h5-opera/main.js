const content = {
  news: [
    { id: 'news-001', title: '沂蒙小戏小剧展演即将启幕', category: '展演资讯', date: '2026-08-29', source: '沂蒙小戏小剧官方平台', summary: '一批优秀小戏小剧作品将集中亮相，带您走近沂蒙地方文艺创作。', body: ['沂蒙小戏小剧展演即将启幕，平台将持续发布展演动态、剧目介绍与舞台影像。', '本次宣传内容以官方资讯、精品剧目和精彩视频为重点，方便公众及时了解最新消息。'] },
    { id: 'news-002', title: '精品小戏小剧作品展播上线', category: '剧目动态', date: '2026-08-27', source: '沂蒙小戏小剧官方平台', summary: '平台持续汇集优秀剧目与舞台影像，集中展示创作成果。', body: ['精品小戏小剧作品展播上线，欢迎关注优秀地方文艺作品。'] },
    { id: 'news-003', title: '媒体聚焦沂蒙小戏小剧的传承与创新', category: '媒体报道', date: '2026-08-25', source: '媒体报道', summary: '从地方文化传播视角关注小戏小剧创作、演出与传播。', body: ['相关媒体从传承与创新角度关注沂蒙小戏小剧发展。'] }
  ],
  works: [
    { id: 'work-001', title: '沂蒙山小调', tag: '精品剧目', org: '沂蒙艺术团' },
    { id: 'work-002', title: '红嫂情', tag: '红色题材', org: '临沂地方戏剧团' }
  ],
  events: [
    { id: 'event-001', title: '2026沂蒙小戏小剧展演', start: '2026-09-05 19:30', place: '临沂文化艺术中心' },
    { id: 'event-002', title: '小戏小剧展演·红色专场', start: '2026-09-12 19:30', place: '临沂剧院' }
  ],
  videos: [
    { id: 'video-001', title: '沂蒙山小调·舞台精彩片段', category: '精品剧目' },
    { id: 'video-002', title: '红嫂情·演出实录', category: '演出片段' },
    { id: 'video-003', title: '小戏小剧展演现场', category: '活动现场' }
  ]
};

const esc = (value) => String(value).replace(/[&<>\"']/g, (ch) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;' }[ch]));
const param = new URLSearchParams(location.search);
const newsId = param.get('news');
const selectedNews = newsId ? content.news.find((item) => item.id === newsId) : null;

function renderHome() {
  document.querySelector('#app').innerHTML = `
    <header class="site-header"><div class="brand">沂蒙小戏小剧<span>官方宣传平台</span></div><nav><a href="./index.html">首页</a><a href="./index.html#news">资讯</a><a href="./index.html#works">剧目</a><a href="./index.html#events">展演</a><a href="./index.html#videos">视频</a></nav></header>
    <main>
      <section class="hero"><p class="eyebrow">官方宣传平台</p><h1>让更多人看见沂蒙小戏小剧</h1><p>聚焦最新资讯、精品剧目、舞台影像与展演动态，记录沂蒙地方文化的精彩瞬间。</p></section>
      <section id="news" class="section"><div class="section-heading"><h2>最新资讯</h2></div><div class="news-list">${content.news.map((item) => `<article class="news-item"><span>${esc(item.category)}</span><h3><a href="./index.html?news=${encodeURIComponent(item.id)}">${esc(item.title)}</a></h3><p>${esc(item.summary)}</p><time>${esc(item.date)}</time></article>`).join('')}</div></section>
      <section id="works" class="section"><div class="section-heading"><h2>精品剧目</h2></div><div class="card-grid">${content.works.map((item) => `<article class="card"><div class="poster">舞台<br/>影像</div><span>${esc(item.tag)}</span><h3>${esc(item.title)}</h3><p>${esc(item.org)}</p></article>`).join('')}</div></section>
      <section id="events" class="section"><div class="section-heading"><h2>近期展演</h2></div><div class="event-list">${content.events.map((item) => `<article class="event"><strong>${esc(item.start.slice(5,10))}</strong><div><h3>${esc(item.title)}</h3><p>${esc(item.start)} · ${esc(item.place)}</p></div></article>`).join('')}</div></section>
      <section id="videos" class="section"><div class="section-heading"><h2>精彩视频</h2></div><div class="card-grid">${content.videos.map((item) => `<article class="card"><div class="video-placeholder">▶</div><span>${esc(item.category)}</span><h3>${esc(item.title)}</h3></article>`).join('')}</div></section>
    </main><footer>沂蒙小戏小剧官方宣传平台 · 官方内容传播入口</footer>`;
}

function renderNewsDetail(news) {
  document.querySelector('#app').innerHTML = `
    <header class="site-header"><div class="brand">沂蒙小戏小剧<span>官方宣传平台</span></div><nav><a href="./index.html">首页</a><a href="./index.html#news">资讯</a><a href="./index.html#works">剧目</a><a href="./index.html#events">展演</a><a href="./index.html#videos">视频</a></nav></header>
    <main><article class="detail"><a class="back" href="./index.html#news">← 返回资讯</a><div class="detail-badge">官方资讯</div><h1>${esc(news.title)}</h1><div class="detail-meta">${esc(news.source)} · ${esc(news.date)}</div><p class="detail-summary">${esc(news.summary)}</p><div class="detail-body">${news.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</div><div class="detail-relations"><h2>相关内容</h2><a href="./index.html#works">精品剧目</a><a href="./index.html#events">展演活动</a><a href="./index.html#videos">精彩视频</a></div><div class="share-note">本页面可直接通过微信分享传播。</div></article></main><footer>沂蒙小戏小剧官方宣传平台</footer>`;
}

if (selectedNews) renderNewsDetail(selectedNews); else renderHome();
