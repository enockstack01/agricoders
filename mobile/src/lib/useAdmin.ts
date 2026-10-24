import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { NavRole } from './useResource';

/*
 * Data hooks for the Administration area (Admin Panel and User Management). Same /api/admin
 * endpoints and payloads as the website. The server checks the role on every call, so these
 * hooks only work for admins (and super admins for role changes).
 */

export type AdminStats = {
  totalUsers: number;
  totalSubmissions: number;
  plansThisWeek: number;
  activeUsers: number;
  admins: number;
  /** plans created per day over the last 7 days, keyed by ISO date */
  dailyCounts: Record<string, number>;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: NavRole;
  submissionCount: number;
  lastActive: number;
  createdAt: number;
  imageUrl?: string;
  credits: number;
};

export type AdminPlan = {
  _id: string;
  userId: string;
  userName: string;
  createdAt?: string;
  companyInfo?: { companyName?: string; productName?: string; companyFocus?: string; location?: string; currency?: string };
};

export type AdminCreditRequest = {
  _id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: { type: string; count: number }[];
  creditsRequested: number;
  note?: string;
  adminNote?: string;
  createdAt: string;
  user: { name?: string; email?: string; imageUrl?: string };
};

export type AdminTransaction = {
  _id?: string;
  type: string;
  credits: number;
  balanceAfter: number;
  paymentAmount?: number;
  currency?: string;
  note?: string;
  createdAt: string;
};

export type RequestFilter = 'pending' | 'approved' | 'rejected' | 'all';

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get('/admin/stats').then((r) => r.data),
  });
}

export function useAdminUsers() {
  return useQuery<{ users: AdminUser[]; total: number }>({
    queryKey: ['admin', 'users'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
  });
}

const PAGE = 20;

/** Every plan on the platform, newest first, loaded a page at a time. */
export function useAdminPlans(search: string) {
  return useInfiniteQuery<{ submissions: AdminPlan[]; total: number; page: number }>({
    queryKey: ['admin', 'plans', search],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      api.get('/admin/submissions', { params: { page: pageParam, limit: PAGE, search: search || undefined } }).then((r) => r.data),
    getNextPageParam: (last) => (last.page * PAGE < last.total ? last.page + 1 : undefined),
  });
}

export function useCreditRequests(status: RequestFilter) {
  return useQuery<AdminCreditRequest[]>({
    queryKey: ['admin', 'requests', status],
    queryFn: () => api.get('/admin/credits/requests', { params: { status } }).then((r) => (Array.isArray(r.data) ? r.data : [])),
  });
}

export function useReviewRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, adminNote }: { id: string; action: 'approve' | 'reject'; adminNote?: string }) =>
      api.patch(`/admin/credits/requests/${id}`, { action, adminNote }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'requests'] });
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUserCredits(userId?: string) {
  return useQuery<{ credits: number; transactions: AdminTransaction[] }>({
    queryKey: ['admin', 'user-credits', userId],
    queryFn: () => api.get('/admin/credits/assign', { params: { userId } }).then((r) => r.data),
    enabled: !!userId,
  });
}

export function useAdjustCredits() {
  const qc = useQueryClient();
  const done = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    qc.invalidateQueries({ queryKey: ['admin', 'user-credits'] });
  };
  const assign = useMutation({
    mutationFn: (p: { userId: string; credits: number; paymentAmount?: number; currency?: string; note?: string }) =>
      api.post('/admin/credits/assign', p).then((r) => r.data as { newBalance: number }),
    onSuccess: done,
  });
  const deduct = useMutation({
    mutationFn: (p: { userId: string; credits: number; note?: string }) =>
      api.post('/admin/credits/deduct', p).then((r) => r.data as { newBalance: number; deducted: number }),
    onSuccess: done,
  });
  return { assign, deduct };
}

export function useSetUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: NavRole }) => api.put('/admin/users/role', { userId, role }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}
