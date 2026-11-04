import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/theme';
import { AppText, Badge, Card, ChartCard, EmptyState, Grid, PageHeader, SkeletonList, StatCard, useLayout } from '../../components/ui';
import { Button } from '../../components/Button';
import { Sheet } from '../../components/Sheet';
import { NumberField, TextAreaField, TextField } from '../../components/fields';
import { Bars } from '../../components/charts';
import { Initials, RoleBadge, SegmentedTabs, timeAgo } from '../../components/admin';
import { useToast } from '../../components/Toast';
import { useConfirm } from '../../components/Confirm';
import { haptics } from '../../lib/haptics';
import { formatDate, formatDateTime } from '../../lib/format';
import {
  AdminCreditRequest,
  AdminUser,
  RequestFilter,
  useAdjustCredits,
  useAdminPlans,
  useAdminStats,
  useAdminUsers,
  useCreditRequests,
  useReviewRequest,
  useUserCredits,
} from '../../lib/useAdmin';

type Tab = 'overview' | 'users' | 'plans' | 'requests';

/** Admin Panel: platform numbers, every user (with credits), every plan and credit requests. */
export function AdminScreen() {
  const { gutter, isWide } = useLayout();
  const [tab, setTab] = useState<Tab>('overview');
  const pending = useCreditRequests('pending');

  const header = (
    <View style={{ gap: spacing.md }}>
      <PageHeader title="Admin Panel" subtitle="Platform numbers, users, business plans and credit requests" />
      <SegmentedTabs
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'users', label: 'Users' },
          { key: 'plans', label: 'Plans' },
          { key: 'requests', label: 'Requests', badge: pending.data?.length ?? 0 },
        ]}
      />
    </View>
  );

  const listStyle = [
    { paddingHorizontal: gutter, paddingTop: 20, paddingBottom: 60, gap: spacing.md },
    isWide ? { maxWidth: 1000, width: '100%' as const, alignSelf: 'center' as const } : null,
  ];

  if (tab === 'users') return <UsersTab header={header} contentStyle={listStyle} />;
  if (tab === 'plans') return <PlansTab header={header} contentStyle={listStyle} />;
  if (tab === 'requests') return <RequestsTab header={header} contentStyle={listStyle} />;
  return <OverviewTab header={header} contentStyle={listStyle} />;
}

type TabProps = { header: React.ReactNode; contentStyle: any };

/* ---------------------------------------------------------------- Overview */
function OverviewTab({ header, contentStyle }: TabProps) {
  const { colors } = useTheme();
  const { columns } = useLayout();
  const stats = useAdminStats();
  const s = stats.data;

  const days = useMemo(() => Object.keys(s?.dailyCounts ?? {}).sort(), [s]);
  const labels = days.map((d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short' }));
  const inactive = s ? Math.max(0, s.totalUsers - s.activeUsers) : 0;
  const average = s && s.activeUsers > 0 ? (s.totalSubmissions / s.activeUsers).toFixed(1) : 'N/A';

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      contentContainerStyle={contentStyle}
      refreshControl={<RefreshControl refreshing={stats.isRefetching} onRefresh={() => stats.refetch()} tintColor={colors.primary} />}
      ListHeaderComponent={
        <View style={{ gap: spacing.lg }}>
          {header}
          {stats.isLoading ? <SkeletonList rows={3} /> : null}
          {stats.isError ? <EmptyState icon="circle-exclamation" title="Could not load the numbers" description={(stats.error as any)?.message} actionLabel="Try again" onAction={() => stats.refetch()} /> : null}
          {s ? (
            <>
              <Grid columns={columns >= 3 ? 3 : 2} gap={spacing.md}>
                <StatCard icon="users" label="Total users" value={s.totalUsers} />
                <StatCard icon="file-lines" label="Total plans" value={s.totalSubmissions} />
                <StatCard icon="calendar" label="Plans this week" value={s.plansThisWeek} />
                <StatCard icon="user-check" label="Active users" value={s.activeUsers} />
                <StatCard icon="user-shield" label="Admins" value={s.admins} />
                <StatCard icon="chart-line" label="Plans per active user" value={average} />
              </Grid>
              <ChartCard title="Plans Created, Last 7 Days" icon="chart-column">
                <Bars labels={labels} datasets={[{ label: 'Plans', data: days.map((d) => s.dailyCounts[d] ?? 0) }]} height={200} emptyLabel="No plans this week" />
                <AppText variant="caption" style={{ marginTop: 10 }}>{inactive} registered user{inactive === 1 ? '' : 's'} have not created a plan yet.</AppText>
              </ChartCard>
            </>
          ) : null}
        </View>
      }
    />
  );
}

/* ------------------------------------------------------------------- Users */
function UsersTab({ header, contentStyle }: TabProps) {
  const { colors } = useTheme();
  const users = useAdminUsers();
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState<AdminUser | null>(null);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    const all = users.data?.users ?? [];
    return q ? all.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) : all;
  }, [users.data, search]);

  return (
    <>
      <FlatList
        data={users.isLoading ? [] : list}
        keyExtractor={(u) => u.id}
        contentContainerStyle={contentStyle}
        refreshControl={<RefreshControl refreshing={users.isRefetching} onRefresh={() => users.refetch()} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={{ gap: spacing.md, marginBottom: 4 }}>
            {header}
            <TextField icon="magnifying-glass" placeholder="Search users by name or email" value={search} onChangeValue={setSearch} autoCapitalize="none" />
            {users.isLoading ? <SkeletonList rows={4} /> : null}
          </View>
        }
        renderItem={({ item }) => <UserCard user={item} onCredits={() => setTarget(item)} />}
        ListEmptyComponent={
          users.isLoading ? null : users.isError ? (
            <EmptyState icon="circle-exclamation" title="Could not load users" description={(users.error as any)?.message} actionLabel="Try again" onAction={() => users.refetch()} />
          ) : (
            <EmptyState icon="users" title={search ? `No users match "${search}"` : 'No users yet'} />
          )
        }
        ListFooterComponent={list.length > 0 ? <AppText variant="caption" style={{ textAlign: 'center' }}>{list.length} of {users.data?.total ?? list.length} users</AppText> : null}
      />
      <CreditsSheet user={target} onClose={() => setTarget(null)} />
    </>
  );
}

