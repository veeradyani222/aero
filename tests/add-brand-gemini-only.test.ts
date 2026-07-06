import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const brandFlowFiles = [
  'src/app/api/get-company-info/route.ts',
  'src/app/dashboard/add-brand/step-2/page.tsx',
  'src/app/dashboard/add-brand/step-3/page.tsx',
];

test('add-brand flow uses Gemini without ChatGPT Search', () => {
  for (const file of brandFlowFiles) {
    const source = readFileSync(file, 'utf8');

    assert.equal(
      source.includes('chatgptsearch'),
      false,
      `${file} should not call ChatGPT Search in the brand-building flow`,
    );
  }
});
