// 剧团详情：官方剧团档案 + 简介 + 代表剧目 + 院团影像 + 关注/分享（走 API facade + 本地持久化）
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    organization: null,
    works: [],
    worksLoading: true,
    videos: [],
    glyph: '团',
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
    this.setData({ followed: !!(set.organization && set.organization[this.id]) });
  },

  retry() { if (this.id) this.load(); },

  load() {
    api.getOrganization(this.id)
      .then((res) => {
        if (res.error || !res.data) throw new Error('not found');
        const organization = res.data;
        wx.setNavigationBarTitle({ title: `${organization.title} · 剧团档案` });
        this.setData({ organization, glyph: String(organization.title || '').slice(0, 1) || '团' });
        return Promise.all([api.getWorks(), api.getVideos()]);
      })
      .then(([worksRes, videosRes]) => {
        const list = (worksRes.data && worksRes.data.items) || [];
        const works = list.filter((w) => w.organization && w.organization.id === this.id);
        const titles = new Set(works.map((w) => w.title));
        const videos = ((videosRes.data && videosRes.data.items) || []).filter((v) => {
          if (!v.title) return false;
          for (const t of titles) if (v.title.includes(t)) return true;
          return v.title.includes(this.data.organization.title || '');
        }).slice(0, 6);
        const set = wx.getStorageSync('opera_followed') || {};
        this.setData({
          works, videos, worksLoading: false, loading: false,
          followed: !!(set.organization && set.organization[this.id])
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
    const set = wx.getStorageSync('opera_followed') || { organization: {} };
    set.organization = set.organization || {};
    const had = !!set.organization[this.id];
    had ? delete set.organization[this.id] : (set.organization[this.id] = true);
    wx.setStorageSync('opera_followed', set);
    this.setData({ followed: !had });
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: had ? '已取消关注' : '已关注剧团', icon: had ? 'none' : 'success' });
  },

  onShareAppMessage() {
    const o = this.data.organization || {};
    return { title: `${o.title} · 沂蒙小戏小剧`, path: `/pages/organization-detail/organization-detail?id=${o.id || this.id || ''}` };
  }
});