function UserCard({ user, onCredits }: { user: AdminUser; onCredits: () => void }) {
  const credits = user.credits;
  return (
    <Card style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Initials name={user.name} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText weight="700" numberOfLines={1} style={{ fontSize: 16 }}>{user.name}</AppText>
          <AppText variant="caption" numberOfLines={1}>{user.email}</AppText>
        </View>
        <RoleBadge role={user.role} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' }}>
        <Badge label={`${user.submissionCount} plan${user.submissionCount === 1 ? '' : 's'}`} tone="primary" />
        <Badge label={`${credits} credit${credits === 1 ? '' : 's'}`} tone={credits === 0 ? 'danger' : credits < 10 ? 'warning' : 'success'} />
        <AppText variant="caption">Active {timeAgo(user.lastActive)}</AppText>
      </View>
      <Button title="Manage credits" icon="coins" kind="secondary" size="sm" onPress={onCredits} style={{ alignSelf: 'flex-start' }} />
    </Card>
  );
}

/** Adds or removes credits for one user and shows their recent credit history. */
function CreditsSheet({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  const { colors } = useTheme();
  const toast = useToast();
  const details = useUserCredits(user?.id);
  const { assign, deduct } = useAdjustCredits();
  const [mode, setMode] = useState<'assign' | 'deduct'>('assign');
  const [credits, setCredits] = useState('');
  const [payment, setPayment] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (user) { setMode('assign'); setCredits(''); setPayment(''); setNote(''); }
  }, [user]);

  const busy = assign.isPending || deduct.isPending;
  const amount = parseInt(credits, 10);
  const valid = Number.isInteger(amount) && amount > 0;

  const submit = async () => {
    if (!user || !valid) return;
    try {
      if (mode === 'assign') {
        const pay = parseFloat(payment);
        const res = await assign.mutateAsync({
          userId: user.id, credits: amount, note: note.trim() || undefined,
          paymentAmount: Number.isFinite(pay) && pay > 0 ? pay : undefined, currency: 'USD',
        });
        toast(`${amount} credits added. New balance: ${res.newBalance}`, 'success');
      } else {
        const res = await deduct.mutateAsync({ userId: user.id, credits: amount, note: note.trim() || undefined });
        toast(`${res.deducted} credits removed. New balance: ${res.newBalance}`, 'success');
      }
      haptics.success();
      onClose();
    } catch (e: any) {
      toast(e?.message || 'Could not update the credits', 'error');
    }
  };

  const balance = details.data?.credits ?? user?.credits ?? 0;

  return (
    <Sheet
      visible={!!user}
      onClose={onClose}
      title={user ? `Credits: ${user.name}` : 'Credits'}
      footer={<Button title={mode === 'assign' ? 'Add credits' : 'Remove credits'} icon={mode === 'assign' ? 'circle-plus' : 'circle-minus'} loading={busy} disabled={!valid} onPress={submit} />}
    >
      <View style={{ gap: spacing.md }}>
        <View style={{ backgroundColor: colors.primaryLight, borderRadius: radius.lg, padding: 14 }}>
          <AppText variant="caption">Current balance</AppText>
          <AppText weight="700" style={{ fontSize: 28, color: colors.primary }}>{balance}</AppText>
        </View>
        <SegmentedTabs value={mode} onChange={setMode} tabs={[{ key: 'assign', label: 'Add' }, { key: 'deduct', label: 'Remove' }]} />
        <NumberField label="Credits" required value={credits} onChangeValue={setCredits} placeholder="For example 10" hint="Each document generation costs 5 credits." />
        {mode === 'assign' ? (
          <NumberField label="Payment received (USD)" value={payment} onChangeValue={setPayment} placeholder="Optional" />
        ) : null}
        <TextAreaField label="Note" value={note} onChangeValue={setNote} placeholder="Optional, shown to the user" />

        <AppText weight="700" style={{ fontSize: 15, marginTop: 4 }}>Recent history</AppText>
        {details.isLoading ? <AppText variant="caption">Loading…</AppText> : null}
        {details.data && details.data.transactions.length === 0 ? <AppText variant="caption">No credit history yet.</AppText> : null}
        {details.data?.transactions.slice(0, 6).map((t, i) => (
          <View key={t._id ?? i} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontSize: 13 }} numberOfLines={2}>{t.note || t.type}</AppText>
              <AppText variant="caption">{formatDateTime(t.createdAt)}</AppText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <AppText weight="700" style={{ fontSize: 14, color: t.credits >= 0 ? colors.primary : colors.red }}>{t.credits > 0 ? `+${t.credits}` : t.credits}</AppText>
              <AppText variant="caption">Balance {t.balanceAfter}</AppText>
            </View>
          </View>
        ))}
      </View>
    </Sheet>
  );
}

