import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that fetches data on mount and auto-refreshes at an interval.
 * @param {Function} fetchFn - async function that returns data
 * @param {number} intervalMs - refresh interval in ms (default 30000)
 * @returns {{ data, loading, error, lastUpdated, refresh }}
 */
export function useAutoRefresh(fetchFn, intervalMs = 30000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!mounted) return;
      await refresh();
    };
    load();
    const id = setInterval(load, intervalMs);
    return () => { mounted = false; clearInterval(id); };
  }, [refresh, intervalMs]);

  return { data, loading, error, lastUpdated, refresh };
}
