import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../constants/theme';

type ScoreHeaderProps = {
  score: number;
  highScore: number;
  lastDelta: number | null;
};

export function ScoreHeader({ score, highScore, lastDelta }: ScoreHeaderProps) {
  const bounce = useRef(new Animated.Value(1)).current;
  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lastDelta === null) return;

    bounce.setValue(0.86);
    flash.setValue(1);

    Animated.parallel([
      Animated.spring(bounce, {
        toValue: 1,
        friction: 4,
        tension: 160,
        useNativeDriver: true,
      }),
      Animated.timing(flash, {
        toValue: 0,
        duration: 450,
        useNativeDriver: false,
      }),
    ]).start();
  }, [bounce, flash, lastDelta, score]);

  const flashColor =
    lastDelta === null
      ? colors.scoreText
      : lastDelta >= 0
        ? colors.greenDark
        : colors.redDark;

  return (
    <View style={styles.wrap}>
      <View style={styles.panel}>
        <Text style={styles.label}>SCORE</Text>
        <Animated.View style={{ transform: [{ scale: bounce }] }}>
          <Animated.Text
            style={[
              styles.score,
              {
                color: flash.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.scoreText, flashColor],
                }),
              },
            ]}
          >
            {score}
          </Animated.Text>
        </Animated.View>
        <Text style={styles.highScore}>🏆 High: {highScore}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    alignItems: 'center',
    gap: spacing.sm,
  },
  panel: {
    width: '100%',
    backgroundColor: colors.scorePanel,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.muted,
  },
  score: {
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 72,
  },
  highScore: {
    marginTop: spacing.xs,
    fontSize: 16,
    fontWeight: '800',
    color: colors.highScore,
  },
});
