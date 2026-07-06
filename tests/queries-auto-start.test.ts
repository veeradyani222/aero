import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clearPendingQueryProcessingBrandId,
  getPendingQueryProcessingBrandId,
  setPendingQueryProcessingBrandId,
} from '../src/lib/queries-auto-start';

function createMockStorage() {
  const values = new Map<string, string>();

  return {
    getItem(key: string) {
      return values.has(key) ? values.get(key)! : null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    removeItem(key: string) {
      values.delete(key);
    },
  };
}

test('query processing auto-start flag can be stored, read, and cleared', () => {
  const storage = createMockStorage();

  assert.equal(getPendingQueryProcessingBrandId(storage), null);

  setPendingQueryProcessingBrandId('brand_123', storage);
  assert.equal(getPendingQueryProcessingBrandId(storage), 'brand_123');

  clearPendingQueryProcessingBrandId(storage);
  assert.equal(getPendingQueryProcessingBrandId(storage), null);
});
