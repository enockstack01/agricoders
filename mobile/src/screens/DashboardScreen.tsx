import { useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/theme';
import { AppText, ChartCard, EmptyState, Grid, Screen, SkeletonList, StatCard } from '../components/ui';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { BannerContext } from '../components/banner';
import { useConfirm } from '../components/Confirm';
import { useToast } from '../components/Toast';
import { CreditRequestSheet, DocumentSheet, PlanCard, useDocumentActions } from '../components/plan';
import { useCredits, useDocMeta, usePlanMutations, useSubmissions, Submission } from '../lib/useResource';
import { CREDITS_PER_DOC } from '../lib/documents';
import { getGreeting } from '../lib/format';

/** Home: greeting, credit balance, plan counts and the latest plans. */
export function DashboardScreen() {
  const nav = useNavigation<any>();
  const { colors } = useTheme();
  const { user } = useUser();
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

  const newPlan = () => nav.navigate('plan-form', { editId: undefined, nonce: Date.now() });

  return (
    <Screen refreshControl={<RefreshControl refreshing={plans.isRefetching} onRefresh={refresh} tintColor={colors.primary} />} contentStyle={{ paddingTop: 16, gap: spacing.lg }}>
      <View accessible accessibilityRole="header" accessibilityLabel={`${getGreeting()}${user?.firstName ? `, ${user.firstName}` : ''}`}>
        <AppText weight="700" style={{ fontSize: 26, lineHeight: 32 }}>{getGreeting()}{user?.firstName ? `, ${user.firstName}` : ''}</AppText>
        <AppText variant="subtitle" style={{ fontSize: 15, marginTop: 2 }}>Here is where your business plans stand.</AppText>
      </View>

      {/* credit balance: each generated document costs credits, so this is the number to watch */}
      <BannerContext.Provider value={true}>
        <View style={{ backgroundColor: '#1B5E20', borderRadius: 20, padding: 20, gap: 14, overflow: 'hidden' }}>
          <View pointerEvents="none" style={{ position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.05)', top: -90, right: -60 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <AppText weight="700" style={{ fontSize: 12, letterSpacing: 2.4, textTransform: 'uppercase', color: '#F9A825' }}>Credit balance</AppText>
              <AppText weight="700" style={{ fontSize: 44, lineHeight: 52, color: '#FFFFFF' }} accessibilityLabel={`${balance ?? 'loading'} credits`}>{balance ?? '…'}</AppText>
              <AppText style={{ fontSize: 15, color: 'rgba(255,255,255,0.88)' }}>
                {generations != null ? `${generations} document${generations === 1 ? '' : 's'} can be generated` : 'Checking your balance'}
              </AppText>
            </View>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="coins" size={22} color="#1B5E20" />
            </View>
          </View>
          {balance === 0 ? (
            <AppText weight="700" style={{ fontSize: 14, color: '#F9A825' }}>No credits left. Each document costs {CREDITS_PER_DOC} credits.</AppText>
          ) : null}
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            <Button title="Request credits" icon="paper-plane" onPress={() => setRequestOpen(true)} />
            <Button title="History" kind="secondary" onPress={() => nav.navigate('credits')} />
          </View>
        </View>
      </BannerContext.Provider>

      <Grid columns={2} gap={spacing.md}>
        <StatCard icon="file-lines" label="Total plans" value={plans.isLoading ? '…' : list.length} onPress={() => nav.navigate('plans')} />
        <StatCard icon="calendar" label="This month" value={plans.isLoading ? '…' : thisMonth} />
      </Grid>

      <ChartCard
        title="Recent plans"
        icon="folder-open"
        right={list.length > 3 ? <Button title="View all" kind="ghost" size="sm" onPress={() => nav.navigate('plans')} /> : null}
        bodyStyle={{ padding: list.length ? 12 : 0, gap: 12 }}
      >
        {plans.isLoading ? (
          <SkeletonList rows={2} />
        ) : list.length === 0 ? (
          <EmptyState
            icon="file-lines"
            title="No plans yet"
            description="Create your first business plan to get started."
            actionLabel="Create business plan"
            onAction={newPlan}
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

      <ChartCard title="What is included" icon="layer-group" bodyStyle={{ gap: 16 }}>
        {[
          { icon: 'layer-group', title: 'AI enhanced documents', desc: 'Our intelligent system writes the entire business plan proposal.' },
          { icon: 'chart-column', title: 'Charts built in', desc: 'Six professional charts embedded in your Word document.' },
          { icon: 'download', title: 'Multi format export', desc: 'Business Plan (.docx) and a 19 sheet Financial Model (.xlsx).' },
        ].map((f) => (
          <View key={f.title} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#1B5E20', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={f.icon} size={15} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <AppText weight="700" style={{ fontSize: 15 }}>{f.title}</AppText>
              <AppText variant="subtitle" style={{ fontSize: 14 }}>{f.desc}</AppText>
            </View>
          </View>
        ))}
      </ChartCard>

      <DocumentSheet plan={docPlan} meta={docPlan ? meta.data?.[docPlan._id] : undefined} onClose={() => setDocPlan(null)} onRun={docs.run} />
      <CreditRequestSheet visible={requestOpen} onClose={() => setRequestOpen(false)} />
      {docs.ui}
    </Screen>
  );
}
