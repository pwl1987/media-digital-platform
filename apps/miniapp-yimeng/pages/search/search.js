const { knowledgeItems, featured } = require('../../utils/mock');

Page({
  data: { query: '', history: [], results: [], searched: false },
  onLoad() { this.setData({ history: wx.getStorageSync('yimeng_search_history') || [] }); },
  onInput(e) { this.setData({ query: e.detail.value }); },
  onConfirm() { this.search(); },
  search() {
    const query = (this.data.query || '').trim();
    if (!query) return;
    const all = [...knowledgeItems, ...featured];
    const results = all.filter((item) => `${item.title}${item.summary || ''}`.includes(query));
    const history = [query, ...this.data.history.filter((item) => item !== query)].slice(0, 8);
    wx.setStorageSync('yimeng_search_history', history);
    this.setData({ results, searched: true, history });
  },
  useHistory(e) { const query = e.currentTarget.dataset.query; this.setData({ query }); this.search(); },
  clearHistory() { wx.removeStorageSync('yimeng_search_history'); this.setData({ history: [] }); },
  openItem(e) { wx.navigateTo({ url: e.currentTarget.dataset.path }); }
});
