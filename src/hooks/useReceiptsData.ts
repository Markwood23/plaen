"use client";

import { useState, useEffect, useCallback } from "react";

export interface Receipt {
  id: string;
  receipt_id: string;
  vendor: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  status: 'verified' | 'pending' | 'flagged';
  payment_method: string;
  description?: string;
  notes?: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
  updated_at: string;
}

interface ReceiptsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseReceiptsDataResult {
  receipts: Receipt[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  refetch: () => void;
  filters: ReceiptsFilters;
  setFilters: (filters: ReceiptsFilters) => void;
}

export function useReceiptsData(initialFilters: ReceiptsFilters = {}): UseReceiptsDataResult {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReceiptsFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page.toString());
      if (filters.limit) params.set('limit', filters.limit.toString());
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);
      if (filters.category) params.set('category', filters.category);
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/receipts?${params.toString()}`);

      if (response.status === 404) {
        // API not yet implemented - return empty state
        setReceipts([]);
        setPagination({ page: 1, limit: filters.limit || 10, total: 0, totalPages: 0 });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch receipts');
      }

      const data = await response.json();
      setReceipts(data.receipts || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
    } catch (err) {
      // If API doesn't exist yet, show empty state gracefully
      setReceipts([]);
      setPagination({ page: 1, limit: filters.limit || 10, total: 0, totalPages: 0 });
      // Only set error for actual failures, not missing API
      if (err instanceof Error && !err.message.includes('404')) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  return {
    receipts,
    loading,
    error,
    pagination,
    refetch: fetchReceipts,
    filters,
    setFilters,
  };
}

// Single receipt hook
export function useReceiptDetail(receiptId: string | null) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceipt = useCallback(async () => {
    if (!receiptId) {
      setReceipt(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/receipts/${receiptId}`);

      if (response.status === 404) {
        setReceipt(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch receipt');
      }

      const data = await response.json();
      setReceipt(data.receipt);
    } catch (err) {
      setReceipt(null);
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [receiptId]);

  useEffect(() => {
    fetchReceipt();
  }, [fetchReceipt]);

  return { receipt, loading, error, refetch: fetchReceipt };
}

// CRUD operations
export async function createReceipt(receiptData: Partial<Receipt>): Promise<{ success: boolean; receipt?: Receipt; error?: string }> {
  try {
    const response = await fetch('/api/receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receiptData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to create receipt' };
    }

    const data = await response.json();
    return { success: true, receipt: data.receipt };
  } catch (err) {
    return { success: false, error: 'Failed to create receipt' };
  }
}

export async function updateReceipt(receiptId: string, updates: Partial<Receipt>): Promise<{ success: boolean; receipt?: Receipt; error?: string }> {
  try {
    const response = await fetch(`/api/receipts/${receiptId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to update receipt' };
    }

    const data = await response.json();
    return { success: true, receipt: data.receipt };
  } catch (err) {
    return { success: false, error: 'Failed to update receipt' };
  }
}

export async function deleteReceipt(receiptId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/receipts/${receiptId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to delete receipt' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to delete receipt' };
  }
}

export async function verifyReceipt(receiptId: string): Promise<{ success: boolean; error?: string }> {
  return updateReceipt(receiptId, { status: 'verified' } as Partial<Receipt>);
}

export async function flagReceipt(receiptId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
  return updateReceipt(receiptId, { status: 'flagged', notes: reason } as Partial<Receipt>);
}