/* ------------------------------------------------------------------- Plans */
function PlansTab({ header, contentStyle }: TabProps) {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const plans = useAdminPlans(query);
  const items = plans.data?.pages.flatMap((p) => p.submissions) ?? [];
  const total = plans.data?.pages[0]?.total ?? 0;

  return (
    <FlatList
      data={plans.isLoading ? [] : items}
      keyExtractor={(p) => p._id}
      contentContainerStyle={contentStyle}
      refreshControl={<RefreshControl refreshing={plans.isRefetching && !plans.isFetchingNextPage} onRefresh={() => plans.refetch()} tintColor={colors.primary} />}
      ListHeaderComponent={
        <View style={{ gap: spacing.md, marginBottom: 4 }}>
          {header}
          <TextField icon="magnifying-glass" placeholder="Search by company or industry" value={search} onChangeValue={setSearch} autoCapitalize="none" />
          {plans.isLoading ? <SkeletonList rows={4} /> : null}
        </View>
      }
      renderItem={({ item }) => (
        <Card style={{ gap: 6 }}>
          <AppText weight="700" style={{ fontSize: 16 }} numberOfLines={1}>{item.companyInfo?.companyName || 'Unnamed'}</AppText>
          {item.companyInfo?.productName ? <AppText variant="subtitle" numberOfLines={1}>{item.companyInfo.productName}</AppText> : null}
          <AppText variant="caption">
            {[item.companyInfo?.companyFocus, item.companyInfo?.location].filter(Boolean).join(' · ') || 'No industry or location'}
          </AppText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 4 }}>
            <Badge label={item.userName} tone="primary" />
            <AppText variant="caption">{formatDate(item.createdAt)}</AppText>
          </View>
        </Card>
      )}
      ListEmptyComponent={
        plans.isLoading ? null : plans.isError ? (
          <EmptyState icon="circle-exclamation" title="Could not load plans" description={(plans.error as any)?.message} actionLabel="Try again" onAction={() => plans.refetch()} />
        ) : (
          <EmptyState icon="file-lines" title={query ? `No plans match "${query}"` : 'No plans yet'} />
        )
      }
      ListFooterComponent={
        items.length > 0 ? (
          <View style={{ alignItems: 'center', gap: spacing.sm }}>
            <AppText variant="caption">{items.length} of {total} plans</AppText>
            {plans.hasNextPage ? <Button title="Load more" kind="secondary" size="sm" loading={plans.isFetchingNextPage} onPress={() => plans.fetchNextPage()} /> : null}
          </View>
        ) : null
      }
    />
  );
}

