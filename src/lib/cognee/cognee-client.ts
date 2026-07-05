import type {
  CogneeAddRequest,
  CogneeCognifyRequest,
  CogneeSearchRequest,
  CogneeSearchResult,
  CogneeStatus,
} from './types';

const API_PREFIX = '/api/v1';

function getCloudUrl(): string | null {
  const url = process.env.COGNEE_CLOUD_URL?.trim();
  if (!url) return null;
  return url.replace(/\/$/, '');
}

function getApiKey(): string | null {
  return process.env.COGNEE_API_KEY?.trim() || null;
}

export function isCogneeConfigured(): boolean {
  return Boolean(getCloudUrl() && getApiKey());
}

export function getCogneeDatasetName(brandId: string): string {
  const safeId = brandId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `aero-brand-${safeId}`;
}

async function cogneeFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const baseUrl = getCloudUrl();
  const apiKey = getApiKey();

  if (!baseUrl || !apiKey) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}${API_PREFIX}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
        ...(options.headers as Record<string, string> | undefined),
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.warn(`[Cognee] ${options.method || 'GET'} ${path} failed: ${response.status}`, body.slice(0, 200));
      return null;
    }

    const text = await response.text();
    if (!text) return {} as T;

    try {
      return JSON.parse(text) as T;
    } catch {
      return { content: text } as T;
    }
  } catch (error) {
    console.warn('[Cognee] Request error:', error);
    return null;
  }
}

export async function cogneeHealthCheck(): Promise<boolean> {
  const baseUrl = getCloudUrl();
  const apiKey = getApiKey();
  if (!baseUrl || !apiKey) return false;

  try {
    const response = await fetch(`${baseUrl}/health`, {
      headers: { 'X-Api-Key': apiKey },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getCogneeStatus(): Promise<CogneeStatus> {
  const configured = isCogneeConfigured();
  if (!configured) {
    return { configured: false, reachable: false };
  }

  const reachable = await cogneeHealthCheck();
  return {
    configured: true,
    reachable,
    cloudUrl: getCloudUrl() || undefined,
  };
}

/** Ingest raw text into a brand-scoped dataset. */
export async function cogneeAdd(payload: CogneeAddRequest): Promise<unknown | null> {
  return cogneeFetch('/add', {
    method: 'POST',
    body: JSON.stringify({
      data: payload.data,
      ...(payload.datasetName ? { datasetName: payload.datasetName } : {}),
    }),
  });
}

/** Build / refresh the knowledge graph for one or more datasets. */
export async function cogneeCognify(payload: CogneeCognifyRequest): Promise<unknown | null> {
  return cogneeFetch('/cognify', {
    method: 'POST',
    body: JSON.stringify({ datasets: payload.datasets }),
  });
}

export async function cogneeRemember(datasetName: string, content: string): Promise<boolean> {
  const baseUrl = getCloudUrl();
  const apiKey = getApiKey();
  if (!baseUrl || !apiKey) return false;

  try {
    const form = new FormData();
    form.append('datasetName', datasetName);
    form.append('data', new Blob([content], { type: 'text/plain' }), 'brand-context.txt');

    const rememberResponse = await fetch(`${baseUrl}${API_PREFIX}/remember`, {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: form,
    });

    if (rememberResponse.ok) {
      return true;
    }
  } catch {
    // remember endpoint unavailable
  }

  const added = await cogneeAdd({ data: content, datasetName });
  if (!added) return false;

  const cognified = await cogneeCognify({ datasets: [datasetName] });
  return cognified !== null;
}

function extractSearchContent(raw: unknown): string {
  if (!raw) return '';
  if (typeof raw === 'string') return raw;

  if (Array.isArray(raw)) {
    return raw.map(extractSearchContent).filter(Boolean).join('\n\n');
  }

  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const candidates = [
      obj.answer,
      obj.response,
      obj.content,
      obj.text,
      obj.result,
      obj.completion,
      obj.message,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate;
      }
    }

    if (obj.data) return extractSearchContent(obj.data);
    if (obj.results) return extractSearchContent(obj.results);
  }

  return '';
}

export async function cogneeSearch(
  datasetName: string,
  query: string,
  searchType: CogneeSearchRequest['search_type'] = 'GRAPH_COMPLETION'
): Promise<CogneeSearchResult | null> {
  const raw = await cogneeFetch<unknown>('/search', {
    method: 'POST',
    body: JSON.stringify({
      query,
      search_type: searchType,
      datasets: [datasetName],
    } satisfies CogneeSearchRequest),
  });

  if (!raw) return null;

  const content = extractSearchContent(raw);
  if (!content.trim()) return null;

  return { content, raw };
}
