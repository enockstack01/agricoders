import React, { useEffect, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/theme';
import { AppText, Badge, ChartCard, EmptyState, Grid, PageHeader, Screen, Skeleton, StatTile } from '../components/ui';
import { Button } from '../components/Button';
import { CreditRequestSheet } from '../components/plan';
import { Callout } from '../components/planFields';
import { useCreditRequests, useCredits } from '../lib/useResource';
import { CREDITS_PER_DOC } from '../lib/documents';
import { formatDate } from '../lib/format';

const STATUS_TONE = { pending: 'warning', approved: 'success', rejected: 'danger' } as const;
const DOC_LABEL: Record<string, string> = { 'business-plan': 'Business Plan', 'financial-model': 'Financial Model' };

/** Credit balance, requests to the admin and transaction history (website Profile → Credits). */
export function CreditsScreen() {
  const { colors } = useTheme();
  const route = useRoute<any>();
  const credits = useCredits();
  const requests = useCreditRequests();
  const [open, setOpen] = useState(false);

  // opened from elsewhere with { request: true }
  useEffect(() => {
    if (route.params?.request) setOpen(true);
  }, [route.params?.request]);

  const balance = credits.data?.credits;
  const tx = credits.data?.transactions ?? [];
  const reqs = requests.data ?? [];
  const pending = reqs.some((r) => r.status === 'pending');

  return (
    <Screen refreshControl={<RefreshControl refreshing={credits.isRefetching} onRefresh={() => { credits.refetch(); requests.refetch(); }} tintColor={colors.primary} />}>
      <PageHeader
        title="Credits"
        subtitle={`Each document generation costs ${CREDITS_PER_DOC} credits. Re-downloading a stored copy is free.`}
        action={<Button title={pending ? 'Request pending' : 'Request Credits'} icon="paper-plane" onPress={() => setOpen(true)} disabled={pending} />}
      />

      <Grid columns={3} gap={spacing.md} style={{ marginBottom: 20 }}>
        <StatTile label="Available" value={balance ?? '…'} sub="credits" tone="green" />
        <StatTile label="Generation" value={CREDITS_PER_DOC} sub="credits each" tone="orange" />
        <StatTile label="Downloads" value="Free" sub="stored copies" tone="blue" />
      </Grid>

      <View style={{ marginBottom: 24 }}>
        <Callout tone="info">Credits are approved by your administrator. Send a request and you'll get a notification once it's reviewed.</Callout>
      </View>

      <ChartCard title="My Credit Requests" icon="inbox" style={{ marginBottom: 24 }} bodyStyle={{ paddingVertical: reqs.length ? 8 : 0 }}>
        {requests.isLoading ? (
          <View style={{ gap: 10, padding: 12 }}><Skeleton width="70%" /><Skeleton width="50%" /></View>
        ) : reqs.length === 0 ? (
          <EmptyState icon="inbox" title="No requests yet" description="Requests you send to the admin appear here with their status." />
        ) : (
          reqs.map((r, i) => (
            <View key={r._id} style={{ paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderTopColor: colors.border, gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <AppText weight="600" style={{ fontSize: 13 }}>{r.creditsRequested} credits</AppText>
                <Badge label={r.status[0].toUpperCase() + r.status.slice(1)} tone={STATUS_TONE[r.status]} />
              </View>
              <AppText variant="subtitle" style={{ fontSize: 12 }}>
                {r.documents.map((d) => `${d.count}× ${DOC_LABEL[d.type] ?? d.type}`).join(' · ')} · {formatDate(r.createdAt)}
              </AppText>
              {r.adminNote ? <AppText variant="caption">Admin note: {r.adminNote}</AppText> : null}
            </View>
          ))
        )}
      </ChartCard>

      <ChartCard title="Transaction History" icon="clock-rotate-left" bodyStyle={{ paddingVertical: tx.length ? 8 : 0 }}>
        {credits.isLoading ? (
          <View style={{ gap: 10, padding: 12 }}><Skeleton width="70%" /><Skeleton width="50%" /></View>
        ) : tx.length === 0 ? (
          <EmptyState icon="receipt" title="No transactions yet" />
        ) : (
          tx.map((t, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderTopWidth: i ? 1 : 0, borderTopColor: colors.border }}>
              <Badge label={t.credits > 0 ? `+${t.credits}` : String(t.credits)} tone={t.credits > 0 ? 'success' : 'danger'} />
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: 13, textTransform: 'capitalize' }}>
                  {t.type}{t.paymentAmount ? ` (${t.paymentAmount} ${t.currency ?? ''})` : ''}
                </AppText>
                {t.note ? <AppText variant="caption" numberOfLines={1}>{t.note}</AppText> : null}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <AppText variant="caption">Bal. {t.balanceAfter}</AppText>
                <AppText variant="caption">{formatDate(t.createdAt)}</AppText>
              </View>
            </View>
          ))
        )}
      </ChartCard>

      <CreditRequestSheet visible={open} onClose={() => { setOpen(false); requests.refetch(); }} />
    </Screen>
  );
}