/* ---------------------------------------------------------------- Requests */
const FILTERS: { key: RequestFilter; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

function RequestsTab({ header, contentStyle }: TabProps) {
  const { colors } = useTheme();
  const toast = useToast();
  const confirm = useConfirm();
  const [filter, setFilter] = useState<RequestFilter>('pending');
  const requests = useCreditRequests(filter);
  const review = useReviewRequest();
  const [rejecting, setRejecting] = useState<AdminCreditRequest | null>(null);

  const approve = async (r: AdminCreditRequest) => {
    const ok = await confirm(`Add ${r.creditsRequested} credits to ${r.user.name || 'this user'}?`, { confirmLabel: 'Approve' });
    if (!ok) return;
    try {
      const res = await review.mutateAsync({ id: r._id, action: 'approve' });
      haptics.success();
      toast(`Approved. New balance: ${res.newBalance ?? 'updated'}`, 'success');
    } catch (e: any) {
      toast(e?.message || 'Could not approve the request', 'error');
    }
  };

  return (
    <>
      <FlatList
        data={requests.isLoading ? [] : requests.data ?? []}
        keyExtractor={(r) => r._id}
        contentContainerStyle={contentStyle}
        refreshControl={<RefreshControl refreshing={requests.isRefetching} onRefresh={() => requests.refetch()} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={{ gap: spacing.md, marginBottom: 4 }}>
            {header}
            <SegmentedTabs value={filter} onChange={setFilter} tabs={FILTERS} />
            {requests.isLoading ? <SkeletonList rows={3} /> : null}
          </View>
        }
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            busy={review.isPending}
            onApprove={() => approve(item)}
            onReject={() => setRejecting(item)}
          />
        )}
        ListEmptyComponent={
          requests.isLoading ? null : requests.isError ? (
            <EmptyState icon="circle-exclamation" title="Could not load requests" description={(requests.error as any)?.message} actionLabel="Try again" onAction={() => requests.refetch()} />
          ) : (
            <EmptyState icon="inbox" title={filter === 'pending' ? 'No pending requests' : 'No requests here'} description="Credit requests from users appear here." />
          )
        }
      />
      <RejectSheet request={rejecting} onClose={() => setRejecting(null)} />
    </>
  );
}

function RequestCard({ request: r, busy, onApprove, onReject }: { request: AdminCreditRequest; busy: boolean; onApprove: () => void; onReject: () => void }) {
  const docs = r.documents.map((d) => `${d.count} ${d.type === 'business-plan' ? 'Business Plan' : 'Financial Model'}`).join(', ');
  return (
    <Card style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Initials name={r.user.name} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText weight="700" numberOfLines={1} style={{ fontSize: 16 }}>{r.user.name || r.userId}</AppText>
          <AppText variant="caption" numberOfLines={1}>{r.user.email}</AppText>
        </View>
        <Badge label={r.status === 'pending' ? 'Pending' : r.status === 'approved' ? 'Approved' : 'Rejected'} tone={r.status === 'pending' ? 'warning' : r.status === 'approved' ? 'success' : 'danger'} />
      </View>
      <AppText weight="700" style={{ fontSize: 15 }}>{r.creditsRequested} credits</AppText>
      <AppText variant="subtitle">{docs || 'No documents listed'}</AppText>
      {r.note ? <AppText variant="caption">User note: {r.note}</AppText> : null}
      {r.adminNote ? <AppText variant="caption">Admin note: {r.adminNote}</AppText> : null}
      <AppText variant="caption">Requested {timeAgo(r.createdAt)}</AppText>
      {r.status === 'pending' ? (
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 4 }}>
          <Button title="Approve" icon="circle-check" size="sm" loading={busy} onPress={onApprove} />
          <Button title="Reject" icon="circle-xmark" kind="danger" size="sm" disabled={busy} onPress={onReject} />
        </View>
      ) : null}
    </Card>
  );
}

function RejectSheet({ request, onClose }: { request: AdminCreditRequest | null; onClose: () => void }) {
  const toast = useToast();
  const review = useReviewRequest();
  const [note, setNote] = useState('');
  useEffect(() => { if (request) setNote(''); }, [request]);

  const submit = async () => {
    if (!request) return;
    try {
      await review.mutateAsync({ id: request._id, action: 'reject', adminNote: note.trim() || undefined });
      haptics.success();
      toast('Request rejected', 'success');
      onClose();
    } catch (e: any) {
      toast(e?.message || 'Could not reject the request', 'error');
    }
  };

  return (
    <Sheet
      visible={!!request}
      onClose={onClose}
      title="Reject request"
      size="sm"
      footer={<Button title="Reject request" icon="circle-xmark" kind="danger" loading={review.isPending} onPress={submit} />}
    >
      <TextAreaField label="Reason" value={note} onChangeValue={setNote} placeholder="Optional, the user will see this" />
    </Sheet>
  );
}

