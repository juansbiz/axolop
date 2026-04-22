import { useCallback } from 'react';

export function usePrefetch() {
  const prefetch = useCallback((path) => {}, []);
  return prefetch;
}

export function usePrefetchSpace() {
  return useCallback(() => {}, []);
}
