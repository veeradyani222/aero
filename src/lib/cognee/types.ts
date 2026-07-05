export type CogneeSearchType =
  | 'GRAPH_COMPLETION'
  | 'RAG_COMPLETION'
  | 'CHUNKS'
  | 'SUMMARIES';

export interface CogneeSearchRequest {
  query: string;
  search_type?: CogneeSearchType;
  datasets?: string[];
}

export interface CogneeAddRequest {
  data: string;
  datasetName?: string;
}

export interface CogneeCognifyRequest {
  datasets: string[];
}

export interface CogneeSearchResult {
  content: string;
  raw: unknown;
}

export interface CogneeSyncPayload {
  brandId: string;
  brandName: string;
  brandDomain?: string;
  queryResults?: unknown[];
  summary?: {
    totalQueries?: number;
    processedQueries?: number;
    totalErrors?: number;
  };
  analyticsSnapshot?: Record<string, unknown>;
}

export interface CogneeStatus {
  configured: boolean;
  reachable: boolean;
  cloudUrl?: string;
}
