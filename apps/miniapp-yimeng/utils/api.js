// 沂蒙精神数字传承平台 · API facade（页面唯一数据入口）
// 原则：页面禁止直接 wx.request；Mock 只替代 transport 层（AGENTS.md 项目原则 2/3）。
const { createExperienceClient } = require('../../../packages/api-client/create-client.js');
const heritage = require('../../../packages/mock-data/heritage.js');

const client = createExperienceClient();

// UI 显示中文标签：来源等级（grade）与史料类型（YIMENG_UI_VISUAL_BASELINE_V0.2 §6.1/6.2）
const GRADE_LABELS = heritage.gradeLabels;
const ARCHIVE_TYPE_LABELS = {
  document: '文献',
  image: '图片',
  press: '报刊',
  file: '档案',
  'oral-history': '口述历史',
  video: '视频',
  audio: '音频'
};
const STORY_TYPE_LABELS = {
  'new-era-practice': '新时代实践',
  grassroots: '基层实践',
  'education-case': '教育案例',
  culture: '文化传承'
};
// 内容治理状态（HERITAGE_CONTENT_GOVERNANCE_V0.1）：种子数据一律 draft，页面须标注示例属性
const CONTENT_STATUS_LABELS = {
  draft: '资料整理中（示例数据）',
  reviewing: '核验中',
  verified: '已核验',
  published: '官方发布',
  archived: '已归档'
};

function decorateArchive(item) {
  return {
    ...item,
    gradeLabel: GRADE_LABELS[item.grade] || item.grade,
    typeLabel: ARCHIVE_TYPE_LABELS[item.archiveType] || item.archiveType,
    contentStatusLabel: CONTENT_STATUS_LABELS[item.contentStatus] || item.contentStatus
  };
}

function decorateStory(item) {
  return {
    ...item,
    typeLabel: STORY_TYPE_LABELS[item.storyType] || item.storyType,
    contentStatusLabel: CONTENT_STATUS_LABELS[item.contentStatus] || item.contentStatus
  };
}

const api = {
  gradeLabels: GRADE_LABELS,
  archiveTypeLabels: ARCHIVE_TYPE_LABELS,
  contentStatusLabels: CONTENT_STATUS_LABELS,

  getOrigin: () => client.getOrigin(),
  getTimeline: () => client.getTimeline(),
  getArchives: (query) => client.getArchives(query).then((res) => ({
    ...res,
    data: res.data ? { ...res.data, items: (res.data.items || []).map(decorateArchive) } : res.data
  })),
  getArchive: (id) => client.getArchive(id).then((res) => ({
    ...res,
    data: res.data ? decorateArchive(res.data) : res.data
  })),
  getStories: (query) => client.getStories(query).then((res) => ({
    ...res,
    data: res.data ? { ...res.data, items: (res.data.items || []).map(decorateStory) } : res.data
  })),
  getPeople: (query) => client.getPeople(query),
  // 契约 V0.2 暂无 /yimeng/people/:id；人物档案从列表检索（正式接入时契约可补详情端点）
  getPerson: (id) => client.getPeople({ pageSize: 100 }).then((res) => ({
    ...res,
    data: res.data ? (res.data.items || []).find((p) => p.id === id) || null : null
  })),
  chat: (message) => client.chat(message)
};

module.exports = api;
