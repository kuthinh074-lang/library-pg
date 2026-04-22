import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

// ─── Generic fetch hook ────────────────────────────────────────────────────────
export function useFetch(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── Paginated list hook ────────────────────────────────────────────────────────
export function usePaginatedList(apiFn, initialParams = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, ...initialParams });

  const load = useCallback(async (p) => {
    setLoading(true);
    try {
      const res = await apiFn(p);
      setItems(res.data.items || res.data);
      setTotal(res.data.total || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => { load(params); }, [params, load]);

  const setPage = (page) => setParams((p) => ({ ...p, page }));
  const setSearch = (search) => setParams((p) => ({ ...p, search, page: 1 }));
  const setFilter = (key, value) => setParams((p) => ({ ...p, [key]: value, page: 1 }));
  const refetch = () => load(params);

  return { items, total, loading, params, setPage, setSearch, setFilter, refetch };
}

// ─── Mutation hook (create / update / delete) ──────────────────────────────────
export function useMutation(apiFn, { onSuccess, successMsg, errorMsg } = {}) {
  const [loading, setLoading] = useState(false);

  const mutate = async (...args) => {
    setLoading(true);
    try {
      const res = await apiFn(...args);
      if (successMsg) toast.success(successMsg);
      if (onSuccess) onSuccess(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || errorMsg || 'Có lỗi xảy ra';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading };
}
