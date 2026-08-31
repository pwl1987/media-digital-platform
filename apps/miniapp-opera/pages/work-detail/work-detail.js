// 剧目详情：文化档案页（基线 §9）；加载骨架 + 友好错误态 + 底部固定操作条（分享/收藏）
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    work: null,
    videos: [],
    performances: [],
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
    // 从我的页回跳后，已收藏状态同步
    const fav = wx.getStorageSync('opera_favorites') || {};
    this.setData({ favorited: !!fav.work && !!fav.work[this.id] });
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.load();
  },

  load() {
    Promise.all([
      api.getWork(this.id),
      api.getVideos(),
      api.getPerformances({ workId: this.id }),
      api.getNews({ page: 1, pageSize: 20 })
    ])
      .then(([workRes, videosRes, perfRes, newsRes]) => {
        if (workRes.error || !workRes.data) throw new Error('not found');
        const work = {
          ...workRes.data,
          artists: (workRes.data.artists || []).map((a) => ({
            ...a, glyph: String(a.title || '').slice(0, 1) || '艺'
          }))
        };
        const videos = (videosRes.data && videosRes.data.items) || [];
        const mediaIds = (work.media || []).map((m) => m.id);
        const workVideos = mediaIds.length
          ? mediaIds.map((id) => videos.find((v) => v.id === id)).filter(Boolean)
          : videos.filter((v) => v.title && v.title.includes(work.title)).slice(0, 2);
        const allNews = (newsRes.data && newsRes.data.items) || [];
        wx.setNavigationBarTitle({ title: '剧目档案' });
        this.setData({
          loading: false,
          work,
          videos: workVideos,
          performances: (perfRes.data && perfRes.data.items) || [],
          relatedNews: allNews.filter((n) => (n.relatedWorkIds || []).includes(work.id)).slice(0, 3)
        });
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  openVideo(e) { wx.navigateTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` }); },
  openArtist(e) { wx.navigateTo({ url: `/pages/artist-detail/artist-detail?id=${e.currentTarget.dataset.id}` }); },
  openOrganization() {
    const org = this.data.work && this.data.work.organization;
    if (org) wx.navigateTo({ url: `/pages/organization-detail/organization-detail?id=${org.id}` });
  },
  openEvent(e) { wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${e.currentTarget.dataset.id}` }); },
  openNews(e) { wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${e.currentTarget.dataset.id}` }); },

  onShare() {
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '已生成分享卡', icon: 'success' });
  },

  onFavorite() {
    if (this.favoriting) return;
    this.favoriting = true;
    const fav = wx.getStorageSync('opera_favorites') || { work: {} };
    fav.work = fav.work || {};
    const had = !!fav.work[this.id];
    had ? delete fav.work[this.id] : (fav.work[this.id] = true);
    wx.setStorageSync('opera_favorites', fav);
    this.setData({ favorited: !had });
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: had ? '已取消收藏' : '已加入收藏', icon: had ? 'none' : 'success' });
    setTimeout(() => { this.favoriting = false; }, 300);
  },

  onShareAppMessage() {
    const work = this.data.work || {};
    return { title: `《${work.title || '沂蒙小戏小剧'}》· 官方剧目档案`, path: `/pages/work-detail/work-detail?id=${work.id || this.id || ''}` };
  }
});
