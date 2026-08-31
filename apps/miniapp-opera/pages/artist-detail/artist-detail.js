// 演员详情：黑白人像档案卡 + 介绍 + 代表作品（走 API facade）+ 关注/分享
const api = require('../../utils/api');

Page({
  data: {
    artist: null,
    works: [],
    worksLoading: true,
    glyph: '演'
  },

  onLoad(options) {
    this.id = options.id;
    if (!this.id) return;
    this.load();
  },

  retry() {
    if (this.id) this.load();
  },

  load() {
    api.getArtist(this.id)
      .then((res) => {
        if (res.error || !res.data) return;
        const artist = res.data;
        this.setData({ artist, glyph: String(artist.title || '').slice(0, 1) || '演' });
        return api.getWorks();
      })
      .then((worksRes) => {
        if (!worksRes || worksRes.error) return;
        const artistName = this.data.artist && this.data.artist.title;
        const list = (worksRes.data && worksRes.data.items) || [];
        const works = list.filter((w) =>
          (w.artists || []).some((a) => a.title === artistName) || (artistName && (w.summary || '').includes(artistName))
        );
        this.setData({ works, worksLoading: false });
      })
      .catch(() => this.setData({ worksLoading: false }));
  },

  openWork(e) { wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${e.currentTarget.dataset.id}` }); },

  onShare() { wx.showToast({ title: '已生成分享卡', icon: 'success' }); },
  onFollow() {
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '已关注', icon: 'success' });
  },

  onShareAppMessage() {
    const a = this.data.artist || {};
    return { title: `${a.title} · 沂蒙小戏小剧`, path: `/pages/artist-detail/artist-detail?id=${a.id || this.id || ''}` };
  }
});
