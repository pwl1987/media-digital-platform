const { knowledgeItems, featured } = require('../../utils/mock');

Page({
  data: { q: '', results: [] },
  onInput(e) { this.setData({ q: e.detail.value }); },
  doSearch() {
    const q = (this.data.q || '').trim().toLowerCase();
    const all = knowledgeItems.concat(featured);
    const results = q ? all.filter(x => `${x.title} ${x.summary || ''} ${x.tag || ''}`.toLowerCase().includes(q)) : all;
    this.setData({ results });
  },
  openResult(e) {
    const { type, id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?type=${type}&id=${id}` });
  }
});
