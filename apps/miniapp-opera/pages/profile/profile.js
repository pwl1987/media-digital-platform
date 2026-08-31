Page({
  data: {
    stats: [
      { id: 'favorites', label: '收藏剧目', value: 0 },
      { id: 'history', label: '观看历史', value: 0 },
      { id: 'signup', label: '活动报名', value: 0 }
    ],
    menus: [
      { id: 'favorites', icon: '藏', label: '我的收藏', desc: '收藏的剧目与影像' },
      { id: 'history', icon: '史', label: '观看历史', desc: '最近观看的舞台影像' },
      { id: 'signup', icon: '约', label: '活动报名', desc: '展演与惠民活动' },
      { id: 'about', icon: '台', label: '关于平台', desc: '主管单位与备案信息' }
    ]
  },
  openMenu(e) {
    const { id } = e.currentTarget.dataset;
    if (id === 'about') {
      wx.showModal({
        title: '关于平台',
        content: '沂蒙小戏小剧官方数字传播平台\n主管单位：沂蒙小戏小剧官方平台建设工作组',
        showCancel: false,
        confirmText: '知道了'
      });
    }
  }
});
