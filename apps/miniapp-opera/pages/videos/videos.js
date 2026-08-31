// 视听页：顶部通栏三形态切换（剧目/直播/听小剧，五色功能瓦片横滑）+ 分类筛选 + 视频墙
const api = require('../../utils/api');

const TABS = [
  { key: 'works', label: '剧目', sub: '官方剧目档案' },
  { key: 'live', label: '直播', sub: '现场展演直播' },
  { key: 'audio', label: '听小剧', sub: '戏曲音频专辑' }
];
const CATEGORIES = ['全部', '演出实录', '精品片段', '幕后花絮', '专题片', '人物访谈'];

Page({
  data: {
    tabs: TABS,
    activeTab: 'works',
    categories: CATEGORIES,
    active: '全部',
    loading: true,
    error: false,
    items: []
  },

  onLoad() {
    this.fetch();
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.key });
    // 切到直播/听小剧时给出"演示数据"占位（无对应端点）
    if (e.currentTarget.dataset.key !== 'works') {
      this.setData({ items: [] });
    } else {
      this.fetch();
    }
  },

  fetch() {
    this.setData({ loading: true });
    api.getVideos()
      .then((res) => {
        if (res.error) throw new Error('videos failed');
        const all = (res.data && res.data.items) || [];
        this.setData({ loading: false, items: this.applyFilter(all) });
      })
      .catch(() => this.setData({ loading: false, error: true, items: [] }));
  },

  applyFilter(list) {
    return this.data.active === '全部' ? list : list.filter((v) => v.category === this.data.active);
  },

  selectCategory(e) {
    this.setData({ active: e.currentTarget.dataset.cat });
    this.fetch();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  openVideo(e) {
    wx.navigateTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` });
  },

  onPullDownRefresh() {
    this.fetch();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return { title: '小戏小剧影像馆', path: '/pages/videos/videos' };
  }
});
