import { getResponsiveLayout } from '../hooks/useResponsiveLayout';

const ZERO_INSETS = { top: 0, bottom: 0, left: 0, right: 0 };

describe('getResponsiveLayout', () => {
  test('returns phone-sized layout values for a standard viewport', () => {
    const layout = getResponsiveLayout(390, 844, ZERO_INSETS);

    expect(layout.contentMaxWidth).toBe(390);
    expect(layout.isCompact).toBe(false);
    expect(layout.isShort).toBe(false);
    expect(layout.horizontalPadding).toBe(18);
    expect(layout.buttonTitleSize).toBeGreaterThanOrEqual(13);
    expect(layout.buttonTitleSize).toBeLessThanOrEqual(17);
    expect(layout.motorcycleTitleSize).toBe(layout.buttonTitleSize);
  });

  test('marks short viewports as compact and short', () => {
    const layout = getResponsiveLayout(360, 560, ZERO_INSETS);

    expect(layout.isShort).toBe(true);
    expect(layout.isCompact).toBe(true);
    expect(layout.scoreFontSize).toBe(44);
    expect(layout.boardGap).toBe(10);
  });

  test('widens padding on large screens and caps content width', () => {
    const layout = getResponsiveLayout(900, 1000, ZERO_INSETS);

    expect(layout.contentMaxWidth).toBe(480);
    expect(layout.horizontalPadding).toBe(28);
  });

  test('accounts for safe-area insets when deciding compact mode', () => {
    const layout = getResponsiveLayout(390, 720, {
      top: 48,
      bottom: 34,
      left: 0,
      right: 0,
    });

    // usable height = 720 - 82 = 638 → short + compact
    expect(layout.isShort).toBe(true);
    expect(layout.isCompact).toBe(true);
  });
});
