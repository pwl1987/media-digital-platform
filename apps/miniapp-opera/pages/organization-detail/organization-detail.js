// 剧团详情：官方剧团档案 + 简介 + 代表剧目（走 API facade）
const api = require('../../utils/api');

Page({
  data: {
    organization: null,
    works: [],
    worksLoading: true,
    glyph: '团'
  },

  onLoad(options) {
    this.id = options.id;
    if (!this.id) return;
    this.load();
  },

  retry() { if (this.id) this.load(); },

  load() {
    api.getOrganization(this.id)
      .then((res) => {
        if (res.error || !res.data) return;
        this.setData({ organization: res.data, glyph: String(res.data.title || '').slice(0, 1) || '团' });
        return api.getWorks();
      })
      .then((worksRes) => {
        if (!worksRes || worksRes.error) return;
        const list = (worksRes.data && worksRes.data.items) || [];
        const works = list.filter((w) => w.organization && w.organization.id === this.id);
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
    const o = this.data.organization || {};
    return { title: `${o.title} · 沂蒙小戏小剧`, path: `/pages/organization-detail/organization-detail?id=${o.id || this.id || ''}` };
  }
});
