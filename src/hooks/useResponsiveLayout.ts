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

  // Keep titles readable on web where adjustsFontSizeToFit is unsupported.
  const buttonTitleSize = Math.round(clamp(15 * widthScale, 12, 16));

  return {
    width,
    height,
    insets,
    scale,
    isCompact,
    isShort,
    contentMaxWidth: Math.min(width, CONTENT_MAX_WIDTH),
    // Road lane should clear the button columns so the dashed line sits between them.
    roadWidth: Math.min(width, CONTENT_MAX_WIDTH) - (width >= 600 ? 8 : 0),
    scoreFontSize: Math.round(isShort ? 44 : 64 * scale),
    scoreLineHeight: Math.round(isShort ? 50 : 72 * scale),
    buttonMinHeight: Math.round(isShort ? 88 : isCompact ? 100 : 118 * heightScale),
    motorcycleMinHeight: Math.round(isShort ? 78 : isCompact ? 88 : 100 * heightScale),
    buttonTitleSize,
    buttonEmojiSize: Math.round(clamp(32 * scale, 24, 36)),
    buttonPointsSize: Math.round(clamp(18 * scale, 14, 20)),
    motorcycleTitleSize: buttonTitleSize,
    motorcycleEmojiSize: Math.round(clamp(28 * scale, 22, 32)),
    motorcyclePointsSize: Math.round(clamp(16 * scale, 13, 18)),
    hintFontSize: Math.round(clamp(15 * widthScale, 13, 16)),
    boardGap: isShort ? 10 : 14,
    horizontalPadding: width >= 600 ? 28 : 18,
    iconButtonSize: 48,
    iconGlyphSize: 24,
  };
}
