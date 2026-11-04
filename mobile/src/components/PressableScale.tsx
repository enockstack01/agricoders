import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { haptics } from '../lib/haptics';

type Feedback = 'tap' | 'press' | 'select' | 'none';
type StyleState = { pressed: boolean };

/**
 * Splits a style in two. Layout props (flex, alignSelf, margins) go on the touchable itself, so it
 * sizes and aligns the way the caller wrote it and its tap area matches what is drawn. Everything
 * else (colours, padding, borders, size) goes on the inner view that scales while the finger is down.
 */
function splitStyle(style: StyleProp<ViewStyle> | ((state: StyleState) => StyleProp<ViewStyle>) | undefined, state: StyleState) {
  const flat = (StyleSheet.flatten(typeof style === 'function' ? style(state) : style) || {}) as ViewStyle;
  const { flex, flexGrow, flexShrink, flexBasis, alignSelf, margin, marginTop, marginBottom, marginLeft, marginRight, marginHorizontal, marginVertical, ...inner } = flat;
  const outer: ViewStyle = { flex, flexGrow, flexShrink, flexBasis, alignSelf, margin, marginTop, marginBottom, marginLeft, marginRight, marginHorizontal, marginVertical };
  // when the touchable grows, the drawn box inside it grows with it
  const grows = flex != null || flexGrow != null;
  return { outer, inner: grows ? { ...inner, flexGrow: 1 } : inner };
}

/**
 * Pressable that springs down slightly while held and optionally fires a haptic
 * tick — the shared "this responded to my finger" affordance for buttons, cards
 * and rows.
 */
export function PressableScale({
  children,
  style,
  scaleTo = 0.97,
  feedback = 'tap',
  onPressIn,
  onPressOut,
  onPress,
  disabled,
  ...rest
}: Omit<PressableProps, 'style' | 'children'> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | ((state: StyleState) => StyleProp<ViewStyle>);
  scaleTo?: number;
  feedback?: Feedback;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressed = useRef(false);

  const animate = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: to === 1 ? 6 : 0 }).start();

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={(state) => splitStyle(style, state).outer}
      onPressIn={(e) => {
        pressed.current = true;
        animate(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.current = false;
        animate(1);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (feedback !== 'none') haptics[feedback]();
        onPress?.(e);
      }}
    >
      {(state) => <Animated.View style={[splitStyle(style, state).inner, { transform: [{ scale }] }]}>{children}</Animated.View>}
    </Pressable>
  );
}
