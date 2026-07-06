function getErrorStatus(error: any): number {
  return Number(error?.status || error?.error?.status || error?.code || 0);
}

function getErrorMessage(error: any): string {
  return String(error?.message || error?.error?.message || '').toLowerCase();
}

export function isOpenAIKeyError(error: any): boolean {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error);

  return status === 401
    || status === 403
    || message.includes('incorrect api key')
    || message.includes('invalid api key')
    || message.includes('invalid_api_key');
}

export function isOpenAIQuotaError(error: any): boolean {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error);

  return status === 429
    || message.includes('insufficient_quota')
    || message.includes('exceeded your current quota')
    || message.includes('rate limit');
}

export function shouldStopOpenAIFallbacks(error: any): boolean {
  return isOpenAIKeyError(error) || isOpenAIQuotaError(error);
}
