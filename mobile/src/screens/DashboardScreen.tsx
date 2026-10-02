import React, { useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/theme';
import { AppText, ChartCard, EmptyState, Grid, KpiCard, PageHeader, Screen, SkeletonList, useLayout } from '../components/ui';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { useConfirm } from '../components/Confirm';
import { useToast } from '../components/Toast';
import { CreditRequestSheet, DocumentSheet, PlanCard, useDocumentActions } from '../components/plan';
import { useCredits, useDocMeta, usePlanMutations, useSubmissions, Submission } from '../lib/useResource';
import { CREDITS_PER_DOC } from '../lib/documents';
import { formatDate, getGreeting } from '../lib/format';

/** Website dashboard: welcome header, 4 KPI cards, recent plans, quick actions, what's included. */
export function DashboardScreen() {
  const nav = useNavigation<any>();
  const { colors } = useTheme();
  const { user } = useUser();
  const { columns } = useLayout();
  const confirm = useConfirm();
  const toast = useToast();

  const plans = useSubmissions();
  const credits = useCredits();
  const list = plans.data ?? [];
  const meta = useDocMeta(list.map((p) => p._id));
  const { remove } = usePlanMutations();
  const docs = useDocumentActions();
  const [docPlan, setDocPlan] = useState<Submission | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);

  const thisMonth = useMemo(() => {
    const now = new Date();
    return list.filter((s) => {
      const d = new Date(s.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [list]);
  const latest = list[0];
  const balance = credits.data?.credits;
  const generations = balance != null ? Math.floor(balance / CREDITS_PER_DOC) : null;

  const refresh = () => {
    plans.refetch();
    credits.refetch();
    meta.refetch();
  };

  const onDelete = async (p: Submission) => {
    const ok = await confirm(`Permanently delete "${p.companyInfo?.companyName || 'this plan'}"?`, { confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    try {
      await remove.mutateAsync(p._id);
      toast('Plan deleted', 'success');
    } catch (e: any) {
      toast(e?.message || 'Delete failed', 'error');
    }
  };

  const QuickAction = ({ icon, title, sub, onPress }: { icon: string; title: string; sub: string; onPress: () => void }) => (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.card }}
    >
      <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={13} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText weight="600" style={{ fontSize: 13 }}>{title}</AppText>
        <AppText variant="caption">{sub}</AppText>
      </View>
      <Icon name="chevron-right" size={11} color={colors.textLight} />
    </PressableScale>
  );

  return (
    <Screen refreshControl={<RefreshControl refreshing={plans.isRefetching} onRefresh={refresh} tintColor={colors.primary} />}>
      <PageHeader
        title={`${getGreeting()}${user?.firstName ? `, ${user.firstName}` : ''}`}
        subtitle="Manage your business plans and financial models"
        action={
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            <Button title="New Business Plan" icon="circle-plus" onPress={() => nav.navigate('plan-form', { editId: undefined, nonce: Date.now() })} />
            <Button title="Request Credits" icon="paper-plane" kind="secondary" onPress={() => setRequestOpen(true)} />
          </View>
        }
      />

      <Grid columns={columns >= 2 ? 2 : 1} gap={spacing.lg} style={{ marginBottom: 24 }}>
        <KpiCard icon="file-lines" tone="green" label="Total Plans" value={plans.isLoading ? '…' : list.length} onPress={() => nav.navigate('plans')} />
        <KpiCard icon="calendar" tone="blue" label="This Month" value={plans.isLoading ? '…' : thisMonth} />
        <KpiCard
          icon="coins"
          tone={balance === 0 ? 'red' : balance != null && balance < 10 ? 'orange' : 'green'}
          label={generations != null ? `Credit Balance · ${generations} generation${generations === 1 ? '' : 's'}` : 'Credit Balance'}
          value={balance ?? '…'}
          onPress={() => nav.navigate('credits')}
        />
        <KpiCard icon="arrow-trend-up" tone="purple" label={latest ? `Latest Plan · ${formatDate(latest.createdAt)}` : 'Latest Plan'} value={latest?.companyInfo?.companyName || '—'} />
      </Grid>

      <ChartCard
        title="Recent Business Plans"
        icon="folder-open"
        right={list.length > 3 ? <Button title="View all" kind="ghost" size="sm" onPress={() => nav.navigate('plans')} /> : null}
        bodyStyle={{ padding: list.length ? 12 : 0, gap: 12 }}
        style={{ marginBottom: 24 }}
      >
        {plans.isLoading ? (
          <SkeletonList rows={2} />
        ) : list.length === 0 ? (
          <EmptyState
            icon="file-lines"
            title="No plans yet"
            description="Create your first business plan to get started."
            actionLabel="Create Business Plan"
            onAction={() => nav.navigate('plan-form', { editId: undefined, nonce: Date.now() })}
          />
        ) : (
          list.slice(0, 3).map((p) => (
            <PlanCard
              key={p._id}
              plan={p}
              meta={meta.data?.[p._id]}
              onDocuments={() => setDocPlan(p)}
              onEdit={() => nav.navigate('plan-form', { editId: p._id })}
              onDelete={() => onDelete(p)}
            />
          ))
        )}
      </ChartCard>

      <Grid columns={columns >= 2 ? 2 : 1} gap={spacing.lg}>
        <ChartCard title="Quick Actions" icon="bolt" bodyStyle={{ gap: 10 }}>
          <QuickAction icon="circle-plus" title="New Business Plan" sub="Start the 10-step wizard" onPress={() => nav.navigate('plan-form', { editId: undefined, nonce: Date.now() })} />
          <QuickAction icon="coins" title="Request Credits" sub={`Balance: ${balance ?? '…'}`} onPress={() => setRequestOpen(true)} />
          <QuickAction icon="gear" title="Plan Defaults" sub="Currency, tax & loan rates" onPress={() => nav.navigate('settings')} />
        </ChartCard>
        <ChartCard title="What's Included" icon="layer-group" bodyStyle={{ gap: 14 }}>
          {[
            { icon: 'layer-group', title: 'AI-Enhanced Documents', desc: 'Our intelligent system writes the entire business plan proposal.' },
            { icon: 'chart-column', title: 'Python Chart Engine', desc: '6 professional charts embedded in your Word document.' },
            { icon: 'download', title: 'Multi-Format Export', desc: 'Business Plan (.docx) + 19-sheet Financial Model (.xlsx).' },
          ].map((f) => (
            <View key={f.title} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={f.icon} size={13} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText weight="600" style={{ fontSize: 13 }}>{f.title}</AppText>
                <AppText variant="subtitle" style={{ fontSize: 12 }}>{f.desc}</AppText>
              </View>
            </View>
          ))}
        </ChartCard>
      </Grid>

      <DocumentSheet plan={docPlan} meta={docPlan ? meta.data?.[docPlan._id] : undefined} onClose={() => setDocPlan(null)} onRun={docs.run} />
      <CreditRequestSheet visible={requestOpen} onClose={() => setRequestOpen(false)} />
      {docs.ui}
    </Screen>
  );
}
