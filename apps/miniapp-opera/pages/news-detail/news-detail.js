// 新闻详情：传播核心页（正文 + 相关剧目 + 精彩视频 + 推荐阅读 = 传播闭环）
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    news: null,
    paragraphs: [],
    relatedWorks: [],
    relatedVideos: [],
    moreNews: []
  },

  onLoad(options) {
    if (!options.id) {
      this.setData({ loading: false, error: true });
      return;
    }
    this.id = options.id;
    this.load();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.load();
  },

  load() {
    Promise.all([
      api.getNewsDetail(this.id),
      api.getWorks(),
      api.getVideos(),
      api.getNews({ page: 1, pageSize: 20 })
    ])
      .then(([detailRes, worksRes, videosRes, newsRes]) => {
        if (detailRes.error || !detailRes.data) throw new Error('not found');
        const news = detailRes.data;
        const works = (worksRes.data && worksRes.data.items) || [];
        const videos = (videosRes.data && videosRes.data.items) || [];
        const allNews = (newsRes.data && newsRes.data.items) || [];

        wx.setNavigationBarTitle({ title: '官方资讯' });
        this.setData({
          loading: false,
          news,
          paragraphs: String(news.body || news.summary || '').split('\n').filter(Boolean),
          relatedWorks: (news.relatedWorkIds || []).map((id) => works.find((w) => w.id === id)).filter(Boolean),
          relatedVideos: (news.relatedVideoIds || []).map((id) => videos.find((v) => v.id === id)).filter(Boolean),
          moreNews: allNews.filter((n) => n.id !== news.id).slice(0, 3)
        });
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  openWork(e) { wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${e.currentTarget.dataset.id}` }); },
  openVideo(e) { wx.navigateTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` }); },
  openNews(e) { wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${e.currentTarget.dataset.id}` }); },

  onShareAppMessage() {
    const news = this.data.news || {};
    return { title: news.title || '沂蒙小戏小剧官方资讯', path: `/pages/news-detail/news-detail?id=${news.id || this.id || ''}` };
  }
});
