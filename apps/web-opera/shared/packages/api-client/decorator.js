// 装饰器层：纯函数，不依赖任何端 API（H5 / APP / 小程序通用）
// 用于 facade 在拿到 raw payload 后加工展示字段（中文徽章、时长角标等）。

const SOURCE_LEVEL_LABELS = { official: '官方发布', organizer: '官方发布', media: '媒体报道', historical: '历史资料', user: '用户内容' };

function formatDuration(seconds) {
  const s = Number(seconds || 0);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

function decorateNews(item) {
  if (!item) return item;
  return { ...item, sourceLevelLabel: SOURCE_LEVEL_LABELS[item.sourceLevel] || '官方发布' };
}

function decorateVideo(item) {
  if (!item) return item;
  return { ...item, durationLabel: formatDuration(item.durationSeconds), tags: item.tags || [] };
}

function decorateList(list, mapper) {
  if (!list || !Array.isArray(list.items)) return list;
  return { ...list, items: list.items.map(mapper) };
}

module.exports = {
  SOURCE_LEVEL_LABELS,
  formatDuration,
  decorateNews,
  decorateVideo,
  decorateList
};