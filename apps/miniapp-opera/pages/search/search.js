const { works, artists, organizations, events } = require('../../utils/mock');

Page({
  data: { q: '', results: [] },
  onInput(e) { this.setData({ q: e.detail.value }); },
  doSearch() {
    const q = (this.data.q || '').trim().toLowerCase();
    const results = [
      ...works.map(x => ({ ...x, resultType: '剧目' })),
      ...artists.map(x => ({ ...x, resultType: '演员' })),
      ...organizations.map(x => ({ ...x, resultType: '剧团' })),
      ...events.map(x => ({ ...x, resultType: '活动' }))
    ].filter(x => !q || `${x.title} ${x.summary || ''} ${x.organization || ''}`.toLowerCase().includes(q));
    this.setData({ results });
  },
  openResult(e) {
    const { type, id } = e.currentTarget.dataset;
    const routes = { Work: 'work-detail', Artist: 'artist-detail', Organization: 'organization-detail', Event: 'event-detail' };
    wx.navigateTo({ url: `/pages/${routes[type] || 'work-detail'}/${routes[type] || 'work-detail'}?id=${id}` });
  }
});
