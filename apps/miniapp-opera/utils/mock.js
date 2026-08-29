const works = [
  {
    id: 'work-001', type: 'Work', title: '沂蒙山小调', tag: '精品剧目',
    summary: '以沂蒙地域文化为背景的经典作品展示。',
    organization: { id: 'org-001', title: '沂蒙艺术团' },
    artists: [{ id: 'artist-001', title: '张老师' }],
    performances: [{ id: 'performance-001', title: '2026沂蒙小戏小剧展演·专场一', date: '2026-09-05 19:30', place: '临沂文化艺术中心' }],
    media: [{ id: 'media-001', type: 'Video', title: '精彩片段' }]
  },
  {
    id: 'work-002', type: 'Work', title: '红嫂情', tag: '红色题材',
    summary: '以沂蒙红嫂故事为主题的小戏作品。',
    organization: { id: 'org-002', title: '临沂地方戏剧团' },
    artists: [{ id: 'artist-002', title: '李老师' }],
    performances: [{ id: 'performance-002', title: '2026小戏小剧展演·红色专场', date: '2026-09-12 19:30', place: '临沂剧院' }],
    media: [{ id: 'media-002', type: 'Video', title: '演出实录' }]
  }
];

const artists = [
  { id: 'artist-001', title: '张老师', role: '主演', organization: '沂蒙艺术团', workIds: ['work-001'] },
  { id: 'artist-002', title: '李老师', role: '主演', organization: '临沂地方戏剧团', workIds: ['work-002'] }
];

const organizations = [
  { id: 'org-001', title: '沂蒙艺术团', summary: '专注地方戏曲与小戏小剧创作演出的文艺团队。' },
  { id: 'org-002', title: '临沂地方戏剧团', summary: '开展地方戏剧创作、演出与文化传承。' }
];

const events = [
  { id: 'event-001', title: '2026沂蒙小戏小剧展演', status: 'upcoming', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心', works: ['work-001', 'work-002'] }
];

const performances = [
  { id: 'performance-001', title: '2026沂蒙小戏小剧展演·专场一', workId: 'work-001', eventId: 'event-001', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心' },
  { id: 'performance-002', title: '2026小戏小剧展演·红色专场', workId: 'work-002', eventId: 'event-001', startAt: '2026-09-12T19:30:00+08:00', place: '临沂剧院' }
];

module.exports = { works, artists, organizations, events, performances };