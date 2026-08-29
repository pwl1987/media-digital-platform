import './style.css';

const news = [
  { tag: '官方资讯', title: '2026沂蒙小戏小剧展演工作持续推进', summary: '汇聚精品剧目、优秀创作与舞台力量，持续讲好沂蒙故事。' },
  { tag: '剧目动态', title: '红色题材小戏作品集中亮相', summary: '从优秀作品中感受地方文化与时代精神的交融。' },
  { tag: '媒体报道', title: '聚焦沂蒙小戏小剧：让好作品走近更多观众', summary: '通过舞台、影像与全媒体传播持续扩大品牌影响力。' }
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

function render() {
  document.querySelector('#app').innerHTML = `
    <header class="site-header">
      <div class="wrap nav"><div class="brand">沂蒙小戏小剧<span>官方宣传平台</span></div><nav><a>首页</a><a>资讯</a><a>剧目</a><a>视频</a><a>展演</a><a>专题</a></nav><div class="search">搜索剧目、新闻、演员、活动</div></div>
    </header>
    <main>
      <section class="hero"><div class="wrap hero-inner"><div><div class="eyebrow">YIMENG OPERA · OFFICIAL</div><h1>让好戏被看见<br/>让沂蒙故事被传播</h1><p>聚焦小戏小剧优秀作品、最新资讯、展演活动与舞台影像。</p><button>浏览最新资讯 →</button></div><div class="hero-art">小<br/>戏<br/>小<br/>剧</div></div></section>
      <section class="wrap section"><div class="section-head"><h2>最新资讯</h2><a>更多资讯 →</a></div><div class="news-grid">${news.map((n,i)=>`<article class="news ${i===0?'lead':''}"><div class="thumb">${i===0?'重点报道':'资讯'}</div><div class="tag">${n.tag}</div><h3>${n.title}</h3><p>${n.summary}</p><small>2026-08-${29-i}</small></article>`).join('')}</div></section>
      <section class="tone section"><div class="wrap"><div class="section-head"><h2>精品剧目</h2><a>浏览全部 →</a></div><div class="work-grid">${works.map(w=>`<article class="work"><div class="poster">舞台<br/>影像</div><div class="tag">${w.tag}</div><h3>${w.title}</h3><p>${w.org}</p></article>`).join('')}</div></div></section>
      <section class="wrap section"><div class="split"><div><div class="section-head"><h2>近期展演</h2><a>全部活动 →</a></div>${events.map(e=>`<article class="event"><strong>${e.title}</strong><span>${e.meta}</span><b>→</b></article>`).join('')}</div><aside class="feature"><div class="eyebrow">专题策划</div><h2>一台好戏，讲好沂蒙故事</h2><p>汇集专题报道、幕后花絮、人物访谈与舞台影像。</p><button>进入专题 →</button></aside></div></section>
    </main>
    <footer><div class="wrap">沂蒙小戏小剧官方宣传平台 · 内容由统一数字内容平台提供</div></footer>
  `;
}
render();
