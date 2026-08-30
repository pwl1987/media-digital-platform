// 沂蒙精神数字传承平台 —— 首批数字资产种子数据（Phase Y1.3）
// 领域模型对齐 packages/domain-types/index.ts（HERITAGE_DOMAIN_MODEL_V0.2）。
// 本数据集为演示种子集：结构与关系密度按"真实数字档案馆初始化"标准建设，
// 正式数据后续由 news-media-system 中台与 Heritage Knowledge Layer 供给。
//
// 关系密度（评审冻结的下限，scripts/smoke-shared-client.mjs 守卫）：
//   TimelineEvent → Archive ≥30；Person → Story ≥20；Story → Media ≥10；Archive → SourceReference ≥20

// 来源等级：内部用字母枚举，UI 只显示中文标签（YIMENG_UI_VISUAL_BASELINE_V0.2 §6.1）
const GRADE_LABELS = { A: '官方档案', B: '权威出版物', C: '权威媒体', D: '一般资料' };

// 1) 史料（20 条，七类覆盖；著录信息齐备）

const archives = [
  {
    id: 'arch-001', type: 'ArchiveItem', archiveType: 'document', era: '1930s',
    title: '中共苏鲁豫皖边区省委关于开创沂蒙抗日根据地的部署文件（复制件）',
    summary: '1938 年边区省委进入沂蒙山区、开辟抗日根据地的部署性文件，是沂蒙精神"形成期"的源头性档案。',
    grade: 'A', custody: '山东省档案馆', citationId: 'YM-1938-0001', physical: 'copy',
    sourceReferences: [
      { id: 'sr-001', name: '山东省档案馆馆藏革命历史档案', locator: '卷宗 1938-007', grade: 'A' },
      { id: 'sr-002', name: '中共山东党史资料汇编（第一辑）', locator: '页 45-52', grade: 'B' }
    ],
    relatedPersonIds: ['person-006'], relatedEventIds: ['te-1938'], status: 'published'
  },
  {
    id: 'arch-002', type: 'ArchiveItem', archiveType: 'document', era: '1940s',
    title: '山东省战时工作推行委员会组织条例（原件）',
    summary: '1940 年 7 月山东省战时工作推行委员会（山东省人民政府前身）在沂南青驼寺成立时的组织条例原件。',
    grade: 'A', custody: '山东省档案馆', citationId: 'YM-1940-0002', physical: 'original',
    sourceReferences: [{ id: 'sr-003', name: '山东省档案馆馆藏政权建设档案', locator: '卷宗 1940-013', grade: 'A' }],
    relatedEventIds: ['te-1940'], status: 'published'
  },
  {
    id: 'arch-003', type: 'ArchiveItem', archiveType: 'press', era: '1940s',
    title: '《大众日报》大青山突围战报道（1941 年 12 月）',
    summary: '大青山突围战结束后《大众日报》的连续报道，记录突围经过与伤亡情况，是战役的同期出版物证据。',
    grade: 'B', custody: '大众日报报社档案室', citationId: 'YM-1941-0003', physical: 'original',
    sourceReferences: [{ id: 'sr-004', name: '大众日报缩微合订本（1941 年卷）', locator: '1941-12 版面', grade: 'B' }],
    relatedEventIds: ['te-1941-01'], status: 'published'
  },
  {
    id: 'arch-004', type: 'ArchiveItem', archiveType: 'oral-history', era: '1940s',
    title: '明德英救护八路军伤员口述记录（官方口述史项目）',
    summary: '明德英后人代述的口述史记录：1941 年冬聋哑妇女明德英以乳汁救活重伤员，"沂蒙红嫂"叙事的起点。',
    grade: 'A', custody: '临沂市档案馆', citationId: 'YM-1941-0004', physical: 'original',
    transcript: '（节选）那天早上，家里躲进来一个浑身是血的八路军战士。她不会说话，先把家里仅有的小米粥喂给他……',
    sourceReferences: [{ id: 'sr-005', name: '临沂市档案馆红嫂口述史项目', locator: '口述编号 KH-1995-011', grade: 'A' }],
    relatedPersonIds: ['person-001'], relatedEventIds: ['te-1941-02', 'te-1943'], status: 'published'
  },
  {
    id: 'arch-005', type: 'ArchiveItem', archiveType: 'image', era: '1940s',
    title: '大青山突围战战场历史照片',
    summary: '大青山突围战战地摄影，再现 1941 年反"扫荡"作战的战场环境。',
    grade: 'B', custody: '中国人民革命军事博物馆', citationId: 'YM-1941-0005', physical: 'copy',
    sourceReferences: [{ id: 'sr-006', name: '中国人民革命军事博物馆馆藏战地摄影', locator: '编号 ZD-1941-88', grade: 'A' }],
    relatedEventIds: ['te-1941-01'], status: 'published'
  },
  {
    id: 'arch-006', type: 'ArchiveItem', archiveType: 'document', era: '1930s',
    title: '王换于战时托儿所收养名册（复制件）',
    summary: '"沂蒙母亲"王换于 1939 年创办战时托儿所期间的收养登记名册，记录抚养的革命后代名单。',
    grade: 'A', custody: '沂南县档案馆', citationId: 'YM-1939-0006', physical: 'copy',
    sourceReferences: [
      { id: 'sr-007', name: '沂南县档案馆馆藏名册', locator: '卷宗 1939-021', grade: 'A' },
      { id: 'sr-008', name: '《沂蒙母亲王换于》党史出版物', locator: '第三章', grade: 'B' }
    ],
    relatedPersonIds: ['person-002'], relatedEventIds: ['te-1939'], status: 'published'
  },
  {
    id: 'arch-007', type: 'ArchiveItem', archiveType: 'image', era: '1940s',
    title: '汶河"火线桥"历史照片',
    summary: '1947 年孟良崮战役打响前夜，李桂芳带领 32 名妇女以门板在汶河上架起人桥的著名历史照片。',
    grade: 'A', custody: '新华社图片档案', citationId: 'YM-1947-0007', physical: 'copy',
    sourceReferences: [
      { id: 'sr-009', name: '新华社图片档案库', locator: '图片编号 1947-05-331', grade: 'A' },
      { id: 'sr-010', name: '孟良崮战役资料汇编', locator: '页 118', grade: 'B' }
    ],
    relatedPersonIds: ['person-003'], relatedEventIds: ['te-1947'], status: 'published'
  },
  {
    id: 'arch-008', type: 'ArchiveItem', archiveType: 'file', era: '1940s',
    title: '孟良崮战役沂蒙支前统计档案',
    summary: '战役期间沂蒙解放区军粮、军鞋、担架队支前统计，是"最后一口粮做军粮"的量化档案证据。',
    grade: 'A', custody: '临沂市档案馆', citationId: 'YM-1947-0008', physical: 'original',
    sourceReferences: [{ id: 'sr-011', name: '临沂市档案馆支前档案', locator: '卷宗 1947-045', grade: 'A' }],
    relatedEventIds: ['te-1947'], status: 'published'
  },
  {
    id: 'arch-009', type: 'ArchiveItem', archiveType: 'press', era: '1940s',
    title: '《大众日报》孟良崮战役捷报',
    summary: '1947 年 5 月孟良崮战役胜利后《大众日报》发布的捷报版面。',
    grade: 'B', custody: '大众日报报社档案室', citationId: 'YM-1947-0009', physical: 'original',
    sourceReferences: [{ id: 'sr-012', name: '大众日报缩微合订本（1947 年卷）', locator: '1947-05 版面', grade: 'B' }],
    relatedEventIds: ['te-1947'], status: 'published'
  },
  {
    id: 'arch-010', type: 'ArchiveItem', archiveType: 'document', era: '1950s',
    title: '毛泽东关于厉家寨的批示件（复制件）',
    summary: '1957 年 10 月毛泽东对莒南县厉家寨治山治水经验的批示："愚公移山，改造中国，厉家寨是一个好例。"',
    grade: 'A', custody: '中央档案馆', citationId: 'YM-1957-0010', physical: 'copy',
    sourceReferences: [
      { id: 'sr-013', name: '中央档案馆馆藏批示件', locator: '编号 1957-1029', grade: 'A' },
      { id: 'sr-014', name: '厉家寨史志资料汇编', locator: '页 3', grade: 'B' }
    ],
    relatedPersonIds: ['person-008'], relatedEventIds: ['te-1957'], status: 'published'
  },
  {
    id: 'arch-011', type: 'ArchiveItem', archiveType: 'image', era: '1950s',
    title: '厉家寨整山治水工程照片',
    summary: '厉家寨村民凿岭填沟、修建梯田水库的劳动场面摄影。',
    grade: 'B', custody: '莒南县档案馆', citationId: 'YM-1957-0011', physical: 'copy',
    sourceReferences: [{ id: 'sr-015', name: '莒南县馆藏建设摄影', locator: '编号 LS-1957-06', grade: 'A' }],
    relatedEventIds: ['te-1957'], status: 'published'
  },
  {
    id: 'arch-012', type: 'ArchiveItem', archiveType: 'file', era: '1940s',
    title: '沂蒙抗日根据地支前物资账簿',
    summary: '1938-1947 年间沂蒙根据地煎饼、军鞋、担架队等支前物资流水账簿，贯穿整个战争年代。',
    grade: 'A', custody: '临沂市档案馆', citationId: 'YM-1940-0012', physical: 'original',
    sourceReferences: [{ id: 'sr-016', name: '临沂市档案馆支前档案', locator: '卷宗 1938-102', grade: 'A' }],
    relatedEventIds: ['te-1938', 'te-1941-01', 'te-1943', 'te-1947'], status: 'published'
  },
  {
    id: 'arch-013', type: 'ArchiveItem', archiveType: 'oral-history', era: '1940s',
    title: '于爱梅口述：祖母王换于与战时托儿所（官方口述史项目）',
    summary: '王换于孙女于爱梅的口述记录，讲述战时托儿所抚养革命后代与"沂蒙母亲"的家史记忆。',
    grade: 'A', custody: '临沂市档案馆', citationId: 'YM-2015-0013', physical: 'original',
    transcript: '（节选）祖母常说，咱家的孩子死了还能再生，烈士的孩子没了就断了根。四年里托儿所没伤一个孩子……',
    sourceReferences: [{ id: 'sr-017', name: '临沂市档案馆红嫂口述史项目', locator: '口述编号 KH-2015-003', grade: 'A' }],
    relatedPersonIds: ['person-010', 'person-002'], relatedEventIds: ['te-1939', 'te-1943'], status: 'published'
  },
  {
    id: 'arch-014', type: 'ArchiveItem', archiveType: 'video', era: '1940s',
    title: '文献纪录片《沂蒙》资料片段',
    summary: '涵盖根据地创建、红嫂群体、厉家寨与九间棚艰苦创业、新时代传承等段落的文献纪录片资料片段。',
    grade: 'B', custody: '临沂市广播电视台', citationId: 'YM-2009-0014', physical: 'copy',
    sourceReferences: [{ id: 'sr-018', name: '临沂市广播电视台节目档案', locator: '节目编号 JM-2009-2', grade: 'B' }],
    relatedPersonIds: ['person-001'],
    relatedEventIds: ['te-1941-01', 'te-1941-02', 'te-1943', 'te-1957', 'te-1984', 'te-2013'], status: 'published'
  },
  {
    id: 'arch-015', type: 'ArchiveItem', archiveType: 'audio', era: '1940s',
    title: '《沂蒙山小调》二十世纪四十年代采录版本（复制）',
    summary: '1940 年诞生于费县白石屋村的《沂蒙山小调》早期采录音频，沂蒙文化的声音档案。',
    grade: 'B', custody: '山东艺术学院民歌档案', citationId: 'YM-1940-0015', physical: 'copy',
    sourceReferences: [{ id: 'sr-019', name: '山东民歌采录档案', locator: '磁带编号 MG-1940-77', grade: 'B' }],
    relatedEventIds: ['te-1940'], status: 'published'
  },
  {
    id: 'arch-016', type: 'ArchiveItem', archiveType: 'image', era: '1980s-90s',
    title: '九间棚村架电修路施工照片',
    summary: '1984 年起九间棚村民在悬崖峭壁间架电、修路的施工纪实摄影。',
    grade: 'B', custody: '平邑县档案馆', citationId: 'YM-1984-0016', physical: 'copy',
    sourceReferences: [{ id: 'sr-020', name: '平邑县馆藏建设摄影', locator: '编号 JJ-1984-11', grade: 'A' }],
    relatedPersonIds: ['person-007'], relatedEventIds: ['te-1984'], status: 'published'
  },
  {
    id: 'arch-017', type: 'ArchiveItem', archiveType: 'press', era: '2010s',
    title: '《人民日报》沂蒙精神重大宣传报道',
    summary: '2013 年以来中央媒体关于沂蒙精神时代价值与传承实践的重点报道版面。',
    grade: 'C', custody: '人民日报社', citationId: 'YM-2013-0017', physical: 'copy',
    sourceReferences: [{ id: 'sr-021', name: '人民日报电子版档案', locator: '2013-11 版面', grade: 'C' }],
    relatedEventIds: ['te-2013'], status: 'published'
  },
  {
    id: 'arch-018', type: 'ArchiveItem', archiveType: 'document', era: '2010s',
    title: '习近平总书记视察临沂重要讲话记录稿（复制件）',
    summary: '2013 年 11 月视察临沂时关于沂蒙精神的重要讲话记录稿，"水乳交融、生死与共"表述的权威出处。',
    grade: 'A', custody: '山东省档案馆', citationId: 'YM-2013-0018', physical: 'copy',
    sourceReferences: [
      { id: 'sr-022', name: '山东省档案馆馆藏会议档案', locator: '编号 2013-215', grade: 'A' },
      { id: 'sr-023', name: '习近平谈治国理政（相关论述汇编）', locator: '专题汇编', grade: 'B' }
    ],
    relatedEventIds: ['te-2013'], status: 'published'
  },
  {
    id: 'arch-019', type: 'ArchiveItem', archiveType: 'image', era: '1940s',
    title: '中国人民抗日军政大学第一分校在沂蒙办学照片',
    summary: '抗大一分校 1940 年抵达沂蒙根据地办学的历史照片，根据地干部教育的影像证据。',
    grade: 'A', custody: '中国人民革命军事博物馆', citationId: 'YM-1940-0019', physical: 'copy',
    sourceReferences: [{ id: 'sr-024', name: '中国人民革命军事博物馆馆藏摄影', locator: '编号 KD-1940-15', grade: 'A' }],
    relatedEventIds: ['te-1940'], status: 'published'
  },
  {
    id: 'arch-020', type: 'ArchiveItem', archiveType: 'document', era: '1940s',
    title: '沂蒙根据地减租减息政策执行档案',
    summary: '1942 年起沂蒙区减租减息、发动群众的政策执行档案，根据地党群关系的制度性证据。',
    grade: 'A', custody: '山东省档案馆', citationId: 'YM-1942-0020', physical: 'original',
    sourceReferences: [{ id: 'sr-025', name: '山东省档案馆馆藏土改档案', locator: '卷宗 1942-033', grade: 'A' }],
    relatedEventIds: ['te-1943'], status: 'published'
  }
];

