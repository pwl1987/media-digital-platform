// 视频详情：媒体播放 + 传播链（剧目/新闻）+ 底部操作条（分享/收藏）
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    video: null,
    relatedWork: null,
    relatedNews: [],
    favorited: false
  },

  onLoad(options) {
    if (!options.id) {
      this.setData({ loading: false, error: true });
      return;
    }
    this.id = options.id;
    this.load();
  },

  onShow() {
    if (!this.id) return;
    const fav = wx.getStorageSync('opera_favorites') || {};
    this.setData({ favorited: !!(fav.video && fav.video[this.id]) });
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.load();
  },

  load() {
    Promise.all([api.getVideo(this.id), api.getWorks(), api.getNews({ page: 1, pageSize: 20 })])
      .then(([detailRes, worksRes, newsRes]) => {
        if (detailRes.error || !detailRes.data) throw new Error('not found');
        const video = detailRes.data;
        const works = (worksRes.data && worksRes.data.items) || [];
        const allNews = (newsRes.data && newsRes.data.items) || [];
        const relatedWork = works.find((w) => (w.media || []).some((m) => m.id === video.id)) || null;
        const relatedNews = allNews.filter((n) => (n.relatedVideoIds || []).includes(video.id)).slice(0, 3);
        wx.setNavigationBarTitle({ title: video.title || '影像详情' });
        this.setData({ loading: false, video, relatedWork, relatedNews });
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  onPlayError() {
    wx.showToast({ title: '视频播放失败，请稍后重试', icon: 'none' });
  },
  onPlaying() { /* 钩子：真实埋点或暂停竞态处理位 */ },

  openWork() {
    if (this.data.relatedWork) wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${this.data.relatedWork.id}` });
  },
  openNews(e) { wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${e.currentTarget.dataset.id}` }); },

  onShare() {
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '已生成分享卡', icon: 'success' });
  },

  onFavorite() {
    if (this.favoriting) return;
    this.favoriting = true;
    const fav = wx.getStorageSync('opera_favorites') || { video: {} };
    fav.video = fav.video || {};
    const had = !!fav.video[this.id];
    had ? delete fav.video[this.id] : (fav.video[this.id] = true);
    wx.setStorageSync('opera_favorites', fav);
    this.setData({ favorited: !had });
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: had ? '已取消收藏' : '已加入收藏', icon: had ? 'none' : 'success' });
    setTimeout(() => { this.favoriting = false; }, 300);
  },

  onShareAppMessage() {
    const video = this.data.video || {};
    return { title: video.title || '小戏小剧影像', path: `/pages/video-detail/video-detail?id=${video.id || this.id || ''}` };
  }
});
