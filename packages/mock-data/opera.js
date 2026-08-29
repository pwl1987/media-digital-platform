const news = [
  { id: 'news-001', type: 'News', title: '沂蒙小戏小剧展演即将启幕', category: '展演资讯', date: '2026-08-29', summary: '一批优秀小戏小剧作品将集中亮相，带您走近沂蒙地方文艺创作。', sourceLevel: 'official', sourceName: '沂蒙小戏小剧官方平台', status: 'published' },
  { id: 'news-002', type: 'News', title: '精品小戏小剧作品展播上线', category: '剧目动态', date: '2026-08-27', summary: '平台持续汇集优秀剧目与舞台影像，集中展示创作成果。', sourceLevel: 'official', sourceName: '沂蒙小戏小剧官方平台', status: 'published' },
  { id: 'news-003', type: 'News', title: '媒体聚焦沂蒙小戏小剧的传承与创新', category: '媒体报道', date: '2026-08-25', summary: '从地方文化传播视角关注小戏小剧创作、演出与传播。', sourceLevel: 'media', sourceName: '媒体报道', status: 'published' }
];

const works = [
  { id: 'work-001', type: 'Work', title: '沂蒙山小调', tag: '精品剧目', summary: '以沂蒙地域文化为背景的经典作品展示。', sourceLevel: 'official', organization: { id: 'org-001', title: '沂蒙艺术团' }, artists: [{ id: 'artist-001', title: '张老师' }], media: [{ id: 'video-001', type: 'MediaAsset', title: '舞台精彩片段' }], performanceIds: ['performance-001'], honors: [] , status: 'published' },
  { id: 'work-002', type: 'Work', title: '红嫂情', tag: '红色题材', summary: '以沂蒙红嫂故事为主题的小戏作品。', sourceLevel: 'official', organization: { id: 'org-002', title: '临沂地方戏剧团' }, artists: [{ id: 'artist-002', title: '李老师' }], media: [{ id: 'video-002', type: 'MediaAsset', title: '演出实录' }], performanceIds: ['performance-002'], honors: [], status: 'published' }
];

const artists = [
  { id: 'artist-001', type: 'Person', title: '张老师', role: '主演', organization: '沂蒙艺术团', workIds: ['work-001'], status: 'published' },
  { id: 'artist-002', type: 'Person', title: '李老师', role: '主演', organization: '临沂地方戏剧团', workIds: ['work-002'], status: 'published' }
];

const organizations = [
  { id: 'org-001', type: 'Organization', title: '沂蒙艺术团', summary: '专注地方戏曲与小戏小剧创作演出的文艺团队。', status: 'published' },
  { id: 'org-002', type: 'Organization', title: '临沂地方戏剧团', summary: '开展地方戏剧创作、演出与文化传承。', status: 'published' }
];

const events = [
  { id: 'event-001', type: 'Event', title: '2026沂蒙小戏小剧展演', status: 'upcoming', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心', workIds: ['work-001', 'work-002'] },
  { id: 'event-002', type: 'Event', title: '红色题材精品专场', status: 'upcoming', startAt: '2026-09-12T19:30:00+08:00', place: '临沂剧院', workIds: ['work-002'] }
];

const performances = [
  { id: 'performance-001', type: 'Performance', title: '2026沂蒙小戏小剧展演·专场一', workId: 'work-001', eventId: 'event-001', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心', status: 'scheduled' },
  { id: 'performance-002', type: 'Performance', title: '2026小戏小剧展演·红色专场', workId: 'work-002', eventId: 'event-002', startAt: '2026-09-12T19:30:00+08:00', place: '临沂剧院', status: 'scheduled' }
];

const videos = [
  { id: 'video-001', type: 'MediaAsset', mediaType: 'video', title: '沂蒙山小调·舞台精彩片段', category: '精品剧目', status: 'published' },
  { id: 'video-002', type: 'MediaAsset', mediaType: 'video', title: '红嫂情·演出实录', category: '演出片段', status: 'published' },
  { id: 'video-003', type: 'MediaAsset', mediaType: 'video', title: '小戏小剧展演现场', category: '活动现场', status: 'published' }
];

module.exports = { news, works, artists, organizations, events, performances, videos };