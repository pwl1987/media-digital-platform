const knowledgeItems = [
  { id: 'person-001', type: 'Person', title: '沂蒙红嫂代表人物', summary: '以红色故事呈现沂蒙人民无私奉献、军民鱼水情深的历史记忆。', tag: '人物', path: '/pages/detail/detail?type=person&id=person-001' },
  { id: 'story-001', type: 'Story', title: '沂蒙红嫂的故事', summary: '从一件小事走进一段共同记忆，感受沂蒙精神的群众基础。', tag: '故事', path: '/pages/detail/detail?type=story&id=story-001' },
  { id: 'history-001', type: 'Content', title: '沂蒙精神形成与发展', summary: '以时间轴方式了解沂蒙精神的历史形成、发展与时代价值。', tag: '历史', path: '/pages/detail/detail?type=content&id=history-001' },
  { id: 'place-001', type: 'Place', title: '沂蒙红色文化地标', summary: '汇集红色纪念馆、教育基地和重要历史地点。', tag: '地点', path: '/pages/detail/detail?type=place&id=place-001' }
];
const featured = [
  { id: 'f-001', title: '沂蒙精神：一座精神丰碑', type: '专题', path: '/pages/detail/detail?type=content&id=f-001' },
  { id: 'f-002', title: '从历史人物读懂沂蒙', type: '人物', path: '/pages/detail/detail?type=person&id=f-002' },
  { id: 'f-003', title: '沂蒙故事影像志', type: '影像', path: '/pages/detail/detail?type=media&id=f-003' }
];
module.exports = { knowledgeItems, featured };
