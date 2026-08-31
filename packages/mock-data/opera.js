// 沂蒙小戏小剧官方平台 · 共享 Mock 数据集
// 对齐 API_CONTRACT_V0.2（Opera Promotion §6）与 OPERA_UI_VISUAL_BASELINE_V0.1 的 MediaCard 必备字段。
// 新闻带正文与传播闭环关联（relatedWorkIds/relatedVideoIds/featured），视频覆盖五类影像馆分类。

const news = [
  {
    id: 'news-001', type: 'News', title: '2026 沂蒙小戏小剧展演即将启幕', category: '展演资讯', date: '2026-08-29', featured: true,
    summary: '一批优秀小戏小剧作品将于九月在临沂集中亮相，带您走近沂蒙地方文艺创作的最新成果。',
    body: '记者从沂蒙小戏小剧官方平台获悉，2026 沂蒙小戏小剧展演将于 9 月 5 日在临沂文化艺术中心启幕。\n本届展演以"小戏小剧·大美沂蒙"为主题，集中展示近两年创作打磨的一批优秀作品，涵盖柳琴戏、弦子戏、小品、小剧等多种形式。\n展演期间还将同步开展惠民演出与创作交流，让更多观众在家门口欣赏高水平的地方文艺。',
    sourceLevel: 'official', sourceName: '沂蒙小戏小剧官方平台', status: 'published',
    relatedWorkIds: ['work-001', 'work-002'], relatedVideoIds: ['video-003', 'video-001']
  },
  {
    id: 'news-002', type: 'News', title: '精品小戏小剧作品展播正式上线', category: '剧目动态', date: '2026-08-27',
    summary: '平台持续汇集优秀剧目与舞台影像，集中展示沂蒙小戏小剧创作成果。',
    body: '沂蒙小戏小剧官方平台"精品剧目展播"专栏今日上线。\n首批上线剧目包括《沂蒙山小调》《红嫂情》等作品，观众可在线观看舞台实录与精彩片段。\n后续专栏将定期更新，并按红色题材、现实题材等分类陆续推出专题展播。',
    sourceLevel: 'official', sourceName: '沂蒙小戏小剧官方平台', status: 'published',
    relatedWorkIds: ['work-001', 'work-002'], relatedVideoIds: ['video-001', 'video-002']
  },
  {
    id: 'news-003', type: 'News', title: '媒体聚焦沂蒙小戏小剧的传承与创新', category: '媒体报道', date: '2026-08-25',
    summary: '多家媒体从地方文化传播视角关注小戏小剧创作、演出与传播。',
    body: '近日，多家省市媒体陆续报道沂蒙小戏小剧的传承与创新实践。\n报道关注了基层剧团坚持创作、青年演员接续传承，以及数字平台助力地方文艺传播的探索。\n业内观点认为，小戏小剧正成为讲好沂蒙故事、活跃基层文化生活的重要载体。',
    sourceLevel: 'media', sourceName: '市级媒体联合报道', status: 'published',
    relatedWorkIds: ['work-002'], relatedVideoIds: ['video-006']
  },
  {
    id: 'news-004', type: 'News', title: '红色题材小戏《红嫂情》完成新一轮打磨', category: '剧目动态', date: '2026-08-22',
    summary: '主创团队听取专家与观众意见，对唱段与舞台呈现进行优化提升。',
    body: '记者从临沂地方戏剧团获悉，红色题材小戏《红嫂情》已完成新一轮打磨。\n本轮修改重点优化了核心唱段的音乐编排与舞台调度，使人物情感表达更加细腻。\n该剧将在即将开幕的展演中与观众见面。',
    sourceLevel: 'official', sourceName: '临沂地方戏剧团', status: 'published',
    relatedWorkIds: ['work-002'], relatedVideoIds: ['video-002']
  },
  {
    id: 'news-005', type: 'News', title: '小戏小剧进乡村惠民演出收官', category: '展演资讯', date: '2026-08-18',
    summary: '历时一个月的进乡村惠民演出走进十二个乡镇，惠及观众上万人次。',
    body: '由文化主管部门组织的小戏小剧进乡村惠民演出近日收官。\n演出历时一个月，先后走进十二个乡镇，把《沂蒙山小调》等群众喜爱的节目送到田间地头，累计惠及观众上万人次。\n主办方表示，惠民演出将形成常态化机制，持续丰富基层群众文化生活。',
    sourceLevel: 'official', sourceName: '沂蒙小戏小剧官方平台', status: 'published',
    relatedWorkIds: ['work-001'], relatedVideoIds: ['video-003']
  },
  {
    id: 'news-006', type: 'News', title: '青年演员培训班开班：为小戏小剧育新人', category: '媒体报道', date: '2026-08-15',
    summary: '面向基层剧团的青年演员培训班开班，名家授课传帮带。',
    body: '沂蒙小戏小剧青年演员培训班近日开班，来自各基层剧团的三十余名青年演员参加培训。\n培训邀请省内戏曲名家现场授课，围绕唱念做打与角色塑造开展传帮带。\n主办方介绍，培训班今后每年举办两期，为小戏小剧传承培养后备力量。',
    sourceLevel: 'media', sourceName: '文化周刊', status: 'published',
    relatedWorkIds: [], relatedVideoIds: ['video-007']
  },
  {
    id: 'news-007', type: 'News', title: '"小戏小剧·大美沂蒙"专题片开机', category: '剧目动态', date: '2026-08-12',
    summary: '系统记录沂蒙小戏小剧创作与传承历程的专题片正式开机拍摄。',
    body: '专题片《小戏小剧·大美沂蒙》今日在临沂开机。\n该片将系统记录沂蒙小戏小剧的创作历程、代表人物与传承故事，预计年内完成制作。\n摄制组将陆续走进剧团、乡村舞台与排练现场，抢救性记录一批珍贵舞台影像。',
    sourceLevel: 'official', sourceName: '沂蒙小戏小剧官方平台', status: 'published',
    relatedWorkIds: ['work-001'], relatedVideoIds: ['video-005']
  },
  {
    id: 'news-008', type: 'News', title: '展演预约通道即将开放', category: '展演资讯', date: '2026-08-10',
    summary: '本届展演将开放部分场次的观众预约，敬请关注官方平台公告。',
    body: '据展演组委会消息，2026 沂蒙小戏小剧展演将开放部分场次的观众预约。\n预约通道开放后，观众可通过官方平台查询场次信息并登记观演。\n具体安排以官方平台后续公告为准。',
    sourceLevel: 'official', sourceName: '沂蒙小戏小剧官方平台', status: 'published',
    relatedWorkIds: [], relatedVideoIds: []
  }
];

