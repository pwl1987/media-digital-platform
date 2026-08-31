export interface ApiError { code: string; message: string; details?: unknown }
export interface ApiResponse<T> { data: T; meta?: { request_id?: string }; error: ApiError | null }

export interface ApiTransport { request<T>(path: string, options?: { method?: string; query?: Record<string,string>; body?: unknown }): Promise<ApiResponse<T>> }

export const endpoints = {
  feeds: (id: string) => `/api/v1/feeds/${encodeURIComponent(id)}`,
  search: '/api/v1/search',
  content: (id: string) => `/api/v1/contents/${encodeURIComponent(id)}`,
  news: '/api/v1/news',
  newsDetail: (id: string) => `/api/v1/news/${encodeURIComponent(id)}`,
  works: '/api/v1/opera/works',
  workDetail: (id: string) => `/api/v1/opera/works/${encodeURIComponent(id)}`,
  events: '/api/v1/opera/events',
  eventDetail: (id: string) => `/api/v1/opera/events/${encodeURIComponent(id)}`,
  videos: '/api/v1/opera/videos',
  videoDetail: (id: string) => `/api/v1/opera/videos/${encodeURIComponent(id)}`,
  yimengAI: '/api/v1/yimeng/ai/chat'
} as const;

export function createClient(transport: ApiTransport) {
  return {
    getNews: (query?: Record<string,string>) => transport.request(endpoints.news, { query }),
    getNewsDetail: (id: string) => transport.request(endpoints.newsDetail(id)),
    getWork: (id: string) => transport.request(endpoints.workDetail(id)),
    getEvent: (id: string) => transport.request(endpoints.eventDetail(id)),
    getVideo: (id: string) => transport.request(endpoints.videoDetail(id)),
    getContent: (id: string) => transport.request(endpoints.content(id)),
    search: (q: string) => transport.request(endpoints.search, { query: { q } }),
    chat: (message: string, sessionId?: string, context?: unknown) => transport.request(endpoints.yimengAI, { method: 'POST', body: { message, session_id: sessionId, context } })
  };
}
