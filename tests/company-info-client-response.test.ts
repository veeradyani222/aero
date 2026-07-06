import assert from 'node:assert/strict';
import test from 'node:test';
import { readCompanyInfoResponse } from '../src/lib/company-info-response.ts';

test('readCompanyInfoResponse returns a useful error for non-JSON timeout responses', async () => {
  const response = new Response('An error occurred with your deployment', {
    status: 504,
    statusText: 'Gateway Timeout',
    headers: { 'content-type': 'text/plain' },
  });

  await assert.rejects(
    () => readCompanyInfoResponse(response),
    /Gateway Timeout/,
  );
});
