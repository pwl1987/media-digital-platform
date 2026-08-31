// 我的：个人身份 + 数据看板 + 继续观看 + 功能矩阵（未登录演示态；登录体系按路线暂缓）
// 看板/矩阵计数接入真实本地持久化（opera_favorites / opera_signed_up / opera_notify / opera_followed）
function countKeys(map) { return map ? Object.keys(map).length : 0; }
function sum(map) { return Object.keys(map || {}).reduce((n, k) => n + countKeys(map[k]), 0); }

Page({
  data: {
    stats: { favorites: 0, signedUp: 0, followed: 0, notified: 0 },
    continueWatching: [
      { id: 'video-002', title: '红嫂情·演出实录', percent: 65 },
      { id: 'video-001', title: '沂蒙山小调·舞台精彩片段', percent: 32 },
      { id: 'video-005', title: '专题片《小戏小剧·大美沂蒙》先导预告', percent: 83 }
    ]
  },

  onShow() {
    const fav = wx.getStorageSync('opera_favorites') || {};
    const signed = wx.getStorageSync('opera_signed_up') || {};
    const followed = wx.getStorageSync('opera_followed') || {};
    const notified = wx.getStorageSync('opera_notify') || {};
    this.setData({
      stats: {
        favorites: sum(fav),
        signedUp: countKeys(signed.event),
        followed: sum(followed),
        notified: countKeys(notified.live)
      }
    });
  },

  openContinue(e) {
    wx.navigateTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` });
  },

  openMatrix(e) {
    const { id } = e.currentTarget.dataset;
    if (id === 'signup') wx.switchTab({ url: '/pages/events/events' });
    else if (id === 'favorites') wx.navigateTo({ url: '/pages/my-favorites/my-favorites' });
    else if (id === 'followed') wx.navigateTo({ url: '/pages/my-followed/my-followed' });
    else if (id === 'notified') wx.navigateTo({ url: '/pages/my-notify/my-notify' });
    else wx.showToast({ title: '演示数据，敬请期待', icon: 'none' });
  },

  onAbout() {
    wx.showModal({
      title: '关于平台',
      content: '沂蒙小戏小剧官方数字传播平台\n主管单位：沂蒙小戏小剧官方平台建设工作组',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  onShareAppMessage() {
    return { title: '沂蒙小戏小剧 · 官方数字传播平台', path: '/pages/index/index' };
  }
});