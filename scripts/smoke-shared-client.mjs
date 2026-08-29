import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createExperienceClient } = require('../packages/api-client/create-client.js');

const client = createExperienceClient();

const news = await client.getNews();
if (news.error || !news.data?.items?.length) throw new Error('News endpoint smoke check failed');

const work = await client.getWork('work-001');
if (work.error || work.data?.id !== 'work-001') throw new Error('Work detail smoke check failed');

const search = await client.search('红嫂');
if (search.error || !search.data?.items?.length) throw new Error('Search smoke check failed');

console.log('Shared client smoke check passed.');
