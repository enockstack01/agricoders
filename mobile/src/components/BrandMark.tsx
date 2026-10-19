import { Image, View } from 'react-native';

/** Official Agricoders logo (navy circuit tree) on a white disc, as used in the pitch decks. */
export function BrandMark({ size = 44 }: { size?: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: size, height: size, borderRadius: size / 2, backgroundColor: '#FFFFFF',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
      }}
    >
      <Image source={require('../../assets/agricoders-logo.png')} style={{ width: size, height: size }} resizeMode="contain" />
    </View>
  );
}