// 2) 人物档案（10 人：历史 7 + 当代 3，衔接 personType 扩展方向）

const people = [
  {
    id: 'person-001', type: 'Person', title: '明德英', birthYear: 1911, deathYear: 1995,
    identity: '聋哑红嫂', grade: 'A', era: '1940s',
    summary: '1941 年冬以乳汁救活重伤员的聋哑妇女，"沂蒙红嫂"叙事的原型人物。',
    deeds: '明德英与丈夫李开田在马牧池一带务农。1941 年冬，一名身负重伤的八路军小战士躲进她家，不会说话的她用乳汁和米汤将战士从死亡线上救回，此后又多次掩护伤病员。',
    archiveIds: ['arch-004', 'arch-014'], mediaIds: ['media-005'], honors: ['沂蒙红嫂代表'], status: 'published'
  },
  {
    id: 'person-002', type: 'Person', title: '王换于', birthYear: 1888, deathYear: 1989,
    identity: '沂蒙母亲', grade: 'A', era: '1940s',
    summary: '1939 年创办战时托儿所，四年抚养革命后代无一伤亡。',
    deeds: '王换于在东辛庄接受艾山乡任命创办战时托儿所，先后照料近百名革命后代与烈士子女；自家四个孙子因照顾不周先后夭折，托儿所的孩子却一个未伤。',
    archiveIds: ['arch-006', 'arch-013'], mediaIds: ['media-005'], honors: ['沂蒙母亲'], status: 'published'
  },
  {
    id: 'person-003', type: 'Person', title: '李桂芳', birthYear: 1925,
    identity: '火线桥带头人', grade: 'A', era: '1940s',
    summary: '1947 年孟良崮战役前夜带领 32 名妇女在汶河上架起"火线桥"。',
    deeds: '部队急需过河而桥被炸毁，李桂芳带领妇女们卸下自家门板，跳进齐腰深的河水中用肩膀扛起门板架成人桥，让部队踏桥奔袭战场。',
    archiveIds: ['arch-007'], mediaIds: ['media-004'], honors: ['支前模范'], status: 'published'
  },
  {
    id: 'person-004', type: 'Person', title: '伊淑英', birthYear: 1930,
    identity: '沂蒙六姐妹之一', grade: 'A', era: '1940s',
    summary: '孟良崮战役期间烟庄村"沂蒙六姐妹"支前群体代表：烙煎饼、做军鞋、运弹药。',
    deeds: '战争年代，沂蒙六姐妹带领全村为部队烙煎饼、洗军衣、做军鞋，昼夜支前；和平年代继续以红嫂身份参与宣讲与家乡建设。',
    archiveIds: ['arch-008'], mediaIds: ['media-004'], honors: ['沂蒙六姐妹'], status: 'published'
  },
  {
    id: 'person-005', type: 'Person', title: '宋守莲',
    identity: '《沂蒙山小调》传承人', grade: 'B', era: 'new-era',
    summary: '《沂蒙山小调》传承人，长期在费县白石屋村传唱并教授小调，让声音档案活态传承。',
    deeds: '多年坚守小调诞生地，面向游客与学生传唱《沂蒙山小调》，参与非遗展示与文化交流活动。',
    archiveIds: ['arch-015'], mediaIds: ['media-002'], status: 'published'
  },
  {
    id: 'person-006', type: 'Person', title: '王尽美', birthYear: 1898, deathYear: 1925,
    identity: '中共一大代表·山东党组织创始人', grade: 'A', era: '1910s',
    summary: '山东党组织的缔造者，沂蒙红色基因的组织源头。',
    deeds: '王尽美作为中共一大代表创建山东党组织，其革命活动为沂蒙地区党的工作奠基，是沂蒙精神谱系的组织源头人物。',
    archiveIds: ['arch-001'], status: 'published'
  },
  {
    id: 'person-007', type: 'Person', title: '刘嘉坤', birthYear: 1953,
    identity: '九间棚村党委书记', grade: 'B', era: '1980s-90s',
    summary: '带领九间棚村民在悬崖上架电修路、治水栽树，把贫困村建成"九间棚精神"的当代典型。',
    deeds: '1984 年起带领村民以惊人代价在龙顶山架电、修路、引水，发展金银花产业，使九间棚成为艰苦创业的时代符号。',
    archiveIds: ['arch-016', 'arch-014'], mediaIds: ['media-001'], status: 'published'
  },
  {
    id: 'person-008', type: 'Person', title: '厉月坤', birthYear: 1916,
    identity: '厉家寨合作社带头人', grade: 'A', era: '1950s',
    summary: '带领厉家寨整山治水、凿岭填沟，创造"愚公移山，改造中国"的农业样板。',
    deeds: '担任厉家寨乡党支部书记期间带领社员治理山水，修建梯田与水库，其经验获得 1957 年毛泽东批示肯定。',
    archiveIds: ['arch-010', 'arch-011'], mediaIds: ['media-001'], status: 'published'
  },
  {
    id: 'person-009', type: 'Person', title: '朱呈镕', birthYear: 1953,
    identity: '新时代"新红嫂"·拥军模范', grade: 'B', era: 'new-era',
    summary: '从下岗女工到拥军企业家，多年慰问部队、资助老兵，被称为"新红嫂"。',
    deeds: '创办企业后长期开展拥军活动，足迹遍布边防哨所，资助老兵与军属，是沂蒙精神现实延续的代表性人物。',
    archiveIds: [], mediaIds: ['media-003'], honors: ['全国拥军模范'], status: 'published'
  },
  {
    id: 'person-010', type: 'Person', title: '于爱梅', birthYear: 1951,
    identity: '红嫂后代·沂蒙精神宣讲员', grade: 'B', era: 'new-era',
    summary: '"沂蒙母亲"王换于孙女，退休后专职从事沂蒙精神宣讲与红色教育。',
    deeds: '发起沂蒙精神传承志愿宣讲，进学校、进机关、进军营讲述红嫂家史，培养青年宣讲队伍。',
    archiveIds: ['arch-013'], mediaIds: ['media-005'], status: 'published'
  }
];

