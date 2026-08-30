// 历史记忆：时间轴（Era 锚点 → 事件卡 → 展开聚合：人物 / 史料）
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    eras: [],
    people: [],
    activeEventId: ''
  },

  onLoad() {
    this.fetch();
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.fetch();
  },

  fetch() {
    Promise.all([api.getTimeline(), api.getPeople({ pageSize: 100 })])
      .then(([timelineRes, peopleRes]) => {
        if (timelineRes.error) throw new Error('timeline failed');
        const people = (peopleRes.data && peopleRes.data.items) || [];
        const nameOf = (id) => {
          const p = people.find((x) => x.id === id);
          return p ? p.title : '';
        };
        const eras = ((timelineRes.data && timelineRes.data.eras) || []).map((group) => ({
          era: group.era,
          events: group.events.map((e) => ({
            ...e,
            personNames: (e.personIds || []).map(nameOf).filter(Boolean),
            archiveCount: (e.resourceIds || []).filter((id) => String(id).startsWith('arch-')).length,
            archives: [] // 展开时惰性调取
          }))
        }));
        this.setData({ loading: false, eras, people });
      })
      .catch(() => {
        this.setData({ loading: false, error: true });
      });
  },

  toggleEvent(e) {
    const eventId = e.currentTarget.dataset.id;
    const active = this.data.activeEventId === eventId ? '' : eventId;
    this.setData({ activeEventId: active });
    if (!active) return;
    // 展开时惰性调取该节点聚合的史料（轻量关系：事件 → 史料列表）
    const group = this.data.eras.find((g) => g.events.some((ev) => ev.id === eventId));
    const event = group && group.events.find((ev) => ev.id === eventId);
    if (!event || event.archives.length || !event.resourceIds) return;
    const ids = event.resourceIds.filter((id) => String(id).startsWith('arch-')).slice(0, 6);
    Promise.all(ids.map((id) => api.getArchive(id))).then((results) => {
      const archives = results
        .filter((r) => !r.error && r.data)
        .map((r) => ({
          id: r.data.id,
          title: r.data.title,
          typeLabel: api.archiveTypeLabels[r.data.archiveType] || r.data.archiveType,
          grade: r.data.grade
        }));
      const eras = this.data.eras.map((g) => ({
        ...g,
        events: g.events.map((ev) => (ev.id === eventId ? { ...ev, archives } : ev))
      }));
      this.setData({ eras });
    });
  },

  openArchive(e) {
    wx.navigateTo({ url: `/pages/archive-detail/archive-detail?id=${e.currentTarget.dataset.id}` });
  },

  openPerson(e) {
    wx.navigateTo({ url: `/pages/person-detail/person-detail?id=${e.currentTarget.dataset.id}` });
  },

  openStories() {
    wx.navigateTo({ url: '/pages/stories/stories' });
  }
});
