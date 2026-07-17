import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;
const CONTENT_MAX_WIDTH = 480;

export type LayoutInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type ResponsiveLayout = {
  width: number;
  height: number;
  insets: LayoutInsets;
  scale: number;
  isCompact: boolean;
  isShort: boolean;
  contentMaxWidth: number;
  roadWidth: number;
  scoreFontSize: number;
  scoreLineHeight: number;
  buttonMinHeight: number;
  motorcycleMinHeight: number;
  buttonTitleSize: number;
  buttonEmojiSize: number;
  buttonPointsSize: number;
  motorcycleTitleSize: number;
  motorcycleEmojiSize: number;
  motorcyclePointsSize: number;
  hintFontSize: number;
  boardGap: number;
  horizontalPadding: number;
  iconButtonSize: number;
  iconGlyphSize: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Pure layout math used by the hook — easy to unit test without RN mocks. */
export function getResponsiveLayout(
  width: number,
  height: number,
  insets: LayoutInsets,
): ResponsiveLayout {
  const usableHeight = Math.max(height - insets.top - insets.bottom, 480);
  const widthScale = clamp(width / BASE_WIDTH, 0.82, 1.15);
  const heightScale = clamp(usableHeight / BASE_HEIGHT, 0.72, 1.1);
  const scale = Math.min(widthScale, heightScale);
  const isCompact = usableHeight < 700;
  const isShort = usableHeight < 640;

  // Keep titles readable on web where adjustsFontSizeToFit is unsupported.
  const buttonTitleSize = Math.round(clamp(15.5 * widthScale, 13, 17));
  const contentMaxWidth = Math.min(width, CONTENT_MAX_WIDTH);
  // Leave grass shoulders visible on both sides of the asphalt lane.
  const roadWidth = Math.round(
    clamp(Math.min(width * 0.86, contentMaxWidth - 24), 280, contentMaxWidth),
  );

  return {
    width,
    height,
    insets,
    scale,
    isCompact,
    isShort,
    contentMaxWidth,
    roadWidth,
    scoreFontSize: Math.round(isShort ? 44 : 60 * scale),
    scoreLineHeight: Math.round(isShort ? 50 : 68 * scale),
    buttonMinHeight: Math.round(isShort ? 92 : isCompact ? 104 : 120 * heightScale),
    motorcycleMinHeight: Math.round(isShort ? 82 : isCompact ? 92 : 104 * heightScale),
    buttonTitleSize,
    buttonEmojiSize: Math.round(clamp(34 * scale, 28, 40)),
    buttonPointsSize: Math.round(clamp(18 * scale, 15, 21)),
    motorcycleTitleSize: buttonTitleSize,
    motorcycleEmojiSize: Math.round(clamp(30 * scale, 24, 34)),
    motorcyclePointsSize: Math.round(clamp(17 * scale, 14, 19)),
    hintFontSize: Math.round(clamp(15 * widthScale, 13, 16)),
    boardGap: isShort ? 10 : 14,
    horizontalPadding: width >= 600 ? 28 : 18,
    iconButtonSize: 48,
    iconGlyphSize: 26,
  };
}

export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return getResponsiveLayout(width, height, insets);
}
