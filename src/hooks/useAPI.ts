import { useState, useEffect } from 'react';
import { APIClient } from '../api/debtors';

// Use relative URLs since we're serving from the same origin
const apiClient = new APIClient('/api');

export function useDebtors(limit = 50, offset = 0) {
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getDebtors(limit, offset);
        setDebtors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch debtors');
      } finally {
        setLoading(false);
      }
    };

    fetchDebtors();
  }, [limit, offset]);

  return { debtors, loading, error, refetch: () => fetchDebtors() };
}

export function useDebtor(id: string) {
  const [debtor, setDebtor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDebtor = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getDebtor(id);
        setDebtor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch debtor');
      } finally {
        setLoading(false);
      }
    };

    fetchDebtor();
  }, [id]);

  return { debtor, loading, error };
}

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export { apiClient };