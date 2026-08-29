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

const news = [
  { id: 'news-001', title: '沂蒙小戏小剧展演即将启幕', category: '展演资讯', date: '2026-08-29', summary: '一批优秀小戏小剧作品将集中亮相，带您走近沂蒙地方文艺创作。' },
  { id: 'news-002', title: '精品小戏小剧作品展播上线', category: '剧目动态', date: '2026-08-27', summary: '平台持续汇集优秀剧目与舞台影像，集中展示创作成果。' },
  { id: 'news-003', title: '媒体聚焦沂蒙小戏小剧的传承与创新', category: '媒体报道', date: '2026-08-25', summary: '从地方文化传播视角关注小戏小剧创作、演出与传播。' },
  { id: 'news-004', title: '本周展演资讯：更多精彩内容值得期待', category: '最新发布', date: '2026-08-23', summary: '关注最新展演动态、剧目消息和活动回顾。' }
];

const videos = [
  { id: 'video-001', title: '沂蒙山小调·舞台精彩片段', category: '精品剧目', status: 'available' },
  { id: 'video-002', title: '红嫂情·演出实录', category: '演出片段', status: 'available' },
  { id: 'video-003', title: '小戏小剧展演现场', category: '活动现场', status: 'available' }
];

const lives = [
  { id: 'live-001', title: '2026沂蒙小戏小剧展演直播', status: 'upcoming', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心' }
];

module.exports = { works, artists, organizations, events, performances, news, videos, lives };