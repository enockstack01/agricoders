import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/theme';
import { AppText, Card, EmptyState, Loading, PageHeader, useLayout } from '../../components/ui';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Sheet } from '../../components/Sheet';
import { useToast } from '../../components/Toast';
import { CreditRequestSheet } from '../../components/plan';
import { haptics } from '../../lib/haptics';
import { PlanInput, useCredits, usePlanMutations, useProfile, useSubmission } from '../../lib/useResource';
import { CREDITS_PER_DOC } from '../../lib/documents';
import { buildDefaultFormData } from '../../shared/defaults';
import {
  BusinessStep, CapexStep, CompanyStep, FinanceStep, MarketStep, OpexStep, ProductsStep, RevenueStep, ReviewStep, TeamStep,
} from './steps';

const STEPS = [
  { label: 'Company Info', icon: 'building' },
  { label: 'Business Description', icon: 'book-open' },
  { label: 'Market Analysis', icon: 'arrow-trend-up' },
  { label: 'Management Team', icon: 'users' },
  { label: 'CAPEX', icon: 'industry' },
  { label: 'Products', icon: 'box' },
  { label: 'Operating Expenses', icon: 'dollar-sign' },
  { label: 'Revenue Streams', icon: 'chart-line' },
  { label: 'Financial Settings', icon: 'sliders' },
  { label: 'Review & Submit', icon: 'clipboard-check' },
];

/** Strip database-only fields and fill arrays older plans may lack (same as the website). */
function toPlanInput(raw: any): PlanInput {
  const rest = { ...raw };
  for (const k of ['_id', 'userId', 'createdAt', 'updatedAt', '__v']) delete rest[k];
  if (rest.financial && !rest.financial.products) rest.financial.products = [];
  if (rest.financial && !rest.financial.services) rest.financial.services = [];
  if (rest.companyInfo && !rest.companyInfo.currency) rest.companyInfo.currency = 'USD';
  return rest as PlanInput;
}

