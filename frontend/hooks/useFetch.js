import { useState, useEffect, useCallback, useRef } from 'react';

export const useFetch = (fetchFn, dependencies = [], options = {}) => {
  const {
    initialData = null,
    enabled = true,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      if (isMountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'An error occurred');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn]);

  useEffect(() => {
    if (enabled !== false) {
      refetch();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch,
    setData,
  };
};

export default useFetch;
