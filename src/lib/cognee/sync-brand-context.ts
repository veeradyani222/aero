import {
  cogneeRemember,
  getCogneeDatasetName,
  isCogneeConfigured,
} from './cognee-client';
import type { CogneeSyncPayload } from './types';

function summarizeQueryResult(result: unknown, index: number): string {
  if (!result || typeof result !== 'object') return '';

  const row = result as Record<string, unknown>;
  const query = typeof row.query === 'string' ? row.query : `Query ${index + 1}`;
  const parts: string[] = [`Query: ${query}`];

  const results = row.results as Record<string, { response?: string; citations?: number }> | undefined;
  if (results?.chatgpt?.response) {
    parts.push(`ChatGPT excerpt: ${results.chatgpt.response.slice(0, 400)}`);
    if (results.chatgpt.citations) parts.push(`ChatGPT citations: ${results.chatgpt.citations}`);
  }
  if (results?.googleAI?.response) {
    parts.push(`Google AI excerpt: ${results.googleAI.response.slice(0, 400)}`);
    if (results.googleAI.citations) parts.push(`Google AI citations: ${results.googleAI.citations}`);
  }

  return parts.join('\n');
}

export function buildBrandContextDocument(payload: CogneeSyncPayload): string {
  const lines: string[] = [
    `Brand: ${payload.brandName}`,
    `Brand ID: ${payload.brandId}`,
  ];

  if (payload.brandDomain) {
    lines.push(`Domain: ${payload.brandDomain}`);
  }

  if (payload.summary) {
    lines.push(
      `Queries processed: ${payload.summary.processedQueries ?? 0}/${payload.summary.totalQueries ?? 0}`,
      `Errors: ${payload.summary.totalErrors ?? 0}`
    );
  }

  if (payload.analyticsSnapshot) {
    lines.push('Analytics snapshot:', JSON.stringify(payload.analyticsSnapshot, null, 2));
  }

  if (payload.queryResults?.length) {
    lines.push('', 'Recent query results:');
    payload.queryResults.slice(0, 10).forEach((result, index) => {
      const summary = summarizeQueryResult(result, index);
      if (summary) lines.push(summary, '---');
    });
  }

  lines.push(
    '',
    `Synced from Aero at ${new Date().toISOString()}`,
    'Use this context to recommend how the brand can improve AI search visibility, citation coverage, and competitive positioning.'
  );

  return lines.join('\n');
}

export async function syncBrandContextToCognee(payload: CogneeSyncPayload): Promise<boolean> {
  if (!isCogneeConfigured()) return false;

  const datasetName = getCogneeDatasetName(payload.brandId);
  const document = buildBrandContextDocument(payload);

  try {
    return await cogneeRemember(datasetName, document);
  } catch (error) {
    console.warn('[Cognee] Brand sync failed:', error);
    return false;
  }
}