// 数据密度按验收下限建设（Gate U：剧目 ≥6、活动 ≥4、新闻 ≥8、视频 ≥8、专题 ≥3）
const works = [
  { id: 'work-001', type: 'Work', title: '沂蒙山小调', tag: '精品剧目', summary: '以沂蒙地域文化为背景的经典作品，唱响山水与人情的沂蒙记忆。', sourceLevel: 'official', organization: { id: 'org-001', title: '沂蒙艺术团' }, artists: [{ id: 'artist-001', title: '张老师', role: '主演' }], media: [{ id: 'video-001', type: 'MediaAsset', title: '舞台精彩片段' }], performanceIds: ['performance-001'], honors: ['市级群众文艺优秀作品'], status: 'published' },
  { id: 'work-002', type: 'Work', title: '红嫂情', tag: '红色题材', summary: '以沂蒙红嫂故事为主题的小戏作品，再现军民鱼水情深的动人篇章。', sourceLevel: 'official', organization: { id: 'org-002', title: '临沂地方戏剧团' }, artists: [{ id: 'artist-002', title: '李老师', role: '主演' }], media: [{ id: 'video-002', type: 'MediaAsset', title: '演出实录' }], performanceIds: ['performance-002'], honors: ['红色题材创作扶持作品'], status: 'published' },
  { id: 'work-003', type: 'Work', title: '槐树庄的故事', tag: '现实题材', summary: '以乡村振兴中的村庄日常为切口，讲述新时代农民自己的故事。', sourceLevel: 'official', organization: { id: 'org-001', title: '沂蒙艺术团' }, artists: [{ id: 'artist-001', title: '张老师', role: '主演' }], media: [], performanceIds: ['performance-003'], honors: [], status: 'published' },
  { id: 'work-004', type: 'Work', title: '山村夜话', tag: '小品类', summary: '用一间农家夜话的灯光，映出基层治理里的笑与暖。', sourceLevel: 'official', organization: { id: 'org-002', title: '临沂地方戏剧团' }, artists: [{ id: 'artist-002', title: '李老师', role: '主演' }], media: [], performanceIds: ['performance-004'], honors: [], status: 'published' },
  { id: 'work-005', type: 'Work', title: '沂河两岸', tag: '传统戏曲', summary: '柳琴戏传统折子戏整理改编剧目，让老腔老调焕发新声。', sourceLevel: 'official', organization: { id: 'org-001', title: '沂蒙艺术团' }, artists: [{ id: 'artist-003', title: '王老师', role: '主演' }], media: [], performanceIds: ['performance-003'], honors: ['柳琴戏传承展演剧目'], status: 'published' },
  { id: 'work-006', type: 'Work', title: '丰收时节', tag: '现实题材', summary: '以合作社丰收季为背景的轻喜剧，唱出庄稼人踏实的喜悦。', sourceLevel: 'official', organization: { id: 'org-002', title: '临沂地方戏剧团' }, artists: [{ id: 'artist-004', title: '刘老师', role: '主演' }], media: [], performanceIds: ['performance-004'], honors: [], status: 'published' }
];

const artists = [
  { id: 'artist-001', type: 'Person', title: '张老师', role: '主演', organization: '沂蒙艺术团', workIds: ['work-001', 'work-003'], status: 'published' },
  { id: 'artist-002', type: 'Person', title: '李老师', role: '主演', organization: '临沂地方戏剧团', workIds: ['work-002', 'work-004'], status: 'published' },
  { id: 'artist-003', type: 'Person', title: '王老师', role: '主演', organization: '沂蒙艺术团', workIds: ['work-005'], status: 'published' },
  { id: 'artist-004', type: 'Person', title: '刘老师', role: '主演', organization: '临沂地方戏剧团', workIds: ['work-006'], status: 'published' }
];

