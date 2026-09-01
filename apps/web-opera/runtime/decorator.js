// 装饰层（与 H5 / 小程序端同源 ESM 镜像）
const SOURCE_LEVEL_LABELS = { official: '官方发布', organizer: '官方发布', media: '媒体报道', historical: '历史资料', user: '用户内容' };

export function formatDuration(seconds) {
  const s = Number(seconds || 0);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function decorateNews(item) {
  if (!item) return item;
  return { ...item, sourceLevelLabel: SOURCE_LEVEL_LABELS[item.sourceLevel] || '官方发布' };
}

export function decorateVideo(item) {
  if (!item) return item;
  return { ...item, durationLabel: formatDuration(item.durationSeconds), tags: item.tags || [] };
}

export { SOURCE_LEVEL_LABELS };