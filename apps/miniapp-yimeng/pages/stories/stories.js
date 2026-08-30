// 新时代传承（现实延续维度：故事列表）——“历史 → 精神 → 今天”闭环的第三环
const api = require('../../utils/api');

const STORY_TABS = [
  { key: '', label: '全部' },
  { key: 'new-era-practice', label: '新时代实践' },
  { key: 'grassroots', label: '基层实践' },
  { key: 'education-case', label: '教育案例' },
  { key: 'culture', label: '文化传承' }
];

Page({
  data: {
    tabs: STORY_TABS,
    activeType: '',
    loading: true,
    error: false,
    items: [],
    people: []
  },

  onLoad() {
    Promise.all([api.getStories({ pageSize: 50 }), api.getPeople({ pageSize: 100 })])
      .then(([storyRes, peopleRes]) => {
        if (storyRes.error) throw new Error('stories failed');
        const people = (peopleRes.data && peopleRes.data.items) || [];
        const nameOf = (id) => {
          const p = people.find((x) => x.id === id);
          return p ? p.title : '';
        };
        const items = ((storyRes.data && storyRes.data.items) || []).map((s) => ({
          ...s,
          personNames: (s.personIds || []).map(nameOf).filter(Boolean)
        }));
        this.setData({ loading: false, items, people });
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  retry() {
    this.setData({ error: false, loading: true });
    this.onLoad();
  },

  switchType(e) {
    this.setData({ activeType: e.currentTarget.dataset.key });
  },

  openPerson(e) {
    wx.navigateTo({ url: `/pages/person-detail/person-detail?id=${e.currentTarget.dataset.id}` });
  },

  goMemory() {
    wx.navigateTo({ url: '/pages/memory/memory' });
  }
});