const organizations = [
  { id: 'org-001', type: 'Organization', title: '沂蒙艺术团', summary: '专注地方戏曲与小戏小剧创作演出的文艺团队。', status: 'published' },
  { id: 'org-002', type: 'Organization', title: '临沂地方戏剧团', summary: '开展地方戏剧创作、演出与文化传承。', status: 'published' }
];

const events = [
  { id: 'event-001', type: 'Event', title: '2026沂蒙小戏小剧展演', lifecycleStatus: 'upcoming', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心', workIds: ['work-001', 'work-002'], status: 'published' },
  { id: 'event-002', type: 'Event', title: '红色题材精品专场', lifecycleStatus: 'upcoming', startAt: '2026-09-12T19:30:00+08:00', place: '临沂剧院', workIds: ['work-002'], status: 'published' },
  { id: 'event-003', type: 'Event', title: '文化惠民·小戏小剧进乡村专场', lifecycleStatus: 'ongoing', startAt: '2026-08-28T19:00:00+08:00', place: '蒙阴县野店镇文化广场', workIds: ['work-003', 'work-005'], status: 'published' },
  { id: 'event-004', type: 'Event', title: '青年演员汇报演出', lifecycleStatus: 'upcoming', startAt: '2026-09-20T14:30:00+08:00', place: '临沂市文化馆小剧场', workIds: ['work-004', 'work-006'], status: 'published' }
];

const performances = [
  { id: 'performance-001', type: 'Performance', title: '2026沂蒙小戏小剧展演·专场一', workId: 'work-001', eventId: 'event-001', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心', status: 'published' },
  { id: 'performance-002', type: 'Performance', title: '2026小戏小剧展演·红色专场', workId: 'work-002', eventId: 'event-002', startAt: '2026-09-12T19:30:00+08:00', place: '临沂剧院', status: 'published' },
  { id: 'performance-003', type: 'Performance', title: '文化惠民专场·野店站', workId: 'work-003', eventId: 'event-003', startAt: '2026-08-28T19:00:00+08:00', place: '蒙阴县野店镇文化广场', status: 'published' },
  { id: 'performance-004', type: 'Performance', title: '青年演员汇报演出·下午场', workId: 'work-004', eventId: 'event-004', startAt: '2026-09-20T14:30:00+08:00', place: '临沂市文化馆小剧场', status: 'published' }
];

// 影像馆五类：演出实录 / 精品片段 / 幕后花絮 / 专题片 / 人物访谈
// MediaCard 必备字段（视觉基线 §6.4）：时长、来源、清晰度；封面暂以占位色块呈现，接入媒资后替换
const videos = [
  { id: 'video-001', type: 'MediaAsset', mediaType: 'video', title: '沂蒙山小调·舞台精彩片段', category: '精品片段', durationSeconds: 342, sourceName: '沂蒙艺术团', resolution: '1080P', status: 'published' },
  { id: 'video-002', type: 'MediaAsset', mediaType: 'video', title: '红嫂情·演出实录', category: '演出实录', durationSeconds: 2760, sourceName: '临沂地方戏剧团', resolution: '1080P', status: 'published' },
  { id: 'video-003', type: 'MediaAsset', mediaType: 'video', title: '小戏小剧展演·现场直击', category: '演出实录', durationSeconds: 186, sourceName: '沂蒙小戏小剧官方平台', resolution: '720P', status: 'published' },
  { id: 'video-004', type: 'MediaAsset', mediaType: 'video', title: '《红嫂情》幕后：一段唱腔的打磨', category: '幕后花絮', durationSeconds: 265, sourceName: '临沂地方戏剧团', resolution: '1080P', status: 'published' },
  { id: 'video-005', type: 'MediaAsset', mediaType: 'video', title: '专题片《小戏小剧·大美沂蒙》先导预告', category: '专题片', durationSeconds: 128, sourceName: '沂蒙小戏小剧官方平台', resolution: '4K', status: 'published' },
  { id: 'video-006', type: 'MediaAsset', mediaType: 'video', title: '媒体看小戏小剧：传承与创新', category: '专题片', durationSeconds: 315, sourceName: '市级媒体联合报道', resolution: '1080P', status: 'published' },
  { id: 'video-007', type: 'MediaAsset', mediaType: 'video', title: '青年演员培训班·名家授课实录', category: '人物访谈', durationSeconds: 540, sourceName: '文化周刊', resolution: '1080P', status: 'published' },
  { id: 'video-008', type: 'MediaAsset', mediaType: 'video', title: '主演谈角色：把沂蒙故事唱给更多人', category: '人物访谈', durationSeconds: 425, sourceName: '沂蒙小戏小剧官方平台', resolution: '1080P', status: 'published' }
];

module.exports = { news, works, artists, organizations, events, performances, videos };
