import assert from 'node:assert/strict';
import test from 'node:test';
import { createFallbackCompanyInfo } from '../src/lib/company-info-fallback.ts';

test('createFallbackCompanyInfo returns a complete payload for provider outages', () => {
  const result = createFallbackCompanyInfo('https://www.Example.com/path');

  assert.equal(result.companyName, 'Example');
  assert.equal(result.website, 'https://www.example.com');
  assert.match(result.shortDescription, /example\.com/);
  assert.deepEqual(result.productsAndServices, []);
  assert.deepEqual(result.keywords, []);
  assert.deepEqual(result.competitors, []);
});
