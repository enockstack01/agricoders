import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/theme';
import { AppText, Badge, ChartCard, Grid, PageHeader, Screen, useLayout } from '../components/ui';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { SelectField, TextField } from '../components/fields';
import { COMPANY_TYPES, CURRENCIES, NumField, PercentField } from '../components/planFields';
import { useConfirm } from '../components/Confirm';
import { useToast } from '../components/Toast';
import { useProfile, useRole, useSaveProfile } from '../lib/useResource';
import { setCurrency } from '../lib/format';
import type { UserProfileDefaults } from '../shared/types';

const ROLE_LABEL = { user: 'Planner', admin: 'Admin', super_admin: 'Super Admin' } as const;

/** One tappable row: round icon, label, short description and a chevron (48 px or taller). */
function LinkRow({ icon, label, sub, onPress }: { icon: string; label: string; sub: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${sub}`}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, paddingHorizontal: 10, borderRadius: radius.md,
        backgroundColor: pressed ? colors.bg : 'transparent',
      })}
    >
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#1B5E20', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={15} color="#FFFFFF" />
      </View>
      <View style={{ flex: 1 }}>
        <AppText weight="700" style={{ fontSize: 16 }}>{label}</AppText>
        <AppText variant="subtitle" style={{ fontSize: 14 }} numberOfLines={1}>{sub}</AppText>
      </View>
      <Icon name="chevron-right" size={13} color={colors.textLight} />
    </Pressable>
  );
}

/** Website "Profile & Default Settings": account, plan defaults, appearance, sign out. */
export function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const { user } = useUser();
  const { signOut } = useAuth();
  const role = useRole();
  const { columns, isTablet } = useLayout();
  const nav = useNavigation<any>();
  const confirm = useConfirm();
  const toast = useToast();
  const { defaults } = useProfile();
  const save = useSaveProfile();
  const [form, setForm] = useState<UserProfileDefaults | null>(defaults);

  useEffect(() => {
    if (defaults && !form) setForm(defaults);
  }, [defaults, form]);

  const set = <K extends keyof UserProfileDefaults>(k: K, v: UserProfileDefaults[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  const onSave = async () => {
    if (!form) return;
    try {
      await save.mutateAsync(form);
      setCurrency(form.currency);
      toast('Defaults saved. They apply to every new business plan', 'success');
    } catch (e: any) {
      toast(e?.message || 'Failed to save. Please try again.', 'error');
    }
  };

  const copyId = async () => {
    if (!user?.id) return;
    await Clipboard.setStringAsync(user.id);
    toast('Account ID copied', 'success');
  };

  const onSignOut = async () => {
    if (await confirm('Sign out of Planner on this device?', { confirmLabel: 'Sign out', danger: true })) signOut();
  };

  const cols = columns >= 2 ? 2 : 1;

  return (
    <Screen>
      <PageHeader title="Profile & Settings" subtitle="These defaults prefill every new business plan. You can override them inside any plan." />

      <ChartCard title="Account" icon="user" style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          {user?.hasImage ? (
            <Image source={{ uri: user.imageUrl }} style={{ width: 56, height: 56, borderRadius: 12 }} />
          ) : (
            <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="user" size={22} color={colors.primary} />
            </View>
          )}
          <View style={{ flex: 1, gap: 2 }}>
            <AppText weight="600" style={{ fontSize: 15 }}>{user?.fullName || 'N/A'}</AppText>
            <AppText variant="subtitle" style={{ fontSize: 13 }}>{user?.primaryEmailAddress?.emailAddress || 'N/A'}</AppText>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
              <Badge label={ROLE_LABEL[role]} tone={role === 'user' ? 'neutral' : 'info'} />
            </View>
          </View>
        </View>
        <AppText variant="label">Your Account ID</AppText>
        <AppText variant="caption" style={{ marginBottom: 6 }}>Share this ID with an admin when requesting credits.</AppText>
        <Pressable
          onPress={copyId}
          accessibilityRole="button"
          accessibilityLabel="Copy account ID"
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
            backgroundColor: pressed ? colors.bg : colors.input, paddingHorizontal: 14, minHeight: 48,
          })}
        >
          <AppText style={{ flex: 1, fontSize: 12, fontFamily: 'monospace' }} numberOfLines={1}>{user?.id || 'N/A'}</AppText>
          <Icon name="copy" size={13} color={colors.primary} />
        </Pressable>
      </ChartCard>

      {form ? (
        <>
          <ChartCard title="Company Defaults" icon="building" style={{ marginBottom: 20 }} bodyStyle={{ gap: spacing.md }}>
            <Grid columns={cols} gap={spacing.md}>
              <TextField label="Default Author Title" hint="Prefilled in every new plan" value={form.authorTitle} onChangeValue={(v) => set('authorTitle', v)} placeholder="Founder & CEO" />
              <TextField label="Default Location / Country" value={form.location} onChangeValue={(v) => set('location', v)} placeholder="e.g. Kigali, Rwanda" />
              <SelectField label="Default Company Type" value={form.companyType} onChangeValue={(v) => set('companyType', v)} options={COMPANY_TYPES} />
              <TextField label="Default Industry" value={form.industry} onChangeValue={(v) => set('industry', v)} placeholder="e.g. Retail, Technology, Agriculture" />
            </Grid>
            <SelectField label="Default Currency" hint="All monetary values in new plans use this code" value={form.currency} onChangeValue={(v) => set('currency', v)} options={CURRENCIES} placeholder="" />
          </ChartCard>

          <ChartCard title="Default Financial Rates" icon="percent" style={{ marginBottom: 20 }} bodyStyle={{ gap: spacing.md }}>
            <Grid columns={cols} gap={spacing.md}>
              <PercentField label="Corporate Income Tax" value={form.citRate} onChange={(v) => set('citRate', v)} />
              <PercentField label="NPV Discount Rate" value={form.discountRate} onChange={(v) => set('discountRate', v)} />
              <PercentField label="Loan Interest Rate" value={form.loanRate} onChange={(v) => set('loanRate', v)} />
              <NumField label="Loan Term (Years)" integer value={form.loanTermYears} onChange={(v) => set('loanTermYears', v || 5)} />
              <PercentField label="Social Security / Pension" value={form.rssbRate} onChange={(v) => set('rssbRate', v)} />
              <PercentField label="Health Insurance" value={form.healthInsuranceRate} onChange={(v) => set('healthInsuranceRate', v)} />
              <PercentField label="Other Payroll Deduction" value={form.maternityRate} onChange={(v) => set('maternityRate', v)} />
            </Grid>
            <Button title="Save Defaults" icon="floppy-disk" onPress={onSave} loading={save.isPending} />
          </ChartCard>
        </>
      ) : null}

      <ChartCard title="Appearance" icon="palette" style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['light', 'dark', 'system'] as const).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === m }}
              style={{
                flex: 1, minHeight: 48, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center',
                borderWidth: 1, borderColor: mode === m ? colors.primary : colors.border,
                backgroundColor: mode === m ? colors.primary : colors.card,
              }}
            >
              <AppText weight="700" style={{ fontSize: 15, color: mode === m ? '#fff' : colors.text, textTransform: 'capitalize' }}>{m}</AppText>
            </Pressable>
          ))}
        </View>
      </ChartCard>

      {(role === 'admin' || role === 'super_admin') && !isTablet ? (
        <ChartCard title="Administration" icon="user-shield" style={{ marginBottom: 20 }} bodyStyle={{ padding: 8 }}>
          <LinkRow icon="chart-column" label="Admin Panel" sub="Numbers, users, plans and credit requests" onPress={() => nav.navigate('admin')} />
          {role === 'super_admin' ? (
            <LinkRow icon="users" label="User Management" sub="Change who is a user or an admin" onPress={() => nav.navigate('user-management')} />
          ) : null}
        </ChartCard>
      ) : null}

      <ChartCard title="Help" icon="circle-question" style={{ marginBottom: 20 }} bodyStyle={{ padding: 8 }}>
        <LinkRow
          icon="envelope"
          label="Contact support"
          sub="agricoderstech@gmail.com"
          onPress={() => Linking.openURL('mailto:agricoderstech@gmail.com?subject=Planner%20mobile%20app')}
        />
      </ChartCard>

      <Button title="Sign out" icon="right-from-bracket" kind="danger" onPress={onSignOut} />
      <AppText variant="caption" style={{ textAlign: 'center', marginTop: 16 }}>
        Planner mobile v{Constants.expoConfig?.version ?? '1.2.1'} · Agricoders
      </AppText>
    </Screen>
  );
}
