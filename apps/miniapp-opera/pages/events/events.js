// 展演活动：日历条 + 分类筛选双轴导航 + 活动卡（收藏/报名），数据走共享 client
const api = require('../../utils/api');

const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
function pad(n) { return `${n}`.padStart(2, '0'); }

function decorate(item) {
  const d = new Date(item.startAt);
  const valid = !Number.isNaN(d.getTime());
  const dateKey = valid ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : '';
  return {
    ...item,
    dateKey,
    weekLabel: valid ? WEEK[d.getDay()] : '',
    dayLabel: valid ? pad(d.getDate()) : '--',
    timeLabel: valid ? `${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 ${pad(d.getHours())}:${pad(d.getMinutes())}` : '',
    statusLabel: item.lifecycleStatus === 'ongoing' ? '进行中' : item.lifecycleStatus === 'ended' ? '已结束' : '预告',
    signUpPercent: item.capacity ? Math.min(100, Math.round(((item.signedUp || 0) / item.capacity) * 100)) : 0
  };
}

Page({
  data: {
    loading: true,
    error: false,
    q: '',
    categories: ['全部活动', '线下活动', '线上活动', '比赛征集'],
    activeCategory: '全部活动',
    days: [],
    activeDay: '',
    events: []
  },

  onLoad() {
    this.fetch();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  fetch() {
    api.getEvents()
      .then((res) => {
        if (res.error) throw new Error('events failed');
        const events = ((res.data && res.data.items) || []).map(decorate);
        events.sort((a, b) => {
          const order = { ongoing: 0, upcoming: 1, ended: 2 };
          return (order[a.lifecycleStatus] ?? 3) - (order[b.lifecycleStatus] ?? 3)
            || String(a.startAt).localeCompare(String(b.startAt));
        });
        this.allEvents = events;
        // 日历条：取全部活动日期（去重，最多 7 天）
        const seen = new Set();
        const days = [];
        events.forEach((e) => {
          if (e.dateKey && !seen.has(e.dateKey)) {
            seen.add(e.dateKey);
            days.push({ key: e.dateKey, weekLabel: e.weekLabel, dayLabel: e.dayLabel });
          }
        });
        this.setData({ loading: false, days, activeDay: '', events: this.filterEvents() });
      })
      .catch(() => this.setData({ loading: false, error: true, events: [] }));
  },

  filterEvents() {
    const { activeCategory, activeDay, q } = this.data;
    let list = this.allEvents || [];
    if (activeDay) list = list.filter((e) => e.dateKey === activeDay);
    if (activeCategory !== '全部活动') list = list.filter((e) => e.category === activeCategory);
    const kw = (q || '').trim().toLowerCase();
    if (kw) list = list.filter((e) => `${e.title} ${e.desc || ''}`.toLowerCase().includes(kw));
    return list;
  },

  applyFilter() {
    this.setData({ events: this.filterEvents() });
  },

  onInput(e) {
    this.setData({ q: e.detail.value });
    this.applyFilter();
  },

  selectDay(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeDay: this.data.activeDay === key ? '' : key });
    this.applyFilter();
  },

  selectCategory(e) {
    this.setData({ activeCategory: e.currentTarget.dataset.cat });
    this.applyFilter();
  },

  onFavorite(e) {
    wx.showToast({ title: '已收藏（演示）', icon: 'none' });
  },

  onShareCard() {
    wx.showToast({ title: '分享链接已生成（演示）', icon: 'none' });
  },

  onSignUp(e) {
    wx.showToast({ title: '报名成功（演示）', icon: 'success' });
  },

  openEvent(e) {
    wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${e.currentTarget.dataset.id}` });
  },

  onPullDownRefresh() {
    this.fetch();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return { title: '展演活动 · 沂蒙小戏小剧', path: '/pages/events/events' };
  }
});
