const DEFAULT_GEMINI_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-2.5-pro',
  'gemini-pro-latest',
];

const MODEL_EXHAUSTION_DURATION_MS = Number(process.env.GEMINI_MODEL_EXHAUSTION_MS || 5 * 60 * 1000);
const exhaustedGeminiModels = new Map<string, number>();

export function uniqueStrings(values: Array<string | undefined | null>, limit = 12): string[] {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))].slice(0, limit);
}

export function getGeminiModelCandidates(envValue = process.env.GEMINI_MODELS): string[] {
  const configuredModels = (envValue || '')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean);

  return uniqueStrings([...(configuredModels.length ? configuredModels : DEFAULT_GEMINI_MODELS), ...DEFAULT_GEMINI_MODELS]);
}

function getErrorStatus(error: any): number {
  return Number(error?.status || error?.error?.code || error?.code || 0);
}

export function isGeminiQuotaError(error: any): boolean {
  const status = getErrorStatus(error);
  const message = String(error?.message || '').toLowerCase();

  return status === 429
    || message.includes('resource_exhausted')
    || message.includes('quota exceeded')
    || message.includes('too many requests')
    || message.includes('prepayment credits are depleted');
}

export function isRetryableGeminiError(error: any): boolean {
  const status = getErrorStatus(error);
  if ([429, 500, 502, 503, 504].includes(status)) return true;

  const message = String(error?.message || '').toLowerCase();
  if (status === 404 && message.includes('not found')) return true;

  return message.includes('high demand')
    || message.includes('unavailable')
    || message.includes('try again later')
    || message.includes('temporar')
    || message.includes('timeout');
}

export function clearExpiredGeminiExhaustions(now = Date.now()): void {
  for (const [model, exhaustedUntil] of exhaustedGeminiModels.entries()) {
    if (now >= exhaustedUntil) {
      exhaustedGeminiModels.delete(model);
    }
  }
}

export function clearExhaustedGeminiModels(): void {
  exhaustedGeminiModels.clear();
}

export function markGeminiModelExhausted(model: string, now = Date.now()): void {
  exhaustedGeminiModels.set(model, now + MODEL_EXHAUSTION_DURATION_MS);
}

export function isGeminiModelExhausted(model: string, now = Date.now()): boolean {
  clearExpiredGeminiExhaustions(now);
  return exhaustedGeminiModels.has(model);
}

export function nextAvailableGeminiModel(candidates: string[], attemptedModels: Set<string>): string | null {
  clearExpiredGeminiExhaustions();
  return candidates.find((model) => model && !attemptedModels.has(model) && !exhaustedGeminiModels.has(model)) || null;
}

export function getGeminiResponseText(response: any): string {
  if (typeof response?.text === 'string') return response.text;
  const part = response?.candidates?.[0]?.content?.parts?.find((item: any) => typeof item?.text === 'string');
  return part?.text || '';
}
