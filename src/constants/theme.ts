import { Platform } from 'react-native';

export const colors = {
  road: '#1F292E',
  roadLine: '#FFEB3B',
  scorePanel: '#FFF9C4',
  scoreText: '#1A237E',
  highScore: '#F9A825',
  brand: '#FF6F00',
  white: '#FFFFFF',
  black: '#102027',
  green: '#00C853',
  greenDark: '#009624',
  greenPressed: '#00E676',
  red: '#FF1744',
  redDark: '#D50000',
  redPressed: '#FF5252',
  truckAccent: '#FFD600',
  shadow: 'rgba(16, 32, 39, 0.35)',
  overlay: 'rgba(16, 32, 39, 0.55)',
  muted: '#546E7A',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const fonts = {
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    web: 'Courier New',
    default: 'monospace',
  }) as string,
} as const;