// 3) 新时代故事（10 条：现实延续维度，StoryType 四类覆盖）

const stories = [
  {
    id: 'story-001', type: 'Story', storyType: 'new-era-practice', era: 'new-era', grade: 'B',
    title: '临沂商城：从路边摊位到物流之都',
    summary: '几代临沂人把小地摊做成万亿级商贸物流网络，"开拓奋进"的当代注脚。',
    personIds: ['person-009'], mediaIds: ['media-003'], status: 'published'
  },
  {
    id: 'story-002', type: 'Story', storyType: 'grassroots', era: '1980s-90s', grade: 'B',
    title: '九间棚：悬崖峭壁上修出致富路',
    summary: '刘嘉坤带领村民架电引水修路，把"贫困甲天下"的龙顶山村变成艰苦创业样板。',
    personIds: ['person-007', 'person-008'], mediaIds: ['media-001'], status: 'published'
  },
  {
    id: 'story-003', type: 'Story', storyType: 'education-case', era: 'new-era', grade: 'B',
    title: '沂蒙精神进课堂：中小学红色研学',
    summary: '依托纪念馆、红嫂家乡开展研学课程，让学生在史料与现场中理解沂蒙精神。',
    personIds: ['person-010', 'person-002', 'person-001'], mediaIds: ['media-004'], status: 'published'
  },
  {
    id: 'story-004', type: 'Story', storyType: 'culture', era: 'new-era', grade: 'B',
    title: '从《沂蒙山小调》到民族歌剧《沂蒙山》',
    summary: '一首诞生于 1940 年的小调与一部新时代民族歌剧，串起沂蒙红色文艺的传承谱系。',
    personIds: ['person-005', 'person-001'], mediaIds: ['media-002'], status: 'published'
  },
  {
    id: 'story-005', type: 'Story', storyType: 'grassroots', era: 'new-era', grade: 'B',
    title: '新红嫂拥军志愿服务队',
    summary: '朱呈镕、于爱梅等发起的拥军志愿服务，把"爱党爱军"做成常态化的民间行动。',
    personIds: ['person-009', 'person-010'], mediaIds: ['media-005'], status: 'published'
  },
  {
    id: 'story-006', type: 'Story', storyType: 'education-case', era: 'new-era', grade: 'B',
    title: '大学生沂蒙精神宣讲团',
    summary: '高校学生重走支前路、采访红嫂后代，用青年语言再讲述沂蒙故事。',
    personIds: ['person-010', 'person-001'], mediaIds: ['media-001'], status: 'published'
  },
  {
    id: 'story-007', type: 'Story', storyType: 'culture', era: 'new-era', grade: 'B',
    title: '红色旅游：孟良崮与红嫂家乡',
    summary: '孟良崮战役纪念馆、马牧池红嫂家乡串联成线，让战场遗址成为没有围墙的课堂。',
    personIds: ['person-003', 'person-004', 'person-002'], mediaIds: ['media-004'], status: 'published'
  },
  {
    id: 'story-008', type: 'Story', storyType: 'new-era-practice', era: 'new-era', grade: 'B',
    title: '蒙阴蜜桃：六姐妹家乡的乡村振兴',
    summary: '蒙阴县把蜜桃产业做成富民支柱，昔日支前模范之乡走出生态富民新路。',
    personIds: ['person-004'], mediaIds: ['media-003'], status: 'published'
  },
  {
    id: 'story-009', type: 'Story', storyType: 'grassroots', era: 'new-era', grade: 'B',
    title: '厉家寨樱桃：老典型的新答卷',
    summary: '整山治水的老典型厉家寨转型樱桃产业，续写"艰苦创业"的新时代版本。',
    personIds: ['person-008'], mediaIds: ['media-001'], status: 'published'
  },
  {
    id: 'story-010', type: 'Story', storyType: 'new-era-practice', era: 'new-era', grade: 'A',
    title: '"水乳交融、生死与共"的党建实践',
    summary: '以沂蒙精神的时代表述为纲，党组织下沉服务群众，把历史经验转化为治理实践。',
    personIds: ['person-006', 'person-003', 'person-010'], mediaIds: ['media-003'], status: 'published'
  }
];

