// 史料详情：数字档案卡（不是普通文章页）——著录表格 + 来源依据 + 轻量关系网络
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    archive: null,
    sources: [],
    persons: [],
    events: [],
    relatedArchives: [],
    statusNote: ''
  },

  onLoad(options) {
    this.id = options.id;
    this.fetch();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  fetch() {
    Promise.all([
      api.getArchive(this.id),
      api.getPeople({ pageSize: 100 }),
      api.getTimeline()
    ])
      .then(([archRes, peopleRes, timelineRes]) => {
        if (archRes.error || !archRes.data) throw new Error('not found');
        const archive = archRes.data;
        const people = (peopleRes.data && peopleRes.data.items) || [];
        const eras = (timelineRes.data && timelineRes.data.eras) || [];
        const events = [].concat(...eras.map((g) => g.events));

        const persons = (archive.relatedPersonIds || [])
          .map((id) => people.find((p) => p.id === id))
          .filter(Boolean)
          .map((p) => ({ id: p.id, title: p.title, identity: p.identity }));
        const relatedEvents = (archive.relatedEventIds || [])
          .map((id) => events.find((e) => e.id === id))
          .filter(Boolean)
          .map((e) => ({ id: e.id, title: e.title, date: e.date, era: e.era }));

        // 轻量关系网络：经关联事件聚合其他史料（“这份史料还关联”），取前 6 条
        const relatedIds = new Set();
        relatedEvents.forEach((e) => {
          const full = events.find((x) => x.id === e.id);
          (full.resourceIds || []).forEach((rid) => relatedIds.add(rid));
        });
        relatedIds.delete(archive.id);
        const ids = [...relatedIds].filter((rid) => String(rid).startsWith('arch-')).slice(0, 6);

        this.setData({
          loading: false,
          archive,
          sources: (archive.sourceReferences || []).map((s) => ({ ...s, gradeLabel: api.gradeLabels[s.grade] || s.grade })),
          persons,
          events: relatedEvents,
          statusNote: archive.contentStatusLabel
        });

        return Promise.all(ids.map((rid) => api.getArchive(rid))).then((results) => {
          this.setData({
            relatedArchives: results
              .filter((r) => !r.error && r.data)
              .map((r) => ({
                id: r.data.id,
                title: r.data.title,
                typeLabel: api.archiveTypeLabels[r.data.archiveType] || r.data.archiveType
              }))
          });
        });
      })
      .catch(() => {
        this.setData({ loading: false, error: true });
      });
  },

  openPerson(e) {
    wx.navigateTo({ url: `/pages/person-detail/person-detail?id=${e.currentTarget.dataset.id}` });
  },

  goMemory() {
    wx.navigateTo({ url: '/pages/memory/memory' });
  },

  openArchive(e) {
    wx.navigateTo({ url: `/pages/archive-detail/archive-detail?id=${e.currentTarget.dataset.id}` });
  }
});
