import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/theme';
import { AppText, EmptyState, PageHeader, SkeletonList, useLayout } from '../components/ui';
import { TextField } from '../components/fields';
import { FAB } from '../components/FAB';
import { useConfirm } from '../components/Confirm';
import { useToast } from '../components/Toast';
import { DocumentSheet, PlanCard, useDocumentActions } from '../components/plan';
import { useDocMeta, usePlanMutations, useSubmissions, Submission } from '../lib/useResource';

/** "Your Business Plans" — search, generate/download documents, edit, delete. */
export function PlansScreen() {
  const nav = useNavigation<any>();
  const { colors } = useTheme();
  const { gutter, isWide } = useLayout();
  const confirm = useConfirm();
  const toast = useToast();

  const plans = useSubmissions();
  const all = plans.data ?? [];
  const meta = useDocMeta(all.map((p) => p._id));
  const { remove } = usePlanMutations();
  const docs = useDocumentActions();
  const [search, setSearch] = useState('');
  const [docPlan, setDocPlan] = useState<Submission | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((s) =>
      [s.companyInfo?.companyName, s.companyInfo?.companyFocus, s.companyInfo?.location, s.companyInfo?.productName]
        .some((v) => v?.toLowerCase().includes(q)),
    );
  }, [all, search]);

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
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={plans.isLoading ? [] : filtered}
        keyExtractor={(p) => p._id}
        contentContainerStyle={[
          { paddingHorizontal: gutter, paddingTop: 20, paddingBottom: 110, gap: spacing.md },
          isWide ? { maxWidth: 1000, width: '100%', alignSelf: 'center' } : null,
        ]}
        refreshControl={<RefreshControl refreshing={plans.isRefetching} onRefresh={() => { plans.refetch(); meta.refetch(); }} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={{ gap: spacing.md, marginBottom: 4 }}>
            <PageHeader title="My Business Plans" subtitle="Generate, download, edit or delete your plans" />
            {all.length > 0 ? (
              <TextField icon="magnifying-glass" placeholder="Search plans…" value={search} onChangeValue={setSearch} autoCapitalize="none" />
            ) : null}
            {plans.isLoading ? <SkeletonList rows={4} /> : null}
          </View>
        }
        renderItem={({ item }) => (
          <PlanCard
            plan={item}
            meta={meta.data?.[item._id]}
            onDocuments={() => setDocPlan(item)}
            onEdit={() => nav.navigate('plan-form', { editId: item._id })}
            onDelete={() => onDelete(item)}
          />
        )}
        ListEmptyComponent={
          plans.isLoading ? null : search ? (
            <EmptyState icon="magnifying-glass" title={`No results for "${search}"`} description="Try a different company, industry or location." />
          ) : (
            <EmptyState icon="file-lines" title="No plans yet" description="Create your first business plan to get started." actionLabel="Create Business Plan" onAction={newPlan} />
          )
        }
        ListFooterComponent={
          filtered.length > 0 ? (
            <AppText variant="caption" style={{ textAlign: 'center', marginTop: 4 }}>
              {filtered.length} plan{filtered.length === 1 ? '' : 's'}{search ? ` matching "${search}"` : ' total'}
            </AppText>
          ) : null
        }
      />
      <FAB onPress={newPlan} icon="plus" label="New plan" />
      <DocumentSheet plan={docPlan} meta={docPlan ? meta.data?.[docPlan._id] : undefined} onClose={() => setDocPlan(null)} onRun={docs.run} />
      {docs.ui}
    </View>
  );
}
