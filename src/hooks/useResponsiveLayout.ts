import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;
const CONTENT_MAX_WIDTH = 480;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const usableHeight = Math.max(height - insets.top - insets.bottom, 480);
  const widthScale = clamp(width / BASE_WIDTH, 0.82, 1.15);
  const heightScale = clamp(usableHeight / BASE_HEIGHT, 0.72, 1.1);
  const scale = Math.min(widthScale, heightScale);
  const isCompact = usableHeight < 700;
  const isShort = usableHeight < 640;

  return {
    width,
    height,
    insets,
    scale,
    isCompact,
    isShort,
    contentMaxWidth: Math.min(width, CONTENT_MAX_WIDTH),
    scoreFontSize: Math.round(isShort ? 44 : 64 * scale),
    scoreLineHeight: Math.round(isShort ? 50 : 72 * scale),
    buttonMinHeight: Math.round(isShort ? 100 : isCompact ? 118 : 140 * heightScale),
    buttonTitleSize: Math.round(clamp(18 * widthScale, 14, 20)),
    buttonEmojiSize: Math.round(clamp(36 * scale, 26, 40)),
    buttonPointsSize: Math.round(clamp(22 * scale, 16, 24)),
    hintFontSize: Math.round(clamp(15 * widthScale, 13, 16)),
    boardGap: isShort ? 10 : 16,
    horizontalPadding: width >= 600 ? 24 : 16,
  };
}