/** The 10-step business-plan wizard (website /plan/form), for new plans and edits. */
export function PlanWizardScreen({ editId }: { editId?: string }) {
  const nav = useNavigation<any>();
  const { colors } = useTheme();
  const { gutter, isWide } = useLayout();
  const toast = useToast();
  const scrollRef = useRef<ScrollView>(null);

  const credits = useCredits();
  const { defaults } = useProfile();
  const existing = useSubmission(editId);
  const { create, replace } = usePlanMutations();

  const [data, setData] = useState<PlanInput | null>(null);
  const [step, setStep] = useState(0);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  // initialise once: the plan being edited, or a fresh plan pre-filled from profile defaults
  useEffect(() => {
    if (data) return;
    if (editId) {
      if (existing.data) setData(toPlanInput(existing.data));
    } else if (defaults) {
      setData(buildDefaultFormData(defaults) as PlanInput);
    }
  }, [data, editId, existing.data, defaults]);

  const update = <K extends keyof PlanInput>(key: K, value: PlanInput[K]) => setData((d) => (d ? { ...d, [key]: value } : d));

  const goTo = (i: number) => {
    haptics.select();
    setStep(i);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const submit = async () => {
    if (!data) return;
    const ci = data.companyInfo;
    if (!ci.companyName?.trim() || !ci.productName?.trim()) {
      toast('Company Name and Product / Project Name are required (step 1)', 'warning');
      goTo(0);
      return;
    }
    try {
      if (editId) await replace.mutateAsync({ id: editId, body: data });
      else await create.mutateAsync(data);
      haptics.success();
      toast(editId ? 'Plan updated' : 'Plan saved — generate your documents from My Business Plans', 'success');
      nav.navigate('plans');
    } catch (e: any) {
      toast(e?.message || 'Submission failed. Please try again.', 'error');
    }
  };

  // ── loading / errors / credit gate ──────────────────────────────────────
  if (editId && existing.isError) {
    return <EmptyState icon="circle-exclamation" title="Couldn't load this plan" description={existing.error?.message} actionLabel="Back to plans" onAction={() => nav.navigate('plans')} />;
  }
  if (!data || (!editId && credits.isLoading)) return <Loading label={editId ? 'Loading plan…' : 'Preparing your plan…'} />;

  const balance = credits.data?.credits ?? 0;
  if (!editId && balance < CREDITS_PER_DOC) {
    return (
      <ScrollView contentContainerStyle={{ padding: gutter, paddingTop: 20 }} style={{ backgroundColor: colors.bg }}>
        <PageHeader title="New Business Plan" />
        <Card style={{ alignItems: 'center', gap: 10 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF8E1', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="coins" size={26} color={colors.orange} />
          </View>
          <AppText weight="600" style={{ fontSize: 16 }}>Insufficient credits</AppText>
          <AppText variant="subtitle" style={{ fontSize: 13, textAlign: 'center' }}>
            You need {CREDITS_PER_DOC} credits to create a plan. Your balance: {balance} credit{balance === 1 ? '' : 's'}.
          </AppText>
          <Button title="Request Credits" icon="paper-plane" onPress={() => setRequestOpen(true)} style={{ marginTop: 6, alignSelf: 'stretch' }} />
          <Button title="Back to Dashboard" kind="secondary" onPress={() => nav.navigate('dashboard')} style={{ alignSelf: 'stretch' }} />
        </Card>
        <CreditRequestSheet visible={requestOpen} onClose={() => { setRequestOpen(false); credits.refetch(); }} required={CREDITS_PER_DOC} balance={balance} />
      </ScrollView>
    );
  }

  const progress = Math.round((step / (STEPS.length - 1)) * 100);
  const current = STEPS[step];
  const last = step === STEPS.length - 1;
  const saving = create.isPending || replace.isPending;

  const stepView = (() => {
    const p = { data, update };
    switch (step) {
      case 0: return <CompanyStep {...p} />;
      case 1: return <BusinessStep {...p} />;
      case 2: return <MarketStep {...p} />;
      case 3: return <TeamStep {...p} />;
      case 4: return <CapexStep {...p} />;
      case 5: return <ProductsStep {...p} />;
      case 6: return <OpexStep {...p} />;
      case 7: return <RevenueStep {...p} />;
      case 8: return <FinanceStep {...p} />;
      default: return <ReviewStep data={data} />;
    }
  })();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[{ padding: gutter, paddingTop: 20, paddingBottom: 40 }, isWide ? { maxWidth: 900, width: '100%', alignSelf: 'center' } : null]}
      >
        <PageHeader title={editId ? 'Edit Business Plan' : 'New Business Plan'} subtitle="Your answers drive the business plan narrative and the financial model." />

        {/* step picker (website step list / mobile step jumper) */}
        <Pressable
          onPress={() => setJumpOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`Step ${step + 1} of ${STEPS.length}: ${current.label}. Change step`}
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.bg : colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
            overflow: 'hidden', marginBottom: 16,
          })}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={current.icon} size={15} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="caption">Step {step + 1} of {STEPS.length} · {progress}%</AppText>
              <AppText weight="600" style={{ fontSize: 15 }}>{current.label}</AppText>
            </View>
            <Icon name="chevron-down" size={12} color={colors.textLight} />
          </View>
          <View style={{ height: 4, backgroundColor: colors.bg }}>
            <View style={{ width: `${progress}%`, height: 4, backgroundColor: colors.primary }} />
          </View>
        </Pressable>

        <Card style={{ padding: 18 }}>{stepView}</Card>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 20 }}>
          <Button title="Previous" icon="chevron-left" kind="secondary" onPress={() => goTo(Math.max(0, step - 1))} disabled={step === 0} />
          {last ? (
            <Button title={editId ? 'Save Changes' : 'Submit Plan'} icon="circle-check" onPress={submit} loading={saving} style={{ flex: 1 }} />
          ) : (
            <Button title="Next" icon="chevron-right" onPress={() => goTo(step + 1)} style={{ flex: 1 }} />
          )}
        </View>
      </ScrollView>

      <Sheet visible={jumpOpen} onClose={() => setJumpOpen(false)} title="Plan sections" size="sm">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <Pressable
              key={s.label}
              onPress={() => { setJumpOpen(false); goTo(i); }}
              style={({ pressed }) => ({
                flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 10, borderRadius: radius.md,
                backgroundColor: active ? colors.primaryLight : pressed ? colors.bg : 'transparent',
              })}
            >
              <View style={{
                width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
                backgroundColor: active ? colors.primary : done ? colors.primaryLight : colors.bg,
                borderWidth: 1, borderColor: active ? colors.primary : done ? 'transparent' : colors.border,
              }}>
                {done ? <Icon name="check" size={10} color={colors.primary} /> : <AppText weight="700" style={{ fontSize: 11, color: active ? '#fff' : colors.textLight }}>{i + 1}</AppText>}
              </View>
              <Icon name={s.icon} size={13} color={active ? colors.primary : colors.textLight} />
              <AppText weight={active ? '600' : '400'} style={{ fontSize: 14, color: active ? colors.primary : colors.text }}>{s.label}</AppText>
            </Pressable>
          );
        })}
      </Sheet>
      <View style={{ height: spacing.sm }} />
    </View>
  );
}
