import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../theme/ThemeProvider';
import { ff, KPI_TONES, radius, shadow, spacing } from '../theme/theme';
import { AppText, Badge, Card, IconButton } from './ui';
import { Icon } from './Icon';
import { Button } from './Button';
import { Sheet } from './Sheet';
import { TextAreaField } from './fields';
import { useToast } from './Toast';
import { PressableScale } from './PressableScale';
import { haptics } from '../lib/haptics';
import { formatDate } from '../lib/format';
import { useRequestCredits, Submission } from '../lib/useResource';
import { CREDITS_PER_DOC, DocType, docExt, docLabel, getDocument, InsufficientCreditsError } from '../lib/documents';

/* ----------------------------------------------------------------- Stepper */
/** web .stepper: − value + */
export function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { colors } = useTheme();
  const btn = (label: string, next: number, disabled = false) => (
    <Pressable
      onPress={() => { haptics.select(); onChange(next); }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label === '−' ? 'Decrease' : 'Increase'}
      style={({ pressed }) => ({
        width: 34, height: 34, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
        alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.4 : 1,
        backgroundColor: pressed ? colors.bg : colors.card,
      })}
    >
      <AppText weight="700" style={{ fontSize: 16 }}>{label}</AppText>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      {btn('−', Math.max(0, value - 1), value === 0)}
      <AppText weight="700" style={{ fontSize: 15, minWidth: 18, textAlign: 'center' }}>{value}</AppText>
      {btn('+', value + 1)}
    </View>
  );
}

/* ------------------------------------------------------- GeneratingOverlay */
const GEN_MESSAGES = [
  'Analysing your business data…',
  'Generating AI narrative…',
  'Building financial projections…',
  'Embedding professional charts…',
  'Formatting your document…',
  'Finalising everything…',
];

/** Full-screen progress while a document is generated (30–90 s), as on the website. */
export function GeneratingOverlay({ visible, type, companyName }: { visible: boolean; type: DocType; companyName: string }) {
  const { colors } = useTheme();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!visible) return;
    setI(0);
    const iv = setInterval(() => setI((x) => (x + 1) % GEN_MESSAGES.length), 3500);
    return () => clearInterval(iv);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
        <View style={{ width: '100%', maxWidth: 380, backgroundColor: colors.card, borderRadius: 14, padding: 28, alignItems: 'center', ...shadow(3) }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <AppText weight="600" style={{ fontSize: 16, textAlign: 'center' }}>Generating {docLabel(type)}</AppText>
          <AppText variant="subtitle" style={{ fontSize: 13, textAlign: 'center', marginTop: 2 }} numberOfLines={1}>{companyName}</AppText>
          <AppText weight="600" style={{ fontSize: 12, color: colors.primary, marginTop: 18, minHeight: 18 }}>{GEN_MESSAGES[i]}</AppText>
          <AppText variant="caption" style={{ textAlign: 'center', marginTop: 8 }}>
            This usually takes 30–90 seconds. Please keep the app open.
          </AppText>
        </View>
      </View>
    </Modal>
  );
}

