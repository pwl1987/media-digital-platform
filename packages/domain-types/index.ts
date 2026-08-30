export type ContentStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'unpublished' | 'retracted';
export type ContentSourceLevel = 'official' | 'organizer' | 'media' | 'historical' | 'user';
export type EventLifecycleStatus = 'upcoming' | 'ongoing' | 'ended' | 'cancelled';
export type LiveStatus = 'upcoming' | 'live' | 'ended' | 'offline';
export type ContentType = 'Content' | 'News' | 'Story' | 'Person' | 'Organization' | 'Place' | 'Work' | 'Event' | 'Performance' | 'MediaAsset' | 'Topic' | 'Evidence' | 'Knowledge' | 'ArchiveItem' | 'TimelineEvent';

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
export interface Event extends BaseContent { type: 'Event'; lifecycleStatus: EventLifecycleStatus; startAt?: string; endAt?: string; placeId?: string; performanceIds?: string[]; }
export interface Performance extends BaseContent { type: 'Performance'; workId: string; eventId?: string; startAt?: string; placeId?: string; }
export interface MediaAsset extends BaseContent { type: 'MediaAsset'; mediaType: 'image' | 'video' | 'audio' | 'document' | 'live'; url?: string; durationSeconds?: number; liveStatus?: LiveStatus; }
export interface Topic extends BaseContent { type: 'Topic'; itemIds?: string[]; }
export interface Evidence extends BaseContent { type: 'Evidence'; sourceId?: string; excerpt?: string; grade?: HeritageSourceGrade; refId?: string; refType?: ContentType; }
export interface Knowledge extends BaseContent { type: 'Knowledge'; evidenceIds?: string[]; }

// ---- Heritage Knowledge Layer（沂蒙精神数字传承平台，对齐 docs/domain/HERITAGE_DOMAIN_MODEL_V0.2.md）----

export type HeritageSourceGrade = 'A' | 'B' | 'C' | 'D';
// A=官方档案  B=权威出版物  C=权威媒体  D=一般资料
// 三轴分离：grade=来源等级；contentStatus=内容治理状态（核验/审核，HERITAGE_CONTENT_GOVERNANCE_V0.1）；
// status=渠道发布状态（沿用 BaseContent）。Mock 种子数据 contentStatus 一律 'draft'。
export type HeritageContentStatus = 'draft' | 'reviewing' | 'verified' | 'published' | 'archived';
export type ArchiveType = 'document' | 'image' | 'press' | 'file' | 'oral-history' | 'video' | 'audio';
export type HeritageEra = '1910s' | '1920s' | '1930s' | '1940s' | '1950s' | '1960s-70s' | '1980s-90s' | '2000s' | '2010s' | 'new-era';
export type StoryType = 'new-era-practice' | 'grassroots' | 'education-case' | 'culture';

export interface SourceReference {
  id: string;
  name: string;
  locator?: string;
  grade: HeritageSourceGrade;
  note?: string;
}

export interface HeritageResourceBase extends BaseContent {
  grade: HeritageSourceGrade;
  contentStatus: HeritageContentStatus;
  sourceReferences?: SourceReference[];
  era?: HeritageEra;
  topicIds?: string[];
  references?: string[];
  citedBy?: string[];
}

export interface ArchiveItem extends HeritageResourceBase {
  type: 'ArchiveItem';
  archiveType: ArchiveType;
  custody?: string;
  citationId?: string;
  physical?: 'original' | 'copy';
  transcript?: string;
  relatedPersonIds?: string[];
  relatedEventIds?: string[];
}

export interface HeritageStory extends HeritageResourceBase {
  type: 'Story';
  storyType: StoryType;
  happenedAt?: string;
  place?: string;
  personIds?: string[];
}

export interface HeritagePerson extends Person {
  birthYear?: number;
  deathYear?: number;
  identity?: string;
  deeds?: string;
  archiveIds?: string[];
  mediaIds?: string[];
  honors?: string[];
}

export interface TimelineEvent extends BaseContent {
  type: 'TimelineEvent';
  date: string;
  era: HeritageEra;
  place?: string;
  summary?: string;
  personIds?: string[];
  resourceIds?: string[];
  contentStatus?: HeritageContentStatus;
}

export type HeritageResource = ArchiveItem | HeritageStory | HeritagePerson | TimelineEvent;
// 预留（Y1.1 extension，暂不实现）：HeritagePlace——见 HERITAGE_DOMAIN_MODEL_V0.2.md §2.6

export interface FeedSection<T = unknown> { id: string; type: string; title?: string; items: T[]; }
export interface Feed { id: string; sections: FeedSection[]; generatedAt?: string; }
export interface Paginated<T> { items: T[]; page: number; pageSize: number; total?: number; hasMore: boolean; }

export type Content = BaseContent | News | Work | Person | Organization | Event | Performance | MediaAsset | Topic | Evidence | Knowledge | ArchiveItem | HeritageStory | HeritagePerson | TimelineEvent;
