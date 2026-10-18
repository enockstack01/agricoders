/**
 * Agricoders brand tokens, shared with the Agriplan website: forest #1B5E20, amber #F9A825,
 * tint #F3F8F3, lines #D5E3D6, ink #111611, slate #555555. Navy #0A108A is the parent brand
 * colour and is used where a second colour is needed (info badges, links).
 */
export type Palette = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  bg: string;
  card: string;
  surface: string;
  input: string;
  text: string;
  textLight: string;
  placeholder: string;
  border: string;
  orange: string;
  red: string;
  blue: string;
  purple: string;
  green: string;
  overlay: string;
  stripe: string;
  tableHover: string;
  headerText: string;
};

export const light: Palette = {
  primary: '#1B5E20',
  primaryLight: '#F3F8F3',
  primaryDark: '#164719',
  bg: '#F3F8F3',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  input: '#FFFFFF',
  text: '#111611',
  textLight: '#555555',
  placeholder: '#8A948B',
  border: '#D5E3D6',
  orange: '#F9A825',
  red: '#D32F2F',
  blue: '#0A108A',
  purple: '#555555',
  green: '#2E7D32',
  overlay: 'rgba(0,0,0,0.5)',
  stripe: '#F7FAF7',
  tableHover: '#EAF1EA',
  headerText: '#FFFFFF',
};

// dark mode uses the site's dark greens; brand colours stay the same
export const dark: Palette = {
  ...light,
  primary: '#81C784',
  primaryLight: '#1B3A1D',
  primaryDark: '#A5D6A7',
  bg: '#0c140d',
  card: '#111814',
  surface: '#111814',
  input: '#182019',
  text: '#E6EEE7',
  textLight: '#9AA79B',
  placeholder: '#6b776c',
  border: '#26332a',
  blue: '#BFC2E6',
  purple: '#9AA79B',
  overlay: 'rgba(0,0,0,0.7)',
  stripe: '#141c15',
  tableHover: '#1B2A1D',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

/** brand: 16 radius cards, pill buttons and badges, 12 radius inputs */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

/** Cards are flat in the brand style (level 1 is no shadow); only floating sheets lift. */
export function shadow(level: 1 | 2 | 3 = 1) {
  const y = [0, 0, 4, 8][level];
  return {
    shadowColor: '#000000',
    shadowOpacity: [0, 0, 0.1, 0.12][level],
    shadowRadius: [0, 0, 12, 30][level] / 2,
    shadowOffset: { width: 0, height: y },
    elevation: [0, 0, 4, 8][level],
  };
}

/** Calibri sets slightly smaller than other fonts, so the scale sits one point higher. */
export const font = {
  xs: 12,
  sm: 13,
  md: 14,
  base: 15,
  lg: 16,
  xl: 17,
  xxl: 26,
  huge: 36,
};

/**
 * Carlito: the metric compatible, open licence twin of Calibri (the brand typeface), loaded in
 * App.tsx via @expo-google-fonts/carlito. It ships Regular and Bold only, so the medium and
 * semibold weights resolve to the nearest face.
 */
export const FONTS = {
  '400': 'Carlito_400Regular',
  '500': 'Carlito_400Regular',
  '600': 'Carlito_700Bold',
  '700': 'Carlito_700Bold',
  '800': 'Carlito_700Bold',
} as const;
export type Weight = keyof typeof FONTS;
/** fontFamily for a weight (Android needs a distinct family per weight) */
export const ff = (weight: Weight | string = '400') => FONTS[(String(weight) in FONTS ? String(weight) : '400') as Weight];

/** KPI icon tones: [light bg, dark bg, icon colour]. Forest for most, amber for warnings, red for errors. */
export const KPI_TONES: Record<'green' | 'blue' | 'orange' | 'red' | 'purple', [string, string, string]> = {
  green: ['#1B5E20', '#1B5E20', '#FFFFFF'],
  blue: ['#1B5E20', '#1B5E20', '#FFFFFF'],
  orange: ['#F9A825', '#F9A825', '#111611'],
  red: ['#FFEBEE', '#3D1A1A', '#D32F2F'],
  purple: ['#1B5E20', '#1B5E20', '#FFFFFF'],
};

/** Status → chip colours, mirrors format.js:badgeClass. */
export const STATUS_TONES: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral'> = {
  Active: 'success', Fallow: 'neutral', Preparing: 'warning', Maintenance: 'info',
  Planned: 'info', Planted: 'primary', Growing: 'success', 'Ready for Harvest': 'warning',
  Harvested: 'primary', Completed: 'success', Cancelled: 'danger',
  Available: 'success', 'In Use': 'info', Damaged: 'danger', Retired: 'neutral',
  Pending: 'warning', 'Partially Paid': 'info', Paid: 'success',
  Low: 'warning', Moderate: 'info', High: 'danger', Critical: 'danger',
  Healthy: 'success', 'Under Observation': 'warning', 'At Risk': 'danger',
  'In Stock': 'success', 'Low Stock': 'warning', 'Out of Stock': 'danger',
  Excellent: 'success', Good: 'success', Average: 'warning', Poor: 'danger', Rejected: 'danger',
};

/** Charts: forest first, then amber, navy, green, soft lavender and slate. */
export const CHART_PALETTE = [
  '#1B5E20', '#F9A825', '#0A108A', '#2E7D32', '#BFC2E6',
  '#555555', '#81C784', '#9CA0D6', '#164719', '#D5E3D6',
];