/* ------------------------------------------------------ CreditRequestSheet */
/** Request credits from the admin — documents × 5 credits, optional note (website CreditsModal). */
export function CreditRequestSheet({
  visible,
  onClose,
  required = 0,
  balance,
}: {
  visible: boolean;
  onClose: () => void;
  /** > 0 when opened because a generation was refused for lack of credits */
  required?: number;
  balance?: number;
}) {
  const { colors } = useTheme();
  const toast = useToast();
  const request = useRequestCredits();
  const [bp, setBp] = useState(required > 0 ? 1 : 0);
  const [fm, setFm] = useState(0);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const total = (bp + fm) * CREDITS_PER_DOC;

  useEffect(() => {
    if (visible) { setBp(required > 0 ? 1 : 0); setFm(0); setNote(''); setSent(false); }
  }, [visible, required]);

  const submit = async () => {
    const documents: { type: DocType; count: number }[] = [];
    if (bp > 0) documents.push({ type: 'business-plan', count: bp });
    if (fm > 0) documents.push({ type: 'financial-model', count: fm });
    try {
      await request.mutateAsync({ documents, note: note.trim() || undefined });
      haptics.success();
      setSent(true);
    } catch (e: any) {
      toast(e?.message || 'Failed to submit request. Please try again.', 'error');
    }
  };

  const Row = ({ title, sub, value, onChange }: { title: string; sub: string; value: number; onChange: (v: number) => void }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 14, marginBottom: 10 }}>
      <View style={{ flex: 1 }}>
        <AppText weight="600" style={{ fontSize: 13 }}>{title}</AppText>
        <AppText variant="caption">{sub}</AppText>
      </View>
      <Stepper value={value} onChange={onChange} />
    </View>
  );

  if (sent) {
    return (
      <Sheet visible={visible} onClose={onClose} title="Request sent" size="sm" footer={<Button title="Done" onPress={onClose} />}>
        <View style={{ alignItems: 'center', gap: 10, paddingVertical: 8 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="circle-check" size={28} color={colors.primary} />
          </View>
          <AppText variant="subtitle" style={{ fontSize: 13, textAlign: 'center' }}>
            Your credit request has been submitted. The admin will review it and the credits will appear in your account once approved.
          </AppText>
        </View>
      </Sheet>
    );
  }

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={required > 0 ? 'Insufficient credits' : 'Request credits'}
      size="sm"
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="Cancel" kind="secondary" onPress={onClose} />
          <Button title="Send request" icon="paper-plane" onPress={submit} loading={request.isPending} disabled={total === 0} />
        </View>
      }
    >
      {required > 0 ? (
        <View style={{ flexDirection: 'row', gap: 10, backgroundColor: KPI_TONES.orange[0], borderLeftWidth: 3, borderLeftColor: colors.orange, borderRadius: radius.md, padding: 12, marginBottom: 16 }}>
          <Icon name="triangle-exclamation" size={14} color={colors.orange} />
          <AppText style={{ flex: 1, fontSize: 13, color: '#263238' }}>
            You need {required} credits but have {balance ?? 0}. Request more from your admin below.
          </AppText>
        </View>
      ) : (
        <AppText variant="subtitle" style={{ fontSize: 13, marginBottom: 16 }}>Select the documents you need and send a request to the admin.</AppText>
      )}
      <AppText variant="label" style={{ marginBottom: 8 }}>Documents ({CREDITS_PER_DOC} credits each)</AppText>
      <Row title="Business Plan (.docx)" sub="Narrative + charts" value={bp} onChange={setBp} />
      <Row title="Financial Model (.xlsx)" sub="19-sheet spreadsheet" value={fm} onChange={setFm} />
      <View style={{ marginTop: 6 }}>
        <TextAreaField label="Note for the admin" hint="Optional" value={note} onChangeValue={setNote} placeholder="Anything the admin should know…" />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radius.lg, padding: 14, marginTop: 14 }}>
        <AppText weight="600" style={{ fontSize: 12, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Credits to request</AppText>
        <AppText weight="800" style={{ fontSize: 18 }}>{total}</AppText>
      </View>
    </Sheet>
  );
}

/* ------------------------------------------------------- useDocumentActions */
/**
 * Generate / download handling shared by the dashboard and the plans list: shows the
 * generating overlay, refreshes credits and stored-copy dates, and opens the credit
 * request sheet when the balance is too low.
 */
export function useDocumentActions() {
  const toast = useToast();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<{ type: DocType; companyName: string; generating: boolean } | null>(null);
  const [needCredits, setNeedCredits] = useState<{ required: number; balance: number } | null>(null);

  const run = async (plan: Submission, type: DocType, stored: boolean) => {
    const companyName = plan.companyInfo?.companyName || 'Unnamed plan';
    setBusy({ type, companyName, generating: !stored });
    try {
      await getDocument({ id: plan._id, type, companyName, stored });
      haptics.success();
      if (!stored) {
        qc.invalidateQueries({ queryKey: ['credits'] });
        qc.invalidateQueries({ queryKey: ['doc-meta'] });
        qc.invalidateQueries({ queryKey: ['notifications'] });
      }
    } catch (e: any) {
      haptics.error();
      if (e instanceof InsufficientCreditsError) setNeedCredits({ required: e.required, balance: e.balance });
      else toast(e?.message || 'Something went wrong', 'error');
    } finally {
      setBusy(null);
    }
  };

  const ui = (
    <>
      <GeneratingOverlay visible={!!busy?.generating} type={busy?.type ?? 'business-plan'} companyName={busy?.companyName ?? ''} />
      <CreditRequestSheet visible={!!needCredits} onClose={() => setNeedCredits(null)} required={needCredits?.required} balance={needCredits?.balance} />
    </>
  );

  return { run, busy, ui };
}

