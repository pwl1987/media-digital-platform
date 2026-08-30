// 小戏小剧官方平台 · 首页（新闻 > 宣传内容 > 视频 > 剧目，新闻权重 ≥60%）
// 视觉：OPERA_UI_VISUAL_BASELINE_V0.1 §7 分区顺序；数据走 utils/api（共享 client）
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    headline: null,
    newsList: [],
    works: [],
    videos: [],
    events: [],
    topics: [
      { id: 'topic-zhanbo', title: '精品剧目展播', sub: '集中展示创作成果', category: '剧目动态' },
      { id: 'topic-chancheng', title: '沂蒙戏曲传承', sub: '地方文艺的守正创新', category: '媒体报道' },
      { id: 'topic-huimin', title: '文化惠民演出', sub: '送到田间地头的舞台', category: '展演资讯' }
    ]
  },

  onLoad() {
    this.fetch();
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
      api.getEvents()
    ])
      .then(([newsRes, worksRes, videosRes, eventsRes]) => {
        if (newsRes.error) throw new Error('news failed');
        const news = (newsRes.data && newsRes.data.items) || [];
        const headline = news.find((n) => n.featured) || news[0] || null;
        const newsList = news.filter((n) => n.id !== (headline && headline.id)).slice(0, 4);
        const videos = ((videosRes.data && videosRes.data.items) || []).slice(0, 4);
        const works = ((worksRes.data && worksRes.data.items) || []).slice(0, 4);
        const events = ((eventsRes.data && eventsRes.data.items) || []).slice(0, 2);
        this.setData({ loading: false, headline, newsList, works, videos, events });
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  onPullDownRefresh() {
    this.fetch();
    wx.stopPullDownRefresh();
  },

  goNews() { wx.switchTab({ url: '/pages/news/news' }); },
  goWorks() { wx.switchTab({ url: '/pages/works/works' }); },
  goVideos() { wx.switchTab({ url: '/pages/videos/videos' }); },
  goEvents() { wx.navigateTo({ url: '/pages/events/events' }); },
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