// 4) 影像档案（5 条）

const media = [
  {
    id: 'media-001', type: 'MediaAsset', mediaType: 'video', era: 'new-era', grade: 'B',
    title: '文献纪录片《沂蒙》精选片段', durationSeconds: 3560,
    summary: '从根据地创建到新时代传承的全景文献影像。', status: 'published'
  },
  {
    id: 'media-002', type: 'MediaAsset', mediaType: 'video', era: 'new-era', grade: 'B',
    title: '《沂蒙山小调》交响音乐会演出实录', durationSeconds: 2480,
    summary: '经典民调的当代舞台呈现，红色文艺传承实录。', status: 'published'
  },
  {
    id: 'media-003', type: 'MediaAsset', mediaType: 'image', era: 'new-era', grade: 'B',
    title: '沂蒙精神纪念馆展厅组图', summary: '常设展"水乳交融、生死与共"展厅实景组图。', status: 'published'
  },
  {
    id: 'media-004', type: 'MediaAsset', mediaType: 'video', era: 'new-era', grade: 'B',
    title: '孟良崮战役纪念馆全景导览', durationSeconds: 960,
    summary: '战役纪念馆全景影像导览，衔接战史与支前叙事。', status: 'published'
  },
  {
    id: 'media-005', type: 'MediaAsset', mediaType: 'audio', era: 'new-era', grade: 'A',
    title: '沂蒙红嫂口述音频集（选段）', durationSeconds: 4520,
    summary: '明德英、王换于等红嫂及后代的口述音频精选。', status: 'published'
  }
];

