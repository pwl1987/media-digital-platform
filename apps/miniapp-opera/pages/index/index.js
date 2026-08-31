// 小戏小剧官方平台 · 首页
// 结构参考成熟实践（沉浸式轮播 + 悬浮快捷入口 + 直播预告 + 海报卡），数据一律走 utils/api。
const api = require('../../utils/api');

// 播放量格式化：230300 -> 23.03万
function formatViews(views) {
  const n = Number(views || 0);
  return n >= 10000 ? `${(n / 10000).toFixed(2)}万` : `${n}`;
}

Page({
  data: {
    loading: true,
    error: false,
    // 沉浸式轮播（无图时用红金渐变海报位，结构支持 coverUrl）
    carousel: {
      autoplay: true,
      interval: 5000,
      duration: 450,
      current: 0
    },
    slides: [],
    imageErrors: {},

    // 新闻（权重 ≥60%）
    headline: null,
    newsList: [],

    // 直播预告
    liveCard: null,
    countdown: '',

    // 精品剧目（海报卡）
    works: [],

    // 四色功能瓦片（设计稿模式：棕=剧目展演 红=直播观看 橙=互动参与 蓝=文化传承）
    quickTiles: [
      { id: 'shows', label: '剧目展演', sub: '探索更多 ›', color: 'tan', target: 'works' },
      { id: 'live', label: '直播观看', sub: '探索更多 ›', color: 'red', target: 'live' },
      { id: 'join', label: '互动参与', sub: '探索更多 ›', color: 'orange', target: 'events' },
      { id: 'culture', label: '文化传承', sub: '探索更多 ›', color: 'blue', target: 'topics' }
    ],

    // 影像（视频墙）
    videos: [],

    // 热门榜单（按播放量）
    ranking: [],

    // 展演活动
    events: [],

    // 文化专题
    topics: [
      { id: 'topic-zhanbo', title: '精品剧目展播', sub: '集中展示创作成果', category: '剧目动态' },
      { id: 'topic-chancheng', title: '沂蒙戏曲传承', sub: '地方文艺的守正创新', category: '媒体报道' },
      { id: 'topic-huimin', title: '文化惠民演出', sub: '送到田间地头的舞台', category: '展演资讯' }
    ]
  },

  onLoad() {
    this.fetch();
  },

  onUnload() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  fetch() {
    Promise.all([
      api.getNews({ page: 1, pageSize: 8 }),
      api.getWorks(),
      api.getVideos(),
      api.getEvents(),
      api.getArtists()
    ])
      .then(([newsRes, worksRes, videosRes, eventsRes]) => {
        if (newsRes.error) throw new Error('news failed');
        const news = (newsRes.data && newsRes.data.items) || [];
        const headline = news.find((n) => n.featured) || news[0] || null;
        const works = ((worksRes.data && worksRes.data.items) || []).slice(0, 4);
        const allVideos = (videosRes.data && videosRes.data.items) || [];
        const videos = allVideos.slice(0, 4);
        // 热门榜单：按播放量取前 5
        const ranking = [...allVideos]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map((v, i) => ({ ...v, rank: i + 1, viewsLabel: formatViews(v.views) }));
        const events = ((eventsRes.data && eventsRes.data.items) || []).slice(0, 2);
        const liveEvent = ((eventsRes.data && eventsRes.data.items) || []).find((e) => e.lifecycleStatus === 'upcoming') || null;

        this.setData({
          loading: false,
          headline,
          newsList: news.filter((n) => n.id !== (headline && headline.id)).slice(0, 4),
          works,
          videos,
          ranking,
          events,
          liveCard: liveEvent
            ? {
                id: liveEvent.id,
                title: liveEvent.title,
                startAt: liveEvent.startAt,
                place: liveEvent.place
              }
            : null,
          slides: this.buildSlides(news, works)
        });
        this.startCountdown();
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  // 轮播位：头条新闻 + 精品剧目 + 专题（结构支持 coverUrl，平台形象位统一用 logo）
  buildSlides(news, works) {
    const LOGO = '/assets/logo.jpg';
    const slides = [];
    const headline = news.find((n) => n.featured) || news[0];
    if (headline) {
      slides.push({
        id: `slide-${headline.id}`,
        type: 'news',
        targetId: headline.id,
        coverUrl: LOGO,
        kicker: '官方发布',
        title: headline.title,
        sub: headline.summary
      });
    }
    works.slice(0, 2).forEach((w) => {
      slides.push({
        id: `slide-${w.id}`,
        type: 'work',
        targetId: w.id,
        coverUrl: LOGO,
        kicker: w.tag,
        title: `《${w.title}》`,
        sub: w.organization.title
      });
    });
    slides.push({
      id: 'slide-topic',
      type: 'topic',
      targetId: '',
      coverUrl: LOGO,
      kicker: '文化专题',
      title: '精品剧目展播',
      sub: '集中展示沂蒙小戏小剧创作成果'
    });
    return slides;
  },

  // 直播倒计时
  startCountdown() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    if (!this.data.liveCard) return;
    const tick = () => {
      const start = this.data.liveCard && new Date(this.data.liveCard.startAt).getTime();
      if (!start || Number.isNaN(start)) return;
      const diff = start - Date.now();
      if (diff <= 0) {
        this.setData({ countdown: '直播已开始' });
        clearInterval(this.countdownTimer);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      this.setData({ countdown: d > 0 ? `距开播 ${d} 天 ${h} 小时` : `距开播 ${h} 小时 ${m} 分钟` });
    };
    tick();
    this.countdownTimer = setInterval(tick, 30000);
  },

  onSwiperChange(e) {
    this.setData({ 'carousel.current': e.detail.current });
  },

  onSlideTap(e) {
    const { type, id } = e.currentTarget.dataset;
    if (type === 'news') wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${id}` });
    else if (type === 'work') wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${id}` });
  },

  onPullDownRefresh() {
    this.fetch();
    wx.stopPullDownRefresh();
  },

  goNews() { wx.switchTab({ url: '/pages/news/news' }); },
  goWorks() { wx.switchTab({ url: '/pages/works/works' }); },
  goVideos() { wx.switchTab({ url: '/pages/videos/videos' }); },
  goEvents() { wx.navigateTo({ url: '/pages/events/events' }); },
  goLive() { wx.navigateTo({ url: '/pages/live/live' }); },
  openTile(e) {
    const { target } = e.currentTarget.dataset;
    if (target === 'works') this.goWorks();
    else if (target === 'live') this.goLive();
    else if (target === 'events') this.goEvents();
    else this.openTopic({ currentTarget: { dataset: { category: '剧目动态' } } });
  },
  openRank(e) {
    wx.navigateTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` });
  },
  openNews(e) { wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${e.currentTarget.dataset.id}` }); },
  openWork(e) { wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${e.currentTarget.dataset.id}` }); },
  openVideo(e) { wx.navigateTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` }); },
  openEvent(e) { wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${e.currentTarget.dataset.id}` }); },
  openTopic(e) {
    const { category } = e.currentTarget.dataset;
    wx.switchTab({ url: '/pages/news/news' });
    if (category) {
      const pages = getCurrentPages();
      const newsPage = pages[pages.length - 1];
      if (newsPage && newsPage.applyFilter) newsPage.applyFilter(category);
    }
  },

  onShareAppMessage() {
    return { title: '沂蒙小戏小剧 · 官方数字传播平台', path: '/pages/index/index' };
  }
});
