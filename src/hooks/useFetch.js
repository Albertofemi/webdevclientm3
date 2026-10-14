import { useCallback, useEffect, useState } from 'react';
import { BASE } from '../api.js';
import { getCached, setCached } from '../cache.js';

const IDLE = { status: 'idle', data: null, error: null, fromCache: false };

/**
 * Fetches `path` (relative to the API base) and returns { status, data, error, fromCache, refetch }.
 * - status: 'idle' | 'loading' | 'success' | 'error'
 * - Pass null to skip the request.
 * - Responses are cached in localStorage; in-flight requests are aborted when `path` changes.
 */
export function useFetch(path) {
  const [state, setState] = useState(IDLE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!path) {
      setState(IDLE);
      return;
    }

    const cached = getCached(path);
    if (cached) {
      setState({ status: 'success', data: cached, error: null, fromCache: true });
      return;
    }

    const controller = new AbortController();
    setState({ ...IDLE, status: 'loading' });

    (async () => {
      try {
        const res = await fetch(`${BASE}/${path}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`The server answered with status ${res.status}.`);
        const data = await res.json();
        setCached(path, data);
        setState({ status: 'success', data, error: null, fromCache: false });
      } catch (error) {
        if (error.name === 'AbortError') return; // the effect was cleaned up
        setState({ status: 'error', data: null, error, fromCache: false });
      }
    })();

    return () => controller.abort();
  }, [path, attempt]);

  const refetch = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, refetch };
}
