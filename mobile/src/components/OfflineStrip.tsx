import { View } from 'react-native';
import { useNetworkState } from 'expo-network';
import { Icon } from './Icon';
import { AppText } from './ui';

/** Amber strip under the app bar while the phone has no internet connection. */
export function OfflineStrip() {
  const net = useNetworkState();
  const offline = net.isConnected === false || net.isInternetReachable === false;
  if (!offline) return null;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F9A825', paddingHorizontal: 16, paddingVertical: 8 }}
    >
      <Icon name="cloud-off-outline" size={14} color="#111611" />
      <AppText weight="700" style={{ flex: 1, fontSize: 13, color: '#111611' }}>
        No internet connection. Some actions will not work until you are back online.
      </AppText>
    </View>
  );
}
