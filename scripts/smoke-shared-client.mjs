import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createExperienceClient } = require('../packages/api-client/create-client.js');
const heritage = require('../packages/mock-data/heritage.js');

const client = createExperienceClient();

const news = await client.getNews();
if (news.error || !news.data?.items?.length) throw new Error('News endpoint smoke check failed');

const work = await client.getWork('work-001');
if (work.error || work.data?.id !== 'work-001') throw new Error('Work detail smoke check failed');

const search = await client.search('红嫂');
if (search.error || !search.data?.items?.length) throw new Error('Search smoke check failed');

// ---- Yimeng Heritage（契约 V0.2 §5）----

const archives = await client.getArchives({ pageSize: 50 });
if (archives.error || archives.data?.items?.length < 20) throw new Error('Heritage archives list smoke check failed');
const grades = new Set(['A', 'B', 'C', 'D']);
if (!archives.data.items.every((item) => grades.has(item.grade))) throw new Error('Archive grade field smoke check failed');

const oral = await client.getArchives({ archiveType: 'oral-history', pageSize: 50 });
if (oral.error || !oral.data.items.every((item) => item.archiveType === 'oral-history')) throw new Error('Archive archiveType filter smoke check failed');

const archive = await client.getArchive('arch-001');
if (archive.error || archive.data?.id !== 'arch-001' || !archive.data?.sourceReferences?.length) throw new Error('Archive detail smoke check failed');

const timeline = await client.getTimeline();
if (timeline.error || timeline.data?.eras?.length < 5 || timeline.data?.total < 10) throw new Error('Heritage timeline smoke check failed');

const origin = await client.getOrigin();
if (origin.error || origin.data?.items?.length < 4) throw new Error('Heritage origin smoke check failed');

const people = await client.getPeople({ pageSize: 50 });
if (people.error || people.data?.items?.length < 10) throw new Error('Heritage people smoke check failed');

const chat = await client.chat('现在沂蒙精神有哪些实践？');
if (chat.error || !chat.data?.sources?.length || !chat.data.sources.every((s) => grades.has(s.grade))) throw new Error('AI chat sources grade smoke check failed');

// ---- 关系密度守卫（Y1.3 评审冻结下限）----

const eventArchiveRefs = heritage.timeline.reduce((n, e) => n + (e.resourceIds || []).filter((id) => String(id).startsWith('arch-')).length, 0);
if (eventArchiveRefs < 30) throw new Error(`TimelineEvent->Archive density check failed: ${eventArchiveRefs} < 30`);

const personStoryRefs = heritage.stories.reduce((n, s) => n + (s.personIds || []).length, 0);
if (personStoryRefs < 20) throw new Error(`Person->Story density check failed: ${personStoryRefs} < 20`);

const storyMediaRefs = heritage.stories.reduce((n, s) => n + (s.mediaIds || []).length, 0);
if (storyMediaRefs < 10) throw new Error(`Story->Media density check failed: ${storyMediaRefs} < 10`);

const archiveSourceRefs = heritage.archives.reduce((n, a) => n + (a.sourceReferences || []).length, 0);
if (archiveSourceRefs < 20) throw new Error(`Archive->SourceReference density check failed: ${archiveSourceRefs} < 20`);

// ---- 内容治理状态守卫（HERITAGE_CONTENT_GOVERNANCE_V0.1：种子一律 draft）----

const governed = [...heritage.archives, ...heritage.people, ...heritage.stories, ...heritage.media, ...heritage.timeline, ...heritage.origin];
const notDraft = governed.filter((item) => item.contentStatus !== 'draft');
if (notDraft.length) throw new Error(`Content governance check failed: ${notDraft.length} seed items are not draft`);

console.log('Shared client smoke check passed.');
