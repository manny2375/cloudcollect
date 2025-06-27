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

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiClient.request('/users');
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUser = async (id: string, updates: any) => {
    try {
      await apiClient.request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      
      setUsers(prevUsers => 
        prevUsers.map((user: any) => 
          user.id === id ? { ...user, ...updates } : user
        )
      );
      
      return { success: true };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiClient.request(`/users/${id}`, {
        method: 'DELETE'
      });
      
      setUsers(prevUsers => prevUsers.filter((user: any) => user.id !== id));
      
      return { success: true };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  return { users, loading, error, updateUser, deleteUser, refetch: () => fetchUsers() };
}

export { apiClient };