const news = [
  { title: '沂蒙小戏小剧展演即将启幕', category: '展演资讯', date: '2026-08-29', summary: '一批优秀小戏小剧作品将集中亮相，带您走近沂蒙地方文艺创作。' },
  { title: '精品小戏小剧作品展播上线', category: '剧目动态', date: '2026-08-27', summary: '平台持续汇集优秀剧目与舞台影像，集中展示创作成果。' },
  { title: '媒体聚焦沂蒙小戏小剧的传承与创新', category: '媒体报道', date: '2026-08-25', summary: '从地方文化传播视角关注小戏小剧创作、演出与传播。' }
];
const works = [
  { title: '沂蒙山小调', tag: '精品剧目', org: '沂蒙艺术团' },
  { title: '红嫂情', tag: '红色题材', org: '临沂地方戏剧团' }
];
const events = [
  { title: '2026沂蒙小戏小剧展演', start: '2026-09-05 19:30', place: '临沂文化艺术中心' },
  { title: '小戏小剧展演·红色专场', start: '2026-09-12 19:30', place: '临沂剧院' }
];
const videos = [
  { title: '沂蒙山小调·舞台精彩片段', category: '精品剧目' },
  { title: '红嫂情·演出实录', category: '演出片段' },
  { title: '小戏小剧展演现场', category: '活动现场' }
];

document.querySelector('#news-list').innerHTML = news.map(item => `
  <article class="news-item"><span>${item.category}</span><h3>${item.title}</h3><p>${item.summary}</p><time>${item.date}</time></article>`
).join('');
document.querySelector('#works-list').innerHTML = works.map(item => `
  <article class="card"><div class="poster">舞台<br/>影像</div><span>${item.tag}</span><h3>${item.title}</h3><p>${item.org}</p></article>`
).join('');
document.querySelector('#events-list').innerHTML = events.map(item => `
  <article class="event"><strong>${item.start.slice(5, 10)}</strong><div><h3>${item.title}</h3><p>${item.start} · ${item.place}</p></div></article>`
).join('');
document.querySelector('#videos-list').innerHTML = videos.map(item => `
  <article class="card"><div class="video-placeholder">▶</div><span>${item.category}</span><h3>${item.title}</h3></article>`
).join('');
