export type ContentStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'unpublished' | 'retracted';
export type ContentSourceLevel = 'official' | 'organizer' | 'media' | 'historical' | 'user';
export type ContentType = 'Content' | 'News' | 'Story' | 'Person' | 'Organization' | 'Place' | 'Work' | 'Event' | 'Performance' | 'MediaAsset' | 'Topic' | 'Evidence' | 'Knowledge';

export interface RelationTarget { id: string; type: ContentType; title: string; url?: string; }
export interface ContentRelation { type: string; target: RelationTarget; }

export interface BaseContent {
  id: string;
  type: ContentType;
  title: string;
  summary?: string;
  coverUrl?: string;
  status: ContentStatus;
  sourceLevel: ContentSourceLevel;
  sourceName?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  relations?: ContentRelation[];
}

export interface News extends BaseContent {
  type: 'News';
  body?: string;
  author?: string;
  category?: string;
  attachments?: MediaAsset[];
}

export interface Work extends BaseContent {
  type: 'Work';
  organizationIds?: string[];
  artistIds?: string[];
  performanceIds?: string[];
  mediaIds?: string[];
  honors?: string[];
}

export interface Person extends BaseContent { type: 'Person'; bio?: string; organizationIds?: string[]; }
export interface Organization extends BaseContent { type: 'Organization'; intro?: string; }
export interface Event extends BaseContent { type: 'Event'; startAt?: string; endAt?: string; placeId?: string; performanceIds?: string[]; }
export interface Performance extends BaseContent { type: 'Performance'; workId: string; eventId?: string; startAt?: string; placeId?: string; }
export interface MediaAsset extends BaseContent { type: 'MediaAsset'; mediaType: 'image' | 'video' | 'audio' | 'document' | 'live'; url?: string; durationSeconds?: number; }
export interface Topic extends BaseContent { type: 'Topic'; itemIds?: string[]; }
export interface Evidence extends BaseContent { type: 'Evidence'; sourceId?: string; excerpt?: string; }
export interface Knowledge extends BaseContent { type: 'Knowledge'; evidenceIds?: string[]; }

export interface FeedSection<T = unknown> { id: string; type: string; title?: string; items: T[]; }
export interface Feed { id: string; sections: FeedSection[]; generatedAt?: string; }
export interface Paginated<T> { items: T[]; page: number; pageSize: number; total?: number; hasMore: boolean; }

export type Content = BaseContent | News | Work | Person | Organization | Event | Performance | MediaAsset | Topic | Evidence | Knowledge;
