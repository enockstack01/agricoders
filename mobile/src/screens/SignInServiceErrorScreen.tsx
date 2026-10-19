import { Linking, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/theme';
import { AppText } from '../components/ui';
import { Button } from '../components/Button';

/**
 * Shown when the sign in service (Clerk) has not finished loading after a while. Replaces an
 * endless "Connecting to Agriplan…" spinner. It uses no Clerk hooks, because Clerk is the thing
 * that failed to load.
 */
export function SignInServiceErrorScreen({ onRetry }: { onRetry: () => void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center',
        padding: spacing.xl, paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl,
      }}
    >
      <View
        style={{
          width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary,
          alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
        }}
      >
        <Icon name="cloud-off-outline" size={46} color="#FFFFFF" />
      </View>
      <AppText variant="title" style={{ fontSize: 22, textAlign: 'center' }}>Can't connect to sign in</AppText>
      <AppText variant="subtitle" style={{ textAlign: 'center', marginTop: spacing.sm, maxWidth: 340 }}>
        Agriplan could not start its sign in service. Check that your phone has an internet connection, then try again.
      </AppText>
      <AppText variant="caption" style={{ textAlign: 'center', marginTop: spacing.md, maxWidth: 340 }}>
        If this keeps happening, contact agricoders@gmail.com. Details: the sign in service did not finish loading.
      </AppText>

      <View style={{ alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.xl, maxWidth: 420, width: '100%' }}>
        <Button title="Try again" icon="refresh" onPress={onRetry} />
        <Button title="Contact support" kind="ghost" icon="email-outline" onPress={() => Linking.openURL('mailto:agricoders@gmail.com?subject=Agriplan%20app%20cannot%20sign%20in')} />
      </View>
    </View>
  );
}
