import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook with loading / error / data states.
 *
 * @param {() => Promise<{ data: any }>} fetcher  API call returning { data }.
 * @param {any[]} deps  Dependency array — refetches when these change.
 * @param {object} opts  { enabled, onSuccess, onError }
 */
export function useApi(fetcher, deps = [], opts = {}) {
  const { enabled = true, onSuccess, onError } = opts;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcher();
      setData(response.data ?? response);
      onSuccess?.(response.data ?? response);
    } catch (err) {
      const message = err.message || 'Something went wrong';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (enabled) execute();
  }, [execute, enabled]);

  const refetch = useCallback(() => execute(), [execute]);

  return { data, loading, error, refetch };
}
