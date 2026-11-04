import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText, Card, EmptyState, Loading, useLayout } from '../../components/ui';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Sheet } from '../../components/Sheet';
import { useToast } from '../../components/Toast';
import { CreditRequestSheet } from '../../components/plan';
import { haptics } from '../../lib/haptics';
import { clearDraft, Draft, loadDraft, saveDraft } from '../../lib/draft';
import { formatDateTime } from '../../lib/format';
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

/** Required fields per step, with the message shown under the field while it is empty. */
function validateStep(step: number, data: PlanInput): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    const ci = data.companyInfo;
    if (!ci.authorName?.trim()) e.authorName = 'Enter your full name';
    if (!ci.authorTitle?.trim()) e.authorTitle = 'Enter your title';
    if (!ci.companyName?.trim()) e.companyName = 'Enter the company name';
    if (!ci.productName?.trim()) e.productName = 'Enter the product or project name';
    if (!ci.currency?.trim()) e.currency = 'Choose a currency';
  }
  return e;
}

/** True while the on screen keyboard is open (the Back and Next bar steps aside to give the form room). */
function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}

/** The 10 step business-plan wizard (website /plan/form), for new plans and edits. */
export function PlanWizardScreen({ editId }: { editId?: string }) {
  const nav = useNavigation<any>();
  const { colors } = useTheme();
  const { gutter, isWide } = useLayout();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const scrollRef = useRef<ScrollView>(null);
  const keyboardVisible = useKeyboardVisible();

  const credits = useCredits();
  const { defaults } = useProfile();
  const existing = useSubmission(editId);
  const { create, replace } = usePlanMutations();

  const [data, setData] = useState<PlanInput | null>(null);
  const [step, setStep] = useState(0);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [draftOffer, setDraftOffer] = useState<Draft | null>(null);

  // initialise once: the plan being edited, or a fresh plan prefilled from profile defaults
  useEffect(() => {
    if (data) return;
    let initial: PlanInput | null = null;
    if (editId) {
      if (existing.data) initial = toPlanInput(existing.data);
    } else if (defaults) {
      initial = buildDefaultFormData(defaults) as PlanInput;
    }
    if (!initial) return;
    setData(initial);
    // a saved draft of this plan, if there is one, is offered once
    loadDraft(editId).then((d) => {
      if (d) setDraftOffer(d);
    });
  }, [data, editId, existing.data, defaults]);

  const update = <K extends keyof PlanInput>(key: K, value: PlanInput[K]) => {
    setDirty(true);
    setData((d) => (d ? { ...d, [key]: value } : d));
  };

  // save the draft a moment after the last change
  useEffect(() => {
    if (!data || !dirty) return;
    const t = setTimeout(() => {
      saveDraft(editId, data, step).then((ok) => {
        if (ok) setSavedAt(Date.now());
      });
    }, 800);
    return () => clearTimeout(t);
  }, [data, step, dirty, editId]);

  // a new plan needs credits: without them only the first step opens
  const balance = credits.data?.credits ?? 0;
  const locked = !editId && !credits.isLoading && balance < CREDITS_PER_DOC;

  const goTo = useCallback((i: number) => {
    if (locked && i > 0) {
      haptics.error();
      setLockOpen(true);
      return;
    }
    haptics.select();
    setStep(i);
    setAttempted(false);
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [locked]);

  // Android back button: previous step first, and from the first step leave the wizard (the draft is kept)
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step > 0) {
          goTo(step - 1);
          return true;
        }
        return false;
      });
      return () => sub.remove();
    }, [step, goTo]),
  );

  const next = () => {
    if (!data) return;
    if (Object.keys(validateStep(step, data)).length) {
      setAttempted(true);
      haptics.error();
      toast('Fill in the highlighted fields to continue', 'warning');
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    goTo(step + 1);
  };

  const submit = async () => {
    if (!data) return;
    if (Object.keys(validateStep(0, data)).length) {
      setStep(0);
      setAttempted(true);
      haptics.error();
      toast('Fill in the required fields in Company Info first', 'warning');
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      return;
    }
    try {
      if (editId) await replace.mutateAsync({ id: editId, body: data });
      else await create.mutateAsync(data);
      await clearDraft(editId);
      haptics.success();
      toast(editId ? 'Plan updated' : 'Plan saved. Generate your documents from My Business Plans', 'success');
      nav.navigate('plans');
    } catch (e: any) {
      toast(e?.message || 'Submission failed. Please try again.', 'error');
    }
  };

  // dismissing the draft prompt without choosing keeps the draft and continues with it (nothing is lost)
  const continueDraft = () => {
    if (draftOffer) {
      setData(draftOffer.data);
      setStep(locked ? 0 : Math.min(Math.max(0, draftOffer.step), STEPS.length - 1));
      setDirty(true);
      setSavedAt(draftOffer.savedAt);
    }
    setDraftOffer(null);
  };
  const startOver = async () => {
    await clearDraft(editId);
    setDraftOffer(null);
    setSavedAt(null);
  };

  // loading, errors and the credit gate
  if (editId && existing.isError) {
    return (
      <EmptyState
        icon="circle-exclamation"
        title="Couldn't load this plan"
        description={existing.error?.message}
        actionLabel="Back to plans"
        onAction={() => nav.navigate('plans')}
      />
    );
  }
  if (!data || (!editId && credits.isLoading)) return <Loading label={editId ? 'Loading plan…' : 'Preparing your plan…'} />;

  const progress = Math.round(((step + 1) / STEPS.length) * 100);
  const current = STEPS[step];
  const last = step === STEPS.length - 1;
  const saving = create.isPending || replace.isPending;
  const errors = attempted ? validateStep(step, data) : {};

  const stepView = (() => {
    const p = { data, update, errors };
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
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* sticky step header: where you are, how far along, tap to jump to another section */}
      <View style={{ backgroundColor: colors.card, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
        <View style={{ height: 4, backgroundColor: colors.bg }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: progress }}>
          <View style={{ width: `${progress}%`, height: 4, backgroundColor: '#F9A825' }} />
        </View>
        <Pressable
          onPress={() => setJumpOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`Step ${step + 1} of ${STEPS.length}: ${current.label}. Choose a section`}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: gutter, minHeight: 64,
            backgroundColor: pressed ? colors.bg : colors.card,
          })}
        >
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#1B5E20', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={current.icon} size={16} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" style={{ fontSize: 13 }}>
              Step {step + 1} of {STEPS.length}{savedAt ? ' · Draft saved' : ''}
            </AppText>
            <AppText weight="700" style={{ fontSize: 18 }} numberOfLines={1}>{current.label}</AppText>
          </View>
          <Icon name="list" size={16} color={colors.textLight} />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        style={{ flex: 1 }}
        contentContainerStyle={[{ padding: gutter, paddingTop: 16, paddingBottom: 32 }, isWide ? { maxWidth: 900, width: '100%', alignSelf: 'center' } : null]}
      >
        {locked ? (
          <Pressable
            onPress={() => setLockOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Credits needed to open the next steps"
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginBottom: 12, borderRadius: 14, backgroundColor: '#FFF4D6', borderWidth: 1, borderColor: '#F9A825' }}
          >
            <Icon name="lock" size={18} color="#111611" />
            <AppText style={{ flex: 1, fontSize: 14, color: '#111611' }}>
              Purchase credits to open the next steps. You can fill in Company Info for free.
            </AppText>
          </Pressable>
        ) : null}
        <Card style={{ padding: 16 }}>{stepView}</Card>
      </ScrollView>

      {/* sticky Back and Next bar, hidden while the keyboard is open */}
      {keyboardVisible ? null : (
        <View
          style={{
            flexDirection: 'row', gap: 12, paddingHorizontal: gutter, paddingTop: 12, paddingBottom: 12 + insets.bottom,
            backgroundColor: colors.card, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
          }}
        >
          {step > 0 ? <Button title="Back" icon="chevron-left" kind="secondary" onPress={() => goTo(step - 1)} /> : null}
          {last ? (
            <Button title={editId ? 'Save changes' : 'Submit plan'} icon="circle-check" onPress={submit} loading={saving} style={{ flex: 1 }} />
          ) : (
            <Button title="Next" icon="chevron-right" onPress={next} style={{ flex: 1 }} />
          )}
        </View>
      )}

      <Sheet visible={jumpOpen} onClose={() => setJumpOpen(false)} title="Plan sections" size="sm">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <Pressable
              key={s.label}
              onPress={() => { setJumpOpen(false); goTo(i); }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={({ pressed }) => ({
                flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingHorizontal: 10, borderRadius: 12,
                backgroundColor: active ? colors.primaryLight : pressed ? colors.bg : 'transparent',
              })}
            >
              <View
                style={{
                  width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: active ? '#1B5E20' : done ? colors.primaryLight : colors.bg,
                  borderWidth: 1, borderColor: active ? '#1B5E20' : done ? 'transparent' : colors.border,
                }}
              >
                {locked && i > 0 ? (
                  <Icon name="lock" size={12} color={colors.textLight} />
                ) : done ? (
                  <Icon name="check" size={12} color={colors.primary} />
                ) : (
                  <AppText weight="700" style={{ fontSize: 13, color: active ? '#FFFFFF' : colors.textLight }}>{i + 1}</AppText>
                )}
              </View>
              <AppText weight={active ? '700' : '500'} style={{ fontSize: 16, color: active ? colors.primary : colors.text }}>{s.label}</AppText>
            </Pressable>
          );
        })}
      </Sheet>

      <Sheet
        visible={lockOpen}
        onClose={() => setLockOpen(false)}
        title="Purchase credits first"
        size="sm"
        footer={
          <>
            <Button title="Not now" kind="secondary" onPress={() => setLockOpen(false)} />
            <Button title="Get credits" icon="coins" onPress={() => { setLockOpen(false); setRequestOpen(true); }} />
          </>
        }
      >
        <AppText style={{ fontSize: 16 }}>
          You need {CREDITS_PER_DOC} credits to go beyond Company Info. Your balance is {balance} credit{balance === 1 ? '' : 's'}.
        </AppText>
        <AppText variant="subtitle" style={{ fontSize: 14 }}>
          Purchase credits to explore the next steps. What you entered here is saved as a draft.
        </AppText>
      </Sheet>

      <CreditRequestSheet visible={requestOpen} onClose={() => { setRequestOpen(false); credits.refetch(); }} required={CREDITS_PER_DOC} balance={balance} />

      <Sheet
        visible={!!draftOffer}
        onClose={continueDraft}
        title="Continue your draft?"
        size="sm"
        footer={
          <>
            <Button title="Start over" kind="secondary" onPress={startOver} />
            <Button title="Continue draft" icon="chevron-right" onPress={continueDraft} />
          </>
        }
      >
        <AppText style={{ fontSize: 16 }}>
          You started this plan{draftOffer ? ` on ${formatDateTime(new Date(draftOffer.savedAt).toISOString())}` : ''} and did not finish it.
          {draftOffer?.data.companyInfo?.companyName ? ` It is for ${draftOffer.data.companyInfo.companyName}.` : ''}
        </AppText>
        <AppText variant="subtitle" style={{ fontSize: 14 }}>Your answers were saved on this phone.</AppText>
      </Sheet>
    </KeyboardAvoidingView>
  );
}
