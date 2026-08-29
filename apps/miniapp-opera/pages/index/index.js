const { works, events } = require('../../utils/mock');

function decorateEvents(items) {
  return items.map((item) => {
    const date = new Date(item.startAt);
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    return {
      ...item,
      monthDay: `${month}.${day}`,
      timeLabel: `${hours}:${minutes}`,
      statusLabel: item.status === 'live' ? '正在展演' : item.status === 'ended' ? '精彩回顾' : '即将开始'
    };
  });
}

Page({
  data: { works: works.slice(0, 3), events: decorateEvents(events).slice(0, 3) },
  goWorks() { wx.switchTab({ url: '/pages/works/works' }); },
  goEvents() { wx.switchTab({ url: '/pages/events/events' }); },
  goLive() { wx.switchTab({ url: '/pages/live/live' }); },
  openWork(e) { wx.navigateTo({ url: `/pages/work-detail/work-detail?id=${e.currentTarget.dataset.id}` }); },
  openEvent(e) { wx.navigateTo({ url: `/pages/event-detail/event-detail?id=${e.currentTarget.dataset.id}` }); },
  onShareAppMessage() {
    return {
      title: '沂蒙小戏小剧 · 好戏上演，精彩沂蒙',
      path: '/pages/index/index'
    };
  }
});
