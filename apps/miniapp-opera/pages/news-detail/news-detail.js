const api = require('../../utils/api');

Page({
  data: { loading: true, error: false, news: null },
  onLoad(options) {
    if (!options.id) return this.setData({ loading: false, error: true });
    this.load(options.id);
  },
  async load(id) {
    this.setData({ loading: true, error: false });
    try {
      const result = await api.getNewsDetail(id);
      if (result.error || !result.data) return this.setData({ loading: false, error: true });
      const news = result.data;
      wx.setNavigationBarTitle({ title: '资讯详情' });
      this.setData({ news, loading: false });
    } catch (error) {
      this.setData({ loading: false, error: true });
    }
  },
  retry() { this.load(this.data.news?.id); },
  openRelation(e) {
    const { id, type } = e.currentTarget.dataset;
    const paths = { Work: `/pages/work-detail/work-detail?id=${id}`, Event: `/pages/event-detail/event-detail?id=${id}`, MediaAsset: `/pages/video-detail/video-detail?id=${id}` };
    if (paths[type]) wx.navigateTo({ url: paths[type] });
  },
  onShareAppMessage() {
    const news = this.data.news || {};
    return { title: news.title || '沂蒙小戏小剧官方资讯', path: `/pages/news-detail/news-detail?id=${news.id || ''}` };
  }
});
