import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { api } from './api';
import type { FormSubmission, UserProfileDefaults } from '../shared/types';

/*
 * Data hooks for the Agriplan API (the Next.js site's /api routes). Same endpoints and
 * payloads as the website; the Clerk session token is attached by lib/api.ts.
 */

export type PlanInput = Omit<FormSubmission, 'userId' | 'createdAt' | 'updatedAt'>;
export type Submission = PlanInput & { _id: string; createdAt: string; updatedAt?: string };
export type DocMeta = Record<string, { docx?: string; docxEditedAt?: string; xlsx?: string }>;
export type Transaction = {
  type: string; credits: number; balanceAfter: number; currency?: string;
  paymentAmount?: number; note?: string; createdAt: string;
};
export type CreditRequest = {
  _id: string; status: 'pending' | 'approved' | 'rejected';
  documents: { type: string; count: number }[]; creditsRequested: number;
  note?: string; adminNote?: string; createdAt: string;
};
export type Notif = { _id: string; type: string; title: string; body: string; read: boolean; createdAt: string };
export type NavRole = 'user' | 'admin' | 'super_admin';

/** Role from Clerk public metadata — same source as the website. */
export function useRole(): NavRole {
  const { user } = useUser();
  return ((user?.publicMetadata as any)?.role as NavRole) ?? 'user';
}

/* ------------------------------------------------------------------ plans */
export function useSubmissions() {
  return useQuery<Submission[]>({
    queryKey: ['submissions'],
    queryFn: () => api.get('/submissions').then((r) => (Array.isArray(r.data) ? r.data : [])),
  });
}

export function useSubmission(id?: string) {
  return useQuery<Submission>({
    queryKey: ['submissions', id],
    queryFn: () => api.get(`/submissions/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

/** When each plan's documents were last generated (stored copies download free). */
export function useDocMeta(ids: string[]) {
  const key = ids.join(',');
  return useQuery<DocMeta>({
    queryKey: ['doc-meta', key],
    queryFn: () => api.get('/documents/meta', { params: { ids: key } }).then((r) => r.data || {}),
    enabled: ids.length > 0,
  });
}

export function usePlanMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['submissions'] });

  const create = useMutation({
    mutationFn: (body: PlanInput) => api.post('/submissions', body).then((r) => r.data as { id: string }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/submissions/${id}`).then((r) => r.data),
    onSuccess: invalidate,
  });
  /** The API has no update route — the website edits by deleting and re-creating; so do we. */
  const replace = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: PlanInput }) => {
      await api.delete(`/submissions/${id}`);
      return api.post('/submissions', body).then((r) => r.data as { id: string });
    },
    onSuccess: invalidate,
  });
  return { create, remove, replace };
}

/* ---------------------------------------------------------------- credits */
export function useCredits() {
  return useQuery<{ credits: number; transactions: Transaction[] }>({
    queryKey: ['credits'],
    queryFn: () => api.get('/credits').then((r) => ({ credits: r.data.credits ?? 0, transactions: r.data.transactions ?? [] })),
  });
}

export function useCreditRequests() {
  return useQuery<CreditRequest[]>({
    queryKey: ['credit-requests'],
    queryFn: () => api.get('/credits/request').then((r) => (Array.isArray(r.data) ? r.data : [])),
  });
}

export function useRequestCredits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { documents: { type: 'business-plan' | 'financial-model'; count: number }[]; note?: string }) =>
      api.post('/credits/request', body).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['credit-requests'] }),
  });
}

/* ---------------------------------------------------------------- profile */
/** Plan defaults (currency, tax, loan…) that pre-fill every new plan. */
export function useProfile() {
  const query = useQuery<{ defaults: UserProfileDefaults }>({
    queryKey: ['profile'],
    queryFn: () => api.get('/profile').then((r) => r.data),
    staleTime: 60_000,
    // the startup gate shows its own Retry, so fail fast instead of stacking timeouts
    retry: false,
  });
  return {
    profile: query.data ?? null,
    defaults: query.data?.defaults ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error as any,
    refetch: query.refetch,
  };
}

export function useSaveProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (defaults: UserProfileDefaults) => api.put('/profile', defaults).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
}

/* ---------------------------------------------------------- notifications */
export function useNotifications() {
  return useQuery<Notif[]>({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then((r) => r.data.notifications ?? []),
    refetchInterval: 30_000,
  });
}

export function useNotificationMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['notifications'] });
  const setRead = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => api.patch('/notifications', { id, read }),
    onSuccess: invalidate,
  });
  const markAllRead = useMutation({ mutationFn: () => api.patch('/notifications', {}), onSuccess: invalidate });
  return { setRead, markAllRead };
}

/* -------------------------------------------------------------- AI assist */
/** Same endpoint as the website's "Generate with AI" buttons; returns the section content. */
export async function generateWithAI(section: string, context: Record<string, unknown>): Promise<unknown> {
  const { data } = await api.post('/ai/generate', { section, ...context });
  return data.content;
}
