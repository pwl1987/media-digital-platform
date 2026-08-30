// 小戏小剧 · 数据兼容层：转发共享数据集 packages/mock-data/opera.js
// 作用：消除页面内联 Mock 副本（AGENTS.md 已知坑收口的第一步）。
// 旧页面字段差异在此适配（events.status、works.performances 反规范化）；
// 新页面一律走 utils/api.js（共享 client），后续批次迁完页面后本文件退役。
const shared = require('../../../packages/mock-data/opera.js');

const works = shared.works.map((w) => ({
  ...w,
  performances: shared.performances
    .filter((p) => p.workId === w.id)
    .map((p) => ({ id: p.id, title: p.title, date: p.startAt, place: p.place }))
}));

const events = shared.events.map((e) => ({ ...e, status: e.lifecycleStatus, works: e.workIds }));

// 直播：契约 /opera/live 待接入，暂保留本地预告数据
const lives = [
  { id: 'live-001', title: '2026沂蒙小戏小剧展演直播', status: 'upcoming', startAt: '2026-09-05T19:30:00+08:00', place: '临沂文化艺术中心' },
  { id: 'live-002', title: '红色题材精品专场直播', status: 'ended', startAt: '2026-08-22T19:30:00+08:00', place: '临沂剧院' }
];

module.exports = {
  works,
  artists: shared.artists,
  organizations: shared.organizations,
  events,
  performances: shared.performances,
  news: shared.news,
  videos: shared.videos,
  lives
};
