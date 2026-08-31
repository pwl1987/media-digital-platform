// 剧目库：海报网格 + 分类筛选（数据走共享 client）
const api = require('../../utils/api');

const TAGS = ['全部', '精品剧目', '红色题材', '现实题材', '小品类', '传统戏曲'];

Page({
  data: {
    loading: true,
    error: false,
    tags: TAGS,
    activeTag: '全部',
    works: []
  },

  onLoad() {
    this.fetch();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  fetch() {
    this.setData({ loading: true });
    api.getWorks()
      .then((res) => {
        if (res.error) throw new Error('works failed');
        this.allWorks = (res.data && res.data.items) || [];
        this.applyFilter(this.data.activeTag);
      })
      .catch(() => this.setData({ loading: false, error: true, works: [] }));
  },

  applyFilter(tag) {
    const works = tag === '全部'
      ? this.allWorks
      : this.allWorks.filter((item) => item.tag === tag);
    this.setData({ activeTag: tag, works, loading: false });
  },

  selectTag(e) {
    this.applyFilter(e.currentTarget.dataset.tag);
  },

  openWork(e) {
    wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${e.currentTarget.dataset.id}` });
  },

  onPullDownRefresh() {
    this.fetch();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return { title: '精品剧目 · 沂蒙小戏小剧', path: '/pages/works/works' };
  }
});
