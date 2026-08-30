// 人物档案（庄重黑白 + 红色名条 + 关联史料/荣誉，V0.2 §4.2 PersonCard）
const api = require('../../utils/api');

Page({
  data: {
    loading: true,
    error: false,
    person: null,
    years: '',
    nameGlyph: '',
    archives: []
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
    api.getPerson(this.id)
      .then((res) => {
        if (res.error || !res.data) throw new Error('not found');
        const person = res.data;
        const birth = person.birthYear ? `${person.birthYear}` : '';
        const death = person.deathYear ? `${person.deathYear}` : '';
        const years = birth ? (death ? `${birth} — ${death}` : `${birth} — `) : '';
        this.setData({ loading: false, person, years, nameGlyph: String(person.title).slice(0, 1) });

        // 关联史料惰性调取
        const ids = (person.archiveIds || []).slice(0, 8);
        return Promise.all(ids.map((id) => api.getArchive(id))).then((results) => {
          this.setData({
            archives: results
              .filter((r) => !r.error && r.data)
              .map((r) => ({
                id: r.data.id,
                title: r.data.title,
                typeLabel: api.archiveTypeLabels[r.data.archiveType] || r.data.archiveType
              }))
          });
        });
      })
      .catch(() => this.setData({ loading: false, error: true }));
  },

  openArchive(e) {
    wx.navigateTo({ url: `/pages/archive-detail/archive-detail?id=${e.currentTarget.dataset.id}` });
  }
});