// 5) 历史记忆时间轴（10 节点；resourceIds 聚合史料/影像，构成知识图谱雏形）

const timeline = [
  {
    id: 'te-1938', type: 'TimelineEvent', era: '1930s', date: '1938-06-01',
    title: '沂蒙抗日根据地创建',
    summary: '中共苏鲁豫皖边区省委进入沂蒙山区，发动群众、开辟敌后抗日根据地，沂蒙精神的孕育起点。',
    personIds: ['person-006'], resourceIds: ['arch-001', 'arch-012'], status: 'published'
  },
  {
    id: 'te-1939', type: 'TimelineEvent', era: '1930s', date: '1939-10-01',
    title: '王换于创办战时托儿所',
    summary: '"沂蒙母亲"王换于在东辛庄创办战时托儿所，抚养革命后代，党群鱼水情的标志性事件。',
    personIds: ['person-002', 'person-010'], resourceIds: ['arch-006', 'arch-013'], status: 'published'
  },
  {
    id: 'te-1940', type: 'TimelineEvent', era: '1940s', date: '1940-07-26',
    title: '山东省战时工作推行委员会成立 · 抗大一分校抵沂',
    summary: '山东抗日民主政权最高行政机关在沂南青驼寺成立；抗大一分校抵达沂蒙办学，根据地进入政权与教育全面建设期。',
    personIds: [], resourceIds: ['arch-002', 'arch-015', 'arch-019'], status: 'published'
  },
  {
    id: 'te-1941-01', type: 'TimelineEvent', era: '1940s', date: '1941-11-30',
    title: '大青山突围战',
    summary: '沂蒙反"扫荡"中最惨烈的一战，数千将士与战工会人员突出重围，铸就沂蒙军民生死与共的悲壮记忆。',
    personIds: [], resourceIds: ['arch-003', 'arch-005', 'arch-012', 'arch-014'], status: 'published'
  },
  {
    id: 'te-1941-02', type: 'TimelineEvent', era: '1940s', date: '1941-12-01',
    title: '明德英乳汁救伤员',
    summary: '聋哑妇女明德英以乳汁救活重伤员，"沂蒙红嫂"叙事的起点。',
    personIds: ['person-001'], resourceIds: ['arch-004', 'arch-014'], status: 'published'
  },
  {
    id: 'te-1943', type: 'TimelineEvent', era: '1940s', date: '1943-06-01',
    title: '红嫂群体与群众支前运动',
    summary: '减租减息深入发动群众，做军鞋、烙煎饼、救伤员的红嫂群体事迹在这一时期集中涌现。',
    personIds: ['person-001', 'person-002'], resourceIds: ['arch-012', 'arch-013', 'arch-014', 'arch-020', 'arch-004'], status: 'published'
  },
  {
    id: 'te-1947', type: 'TimelineEvent', era: '1940s', date: '1947-05-16',
    title: '孟良崮战役与"火线桥"',
    summary: '孟良崮战役期间，李桂芳带 32 名妇女以肩扛门板架人桥；"最后一口粮做军粮，最后一块布做军装"的支前高潮。',
    personIds: ['person-003', 'person-004'], resourceIds: ['arch-007', 'arch-008', 'arch-009', 'arch-012'], status: 'published'
  },
  {
    id: 'te-1957', type: 'TimelineEvent', era: '1950s', date: '1957-10-09',
    title: '厉家寨治山治水获批示',
    summary: '毛泽东批示"愚公移山，改造中国，厉家寨是一个好例"，沂蒙人民艰苦创业进入和平建设时期的高光节点。',
    personIds: ['person-008'], resourceIds: ['arch-010', 'arch-011', 'arch-014'], status: 'published'
  },
  {
    id: 'te-1984', type: 'TimelineEvent', era: '1980s-90s', date: '1984-03-01',
    title: '九间棚艰苦创业',
    summary: '刘嘉坤带领九间棚村民架电、修路、治水，改革开放年代沂蒙精神的新标杆。',
    personIds: ['person-007'], resourceIds: ['arch-016', 'arch-014'], status: 'published'
  },
  {
    id: 'te-2013', type: 'TimelineEvent', era: 'new-era', date: '2013-11-25',
    title: '沂蒙精神的时代表述',
    summary: '习近平总书记视察临沂，把沂蒙精神概括为"水乳交融、生死与共"，开启新时代传承新阶段。',
    personIds: [], resourceIds: ['arch-017', 'arch-018', 'arch-014'], status: 'published'
  }
];

