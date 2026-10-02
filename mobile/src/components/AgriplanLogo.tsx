import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

/*
 * The Agriplan mark — three stacked layers (a plan built up layer by layer), the same
 * symbol as the website's sidebar logo. Drawn in a 24-unit box; `tile` adds the rounded
 * green gradient square used for the app icon and the auth screens.
 */
const TOP = 'M12 2 L2 7 L12 12 L22 7 Z';
const MID = 'M2 12 L12 17 L22 12';
const LOW = 'M2 17 L12 22 L22 17';

let uid = 0;

export function AgriplanLogo({
  size = 48,
  color = '#FFFFFF',
  tile = false,
  scale,
}: {
  size?: number;
  /** stroke colour of the layers */
  color?: string;
  /** draw the rounded green gradient tile behind the mark (app-icon look) */
  tile?: boolean;
  /** mark size within the box (defaults to the icon's proportions) */
  scale?: number;
}) {
  const id = React.useMemo(() => `agri${++uid}`, []);
  const s = scale ?? (tile ? 0.62 : 0.86);
  const offset = 12 - 12 * s;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#4CAF50" />
          <Stop offset="0.55" stopColor="#2E7D32" />
          <Stop offset="1" stopColor="#1B5E20" />
        </LinearGradient>
      </Defs>
      {tile ? <Rect width="24" height="24" rx="5.4" fill={`url(#${id}bg)`} /> : null}
      <G transform={`matrix(${s} 0 0 ${s} ${offset} ${offset})`} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <Path d={TOP} />
        <Path d={MID} />
        <Path d={LOW} />
      </G>
    </Svg>
  );
}
