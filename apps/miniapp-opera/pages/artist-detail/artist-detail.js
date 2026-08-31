// 演员详情：黑白人像档案卡 + 介绍 + 代表作品 + 主演影像（走 API facade）+ 关注/分享（持久化）
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    artist: null,
    works: [],
    worksLoading: true,
    videos: [],
    glyph: '演',
    followed: false
  },

  onLoad(options) {
    this.id = options.id;
    if (!this.id) { this.setData({ loading: false, error: true }); return; }
    this.load();
  },

  onShow() {
    if (!this.id) return;
    const set = wx.getStorageSync('opera_followed') || {};
    this.setData({ followed: !!(set.artist && set.artist[this.id]) });
  },

  retry() { if (this.id) this.load(); },

  load() {
    api.getArtist(this.id)
      .then((res) => {
        if (res.error || !res.data) throw new Error('not found');
        const artist = res.data;
        wx.setNavigationBarTitle({ title: `${artist.title} · 演员档案` });
        this.setData({ artist, glyph: String(artist.title || '').slice(0, 1) || '演' });
        return Promise.all([api.getWorks(), api.getVideos()]);
      })
      .then(([worksRes, videosRes]) => {
        const artistName = this.data.artist && this.data.artist.title;
        const works = ((worksRes.data && worksRes.data.items) || []).filter((w) =>
          (w.artists || []).some((a) => a.title === artistName) || (artistName && (w.summary || '').includes(artistName))
        );
        const worksByName = (videosRes.data && videosRes.data.items) || [];
        // 主演影像：作品标题反查 + 任意包含演员姓名的影像
        const titles = works.map((w) => w.title);
        const videos = worksByName.filter((v) => titles.some((t) => v.title && v.title.includes(t)) || (artistName && (v.title || '').includes(artistName))).slice(0, 6);
        const set = wx.getStorageSync('opera_followed') || {};
        this.setData({
          works, videos,
          worksLoading: false,
          loading: false,
          followed: !!(set.artist && set.artist[this.id])
        });
      })
      .catch(() => this.setData({ loading: false, error: true, worksLoading: false }));
  },

  openWork(e) { wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${e.currentTarget.dataset.id}` }); },
  openVideo(e) { wx.navigateTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` }); },

  onShare() {
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '已生成分享卡', icon: 'success' });
  },
  onFollow() {
    const set = wx.getStorageSync('opera_followed') || { artist: {} };
    set.artist = set.artist || {};
    const had = !!set.artist[this.id];
    had ? delete set.artist[this.id] : (set.artist[this.id] = true);
    wx.setStorageSync('opera_followed', set);
    this.setData({ followed: !had });
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: had ? '已取消关注' : '已关注', icon: had ? 'none' : 'success' });
  },

  onShareAppMessage() {
    const a = this.data.artist || {};
    return { title: `${a.title} · 沂蒙小戏小剧`, path: `/pages/artist-detail/artist-detail?id=${a.id || this.id || ''}` };
  }
});