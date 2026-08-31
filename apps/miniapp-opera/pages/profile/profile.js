// 我的：个人身份 + 数据看板 + 继续观看 + 功能矩阵（未登录演示态；登录体系按路线暂缓）
Page({
  data: {
    dashboard: [
      { id: 'watched', label: '观看剧目', value: 6, color: 'red' },
      { id: 'liked', label: '喜欢作品', value: 8, color: 'orange' },
      { id: 'favorites', label: '收藏剧目', value: 2, color: 'blue' },
      { id: 'shared', label: '分享次数', value: 4, color: 'tan' }
    ],
    continueWatching: [
      { id: 'video-002', title: '红嫂情·演出实录', percent: 65 },
      { id: 'video-001', title: '沂蒙山小调·舞台精彩片段', percent: 32 },
      { id: 'video-005', title: '专题片《小戏小剧·大美沂蒙》先导预告', percent: 83 }
    ],
    matrix: [
      { id: 'favorites', label: '我的收藏', value: 2, color: 'red', icon: '★' },
      { id: 'history', label: '观看历史', value: 6, color: 'blue', icon: '◔' },
      { id: 'signup', label: '活动报名', value: 1, color: 'orange', icon: '▣' },
      { id: 'feedback', label: '意见反馈', value: '', color: 'tan', icon: '✎' }
    ]
  },

  openContinue(e) {
    wx.navigateTo({ url: `/pages/video-detail/video-detail?id=${e.currentTarget.dataset.id}` });
  },

  openMatrix(e) {
    const { id } = e.currentTarget.dataset;
    if (id === 'signup') wx.navigateTo({ url: '/pages/events/events' });
    else if (id === 'history') wx.navigateTo({ url: '/pages/videos/videos' });
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