// 6) 精神源流（origin：Knowledge 词条 ×4）

const origin = [
  {
    id: 'k-001', type: 'Knowledge', title: '精神形成（1938-1949）',
    summary: '在创建根据地、反"扫荡"、全力支前的战争烽火中，党政军民水乳交融、生死与共，沂蒙精神淬炼成型。',
    evidenceIds: ['arch-001', 'arch-007', 'arch-012'], status: 'published'
  },
  {
    id: 'k-002', type: 'Knowledge', title: '发展历程（1950-2012）',
    summary: '从厉家寨治山治水到九间棚艰苦创业，沂蒙精神在社会主义建设和改革开放中不断丰富。',
    evidenceIds: ['arch-010', 'arch-016'], status: 'published'
  },
  {
    id: 'k-003', type: 'Knowledge', title: '核心内涵',
    summary: '爱党爱军、开拓奋进、艰苦创业、无私奉献——十六字内涵的权威表述。',
    evidenceIds: ['arch-018'], status: 'published'
  },
  {
    id: 'k-004', type: 'Knowledge', title: '时代价值',
    summary: '"水乳交融、生死与共"是沂蒙精神的鲜明特质，也是新时代党群关系与治理实践的精神资源。',
    evidenceIds: ['arch-017', 'arch-018'], status: 'published'
  }
];

