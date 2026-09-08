import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs an async function and tracks loading/error/data state.
 * `deps` controls when the function automatically re-runs (like useEffect deps).
 */
export function useAsync(asyncFn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      if (isMounted.current) setData(result);
    } catch (err) {
      if (isMounted.current) setError(err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    isMounted.current = true;
    run();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, refetch: run, setData };
}
