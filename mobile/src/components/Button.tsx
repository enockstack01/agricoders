import { ActivityIndicator, Text, ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { useTheme } from '../theme/ThemeProvider';
import { ff, radius } from '../theme/theme';
import { PressableScale } from './PressableScale';
import { useOnBanner } from './banner';

type Kind = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * Brand buttons: pill shape, Carlito bold, icon before the label, 48px tall (44px for the small size).
 * On the forest page banner the primary button turns amber and the secondary one outlined.
 */
export function Button({
  title,
  onPress,
  kind = 'primary',
  icon,
  loading,
  disabled,
  size = 'md',
  style,
}: {
  title: string;
  onPress: () => void;
  kind?: Kind;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}) {
  const { colors, isDark } = useTheme();
  const onBanner = useOnBanner();
  const isDisabled = disabled || loading;

  const bg: Record<Kind, string> = {
    primary: onBanner ? '#F9A825' : isDark ? '#1B5E20' : colors.primary,
    secondary: onBanner ? 'transparent' : colors.card,
    danger: colors.red,
    ghost: 'transparent',
  };
  const fg: Record<Kind, string> = {
    primary: onBanner ? '#111611' : '#fff',
    secondary: onBanner ? '#fff' : colors.text,
    danger: '#fff',
    ghost: onBanner ? '#fff' : colors.primary,
  };
  const border: Record<Kind, string> = {
    primary: onBanner ? '#F9A825' : isDark ? '#1B5E20' : colors.primary,
    secondary: onBanner ? 'rgba(255,255,255,0.45)' : colors.border,
    danger: colors.red,
    ghost: 'transparent',
  };
  const sm = size === 'sm';

  // A disabled button keeps a readable label: it gets its own muted fill with dark (light mode),
  // light (dark mode) or white (on the forest banner) text, never a faded copy of the normal button.
  // A button that is only loading keeps its normal colours.
  if (disabled) {
    if (onBanner) {
      bg[kind] = 'rgba(255,255,255,0.16)';
      fg[kind] = '#FFFFFF';
      border[kind] = 'rgba(255,255,255,0.45)';
    } else {
      bg[kind] = isDark ? '#1E2A21' : '#E6EEE7';
      fg[kind] = isDark ? '#C9D6CA' : '#3D4A3E';
      border[kind] = isDark ? '#33443A' : '#C5D5C7';
    }
  }

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      feedback={kind === 'ghost' ? 'select' : 'tap'}
      scaleTo={0.97}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: border[kind],
          backgroundColor: bg[kind],
          minHeight: sm ? 44 : 48,
          paddingHorizontal: sm ? 14 : 18,
          opacity: pressed && !isDisabled ? 0.9 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg[kind]} />
      ) : icon ? (
        <Icon name={icon} size={sm ? 12 : 13} color={fg[kind]} />
      ) : null}
      <Text style={{ color: fg[kind], fontFamily: ff('700'), fontSize: sm ? 13 : 14 }}>{title}</Text>
    </PressableScale>
  );
}
