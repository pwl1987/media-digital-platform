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

// 检索工作台第二层筛选：年代 + 来源等级（中文标签，UI 不显示字母，V0.2 §6.1）
const ERA_TABS = [
  { key: '', label: '全部年代' },
  { key: '1930s', label: '1930s' },
  { key: '1940s', label: '1940s' },
  { key: '1950s', label: '1950s' },
  { key: '1980s-90s', label: '1980s-90s' },
  { key: '2010s', label: '2010s' },
  { key: 'new-era', label: '新时代' }
];

const GRADE_TABS = [
  { key: '', label: '全部等级' },
  { key: 'A', label: '官方档案' },
  { key: 'B', label: '权威出版物' },
  { key: 'C', label: '权威媒体' }
];

Page({
  data: {
    tabs: TYPE_TABS,
    eraTabs: ERA_TABS,
    gradeTabs: GRADE_TABS,
    activeType: '',
    activeEra: '',
    activeGrade: '',
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

  switchEra(e) {
    this.setData({ activeEra: e.currentTarget.dataset.key });
    this.fetch();
  },

  switchGrade(e) {
    this.setData({ activeGrade: e.currentTarget.dataset.key });
    this.fetch();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  fetch() {
    const { activeType, activeEra, activeGrade, q } = this.data;
    this.setData({ loading: true });
    const query = { pageSize: 50 };
    if (activeType) query.archiveType = activeType;
    if (activeEra) query.era = activeEra;
    if (activeGrade) query.grade = activeGrade;
    if (q && q.trim()) query.q = q.trim();
    api.getArchives(query)
      .then((res) => {
        if (res.error) throw new Error(res.error.message);
        this.setData({
          loading: false,
          items: res.data.items,
          total: res.data.total,
          searched: Boolean(query.q || query.archiveType || query.era || query.grade)
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