// 7) AI 智能服务（Mock）：回答必须携带来源等级；时间敏感问题分"历史依据 + 新时代案例"

function aiChat(question) {
  const q = String(question || '');
  const timeSensitive = /现在|当代|新时代|实践|如今|今天/.test(q);
  const baseSources = [
    { id: 'arch-018', type: 'ArchiveItem', title: '习近平总书记视察临沂重要讲话记录稿', grade: 'A', locator: '编号 2013-215' },
    { id: 'arch-001', type: 'ArchiveItem', title: '边区省委开创沂蒙根据地部署文件', grade: 'A', locator: '卷宗 1938-007' },
    { id: 'arch-017', type: 'ArchiveItem', title: '《人民日报》沂蒙精神宣传报道', grade: 'C', locator: '2013-11 版面' }
  ];
  const answer = timeSensitive
    ? '【历史依据】沂蒙精神形成于革命战争年代：1938 年根据地创建起，沂蒙军民水乳交融、生死与共，红嫂救护伤员、火线桥支前等事迹构成其历史根基（A 级官方档案可溯）。\n【新时代案例】今天的传承实践包括：九间棚式的艰苦创业续写（story-002）、新红嫂拥军志愿服务（story-005）、"水乳交融、生死与共"导向的党建实践（story-010）——历史与当下共同回答"为什么今天仍需要沂蒙精神"。'
    : '沂蒙精神是沂蒙人民在党的领导下，在革命、建设和改革实践中形成的先进群体意识，核心内涵为"爱党爱军、开拓奋进、艰苦创业、无私奉献"，鲜明特质是党同人民群众"水乳交融、生死与共"。它形成于 1938 年以来的根据地创建与战争烽火，在厉家寨、九间棚的艰苦创业中发展，在新时代传承实践中彰显时代价值。';
  return {
    session_id: 'mock-session-001',
    answer,
    sources: baseSources,
    evidence: [
      { id: 'ev-001', label: '官方档案', title: '视察临沂重要讲话记录稿', grade: 'A', refId: 'arch-018', refType: 'ArchiveItem' },
      { id: 'ev-002', label: '权威出版物', title: '山东党史资料汇编', grade: 'B', refId: 'arch-001', refType: 'ArchiveItem' }
    ],
    related: timeSensitive
      ? [
          { id: 'story-002', type: 'Story', title: '九间棚：悬崖峭壁上修出致富路' },
          { id: 'story-005', type: 'Story', title: '新红嫂拥军志愿服务队' },
          { id: 'story-010', type: 'Story', title: '"水乳交融、生死与共"的党建实践' }
        ]
      : [
          { id: 'person-001', type: 'Person', title: '明德英' },
          { id: 'person-002', type: 'Person', title: '王换于' },
          { id: 'k-003', type: 'Knowledge', title: '核心内涵' }
        ]
  };
}

// 内容治理状态：种子数据一律 'draft'（HERITAGE_CONTENT_GOVERNANCE_V0.1）
// 本数据集是工程测试种子（Mock Seed），不是官方史料库；正式内容须经审核与核验后由中台/知识层供给。
const HERITAGE_ENTITIES = [archives, people, stories, media, timeline, origin];
HERITAGE_ENTITIES.forEach((list) => list.forEach((item) => { item.contentStatus = 'draft'; }));

module.exports = { archives, people, stories, media, timeline, origin, gradeLabels: GRADE_LABELS, aiChat };
