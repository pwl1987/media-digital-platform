// 史料馆（数据资产 · 档案工作台范式）——IA V1.0 Tab3，视觉按 V0.2 §4 浅色工作台
const api = require('../../utils/api');

const TYPE_TABS = [
  { key: '', label: '全部' },
  { key: 'document', label: '文献' },
  { key: 'image', label: '图片' },
  { key: 'press', label: '报刊' },
  { key: 'file', label: '档案' },
  { key: 'oral-history', label: '口述' },
  { key: 'video', label: '视频' },
  { key: 'audio', label: '音频' }
];

Page({
  data: {
    tabs: TYPE_TABS,
    activeType: '',
    q: '',
    items: [],
    total: 0,
    loading: true,
    error: false,
    searched: false
  },

  onLoad() {
    this.fetch();
  },

  onInput(e) {
    this.setData({ q: e.detail.value });
  },

  onSearch() {
    this.fetch();
  },

  switchType(e) {
    this.setData({ activeType: e.currentTarget.dataset.key });
    this.fetch();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  fetch() {
    const { activeType, q } = this.data;
    this.setData({ loading: true });
    const query = { pageSize: 50 };
    if (activeType) query.archiveType = activeType;
    if (q && q.trim()) query.q = q.trim();
    api.getArchives(query)
      .then((res) => {
        if (res.error) throw new Error(res.error.message);
        this.setData({
          loading: false,
          items: res.data.items,
          total: res.data.total,
          searched: Boolean(query.q || query.archiveType)
        });
      })
      .catch(() => {
        this.setData({ loading: false, error: true, items: [], total: 0 });
      });
  },

  openDetail(e) {
    wx.navigateTo({ url: `/pages/archive-detail/archive-detail?id=${e.currentTarget.dataset.id}` });
  }
});
