const FAVORITES_KEY = 'yimeng_favorites';
const HISTORY_KEY = 'yimeng_history';

Page({
  data: { favoriteCount: 0, historyCount: 0, sessionCount: 0 },
  onShow() {
    const favorites = wx.getStorageSync(FAVORITES_KEY) || [];
    const history = wx.getStorageSync(HISTORY_KEY) || [];
    const sessions = wx.getStorageSync('yimeng_ai_sessions') || [];
    this.setData({ favoriteCount: favorites.length, historyCount: history.length, sessionCount: sessions.length });
  },
  clearLocalData() {
    wx.showModal({
      title: '清除本地记录',
      content: '将删除本机保存的收藏、历史和问答会话，不影响服务器数据。',
      success: (res) => {
        if (!res.confirm) return;
        [FAVORITES_KEY, HISTORY_KEY, 'yimeng_ai_sessions'].forEach((key) => wx.removeStorageSync(key));
        this.onShow();
        wx.showToast({ title: '已清除', icon: 'success' });
      }
    });
  }
});