/* ------------------------------------------------------------ DocumentSheet */
/** Per-plan document menu: generate (5 credits) or download the stored copy (free) for each document. */
export function DocumentSheet({
  plan,
  meta,
  onClose,
  onRun,
}: {
  plan: Submission | null;
  meta?: { docx?: string; xlsx?: string };
  onClose: () => void;
  onRun: (plan: Submission, type: DocType, stored: boolean) => void;
}) {
  const { colors } = useTheme();
  const types: DocType[] = ['business-plan', 'financial-model'];

  const Action = ({ icon, title, sub, right, onPress, disabled }: { icon: string; title: string; sub?: string; right?: string; onPress: () => void; disabled?: boolean }) => (
    <Pressable
      onPress={() => { haptics.select(); onPress(); }}
      disabled={disabled}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 10,
        borderRadius: radius.md, opacity: disabled ? 0.45 : 1, backgroundColor: pressed ? colors.bg : 'transparent',
      })}
    >
      <Icon name={icon} size={15} color={colors.textLight} />
      <View style={{ flex: 1 }}>
        <AppText weight="600" style={{ fontSize: 13 }}>{title}</AppText>
        {sub ? <AppText variant="caption">{sub}</AppText> : null}
      </View>
      {right ? <AppText weight="700" style={{ fontSize: 11, color: right === 'Free' ? colors.primary : colors.textLight }}>{right}</AppText> : null}
    </Pressable>
  );

  return (
    <Sheet visible={!!plan} onClose={onClose} title={plan?.companyInfo?.companyName || 'Documents'} size="sm">
      {plan
        ? types.map((t, idx) => {
            const storedAt = t === 'business-plan' ? meta?.docx : meta?.xlsx;
            return (
              <View key={t} style={{ paddingTop: idx ? 12 : 0, marginTop: idx ? 6 : 0, borderTopWidth: idx ? StyleSheet.hairlineWidth : 0, borderTopColor: colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Icon name={t === 'business-plan' ? 'file-lines' : 'chart-column'} size={14} color={t === 'business-plan' ? colors.blue : colors.primary} />
                  <AppText weight="600" style={{ fontSize: 14 }}>{docLabel(t)} (.{docExt(t)})</AppText>
                </View>
                <Action
                  icon="rotate"
                  title="Generate & download"
                  sub="Creates a fresh, up-to-date document"
                  right={`${CREDITS_PER_DOC} cr`}
                  onPress={() => { onClose(); onRun(plan, t, false); }}
                />
                <Action
                  icon="download"
                  title={storedAt ? `Download stored copy` : 'No stored copy yet'}
                  sub={storedAt ? `Generated ${formatDate(storedAt)}` : 'Generate it once, then re-download free'}
                  right={storedAt ? 'Free' : undefined}
                  disabled={!storedAt}
                  onPress={() => { onClose(); onRun(plan, t, true); }}
                />
              </View>
            );
          })
        : null}
    </Sheet>
  );
}

/* ----------------------------------------------------------------- PlanCard */
/** One business plan (website table row → mobile card). */
export function PlanCard({
  plan,
  meta,
  onDocuments,
  onEdit,
  onDelete,
}: {
  plan: Submission;
  meta?: { docx?: string; xlsx?: string };
  onDocuments: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { colors } = useTheme();
  const ci = plan.companyInfo || ({} as Submission['companyInfo']);
  const sub = [ci.companyFocus, ci.location].filter(Boolean).join(' · ');
  return (
    <Card style={{ padding: 0 }}>
      <PressableScale onPress={onDocuments} scaleTo={0.99} accessibilityRole="button" accessibilityLabel={`Documents for ${ci.companyName}`} style={{ padding: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="file-lines" size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <AppText weight="600" style={{ fontSize: 15 }} numberOfLines={1}>{ci.companyName || 'Unnamed plan'}</AppText>
            {ci.productName ? <AppText variant="subtitle" style={{ fontSize: 12 }} numberOfLines={1}>{ci.productName}</AppText> : null}
            <AppText variant="caption" numberOfLines={1}>{[sub, formatDate(plan.createdAt)].filter(Boolean).join(' · ')}</AppText>
          </View>
          <IconButton name="pen" label="Edit plan" onPress={onEdit} />
          <IconButton name="trash-can" label="Delete plan" color={colors.red} onPress={onDelete} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Badge label={meta?.docx ? `Business Plan · ${formatDate(meta.docx)}` : 'Business Plan'} tone="info" />
          <Badge label={meta?.xlsx ? `Financial Model · ${formatDate(meta.xlsx)}` : 'Financial Model'} tone="success" />
        </View>
        <AppText weight="600" style={{ fontSize: 12, color: colors.primary, fontFamily: ff('600') }}>Tap for documents ›</AppText>
      </PressableScale>
    </Card>
  );
}
