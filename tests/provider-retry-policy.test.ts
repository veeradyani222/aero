import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clearExhaustedGeminiModels,
  getGeminiModelCandidates,
  isGeminiModelExhausted,
  markGeminiModelExhausted,
} from '../src/lib/api-providers/gemini-retry-policy.ts';
import { isOpenAIKeyError, isOpenAIQuotaError } from '../src/lib/api-providers/openai-retry-policy.ts';

test('Gemini defaults match Bloom-style lite-first model rotation', () => {
  assert.deepEqual(getGeminiModelCandidates(undefined), [
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-flash-latest',
    'gemini-2.5-pro',
    'gemini-pro-latest',
  ]);
});

test('Gemini quota exhaustion marks a model unavailable temporarily', () => {
  clearExhaustedGeminiModels();

  assert.equal(isGeminiModelExhausted('gemini-2.5-flash-lite', 1000), false);
  markGeminiModelExhausted('gemini-2.5-flash-lite', 1000);
  assert.equal(isGeminiModelExhausted('gemini-2.5-flash-lite', 1000), true);
  assert.equal(isGeminiModelExhausted('gemini-2.5-flash-lite', 1000 + 5 * 60 * 1000 + 1), false);
});

test('OpenAI retry policy identifies key and quota errors', () => {
  assert.equal(isOpenAIKeyError({ status: 401, message: 'Incorrect API key provided' }), true);
  assert.equal(isOpenAIQuotaError({ status: 429, message: 'You exceeded your current quota' }), true);
  assert.equal(isOpenAIKeyError({ status: 500, message: 'server exploded' }), false);
});
