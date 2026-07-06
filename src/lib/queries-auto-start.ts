const QUERY_PROCESSING_AUTOSTART_KEY = 'aero.pending-query-processing-brand-id';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function getSessionStorage(): StorageLike | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
}

export function getPendingQueryProcessingBrandId(storage: StorageLike | null = getSessionStorage()): string | null {
  if (!storage) {
    return null;
  }

  const value = storage.getItem(QUERY_PROCESSING_AUTOSTART_KEY);
  return value && value.trim() ? value : null;
}

export function setPendingQueryProcessingBrandId(
  brandId: string,
  storage: StorageLike | null = getSessionStorage()
): void {
  if (!storage || !brandId.trim()) {
    return;
  }

  storage.setItem(QUERY_PROCESSING_AUTOSTART_KEY, brandId.trim());
}

export function clearPendingQueryProcessingBrandId(storage: StorageLike | null = getSessionStorage()): void {
  if (!storage) {
    return;
  }

  storage.removeItem(QUERY_PROCESSING_AUTOSTART_KEY);
}
