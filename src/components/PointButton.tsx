import { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import { formatPoints } from '../constants/points';
import { colors, fonts, spacing } from '../constants/theme';
import type { ScoreAction, VehicleType } from '../types';

type PointButtonProps = {
  vehicle: VehicleType;
  action: ScoreAction;
  onPress: (vehicle: VehicleType, action: ScoreAction) => void;
  style?: ViewStyle;
  minHeight?: number;
  titleSize?: number;
  emojiSize?: number;
  pointsSize?: number;
};

const COPY: Record<
  `${VehicleType}-${ScoreAction}`,
  { title: string; subtitle: string; emoji: string }
> = {
  'car-pass': {
    title: 'PASS CAR',
    subtitle: formatPoints(10),
    emoji: '🚗',
  },
  'car-passed': {
    title: 'GOT PASSED',
    subtitle: formatPoints(-10),
    emoji: '🚗',
  },
  'truck-pass': {
    title: 'PASS TRUCK',
    subtitle: formatPoints(100),
    emoji: '🚛',
  },
  'truck-passed': {
    title: 'TRUCK PASSED',
    subtitle: formatPoints(-100),
    emoji: '🚛',
  },
  'motorcycle-pass': {
    title: 'PASS BIKE',
    subtitle: formatPoints(20),
    emoji: '🏍️',
  },
  'motorcycle-passed': {
    title: 'BIKE PASSED',
    subtitle: formatPoints(-20),
    emoji: '🏍️',
  },
};

export function PointButton({
  vehicle,
  action,
  onPress,
  style,
  minHeight = 140,
  titleSize = 15,
  emojiSize = 34,
  pointsSize = 20,
}: PointButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const isPositive = action === 'pass';
  const copy = COPY[`${vehicle}-${action}`];

  const animateIn = () => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const animateOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 140,
    }).start();
  };

  return (
    <Animated.View style={[{ flex: 1, transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${copy.title} ${copy.subtitle}`}
        onPressIn={animateIn}
        onPressOut={animateOut}
        onPress={() => onPress(vehicle, action)}
        style={({ pressed }) => [
          styles.button,
          { minHeight },
          isPositive ? styles.green : styles.red,
          pressed && (isPositive ? styles.greenPressed : styles.redPressed),
        ]}
      >
        <Text
          style={[styles.emoji, { fontSize: emojiSize, lineHeight: emojiSize + 4 }]}
          allowFontScaling={false}
        >
          {copy.emoji}
        </Text>
        <Text
          style={[styles.title, { fontSize: titleSize, lineHeight: titleSize + 3 }]}
          allowFontScaling={false}
        >
          {copy.title}
        </Text>
        <View style={styles.badge}>
          <Text
            style={[
              styles.points,
              { fontSize: pointsSize },
              isPositive ? styles.pointsGreen : styles.pointsRed,
            ]}
            allowFontScaling={false}
          >
            {copy.subtitle}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: 4,
    shadowColor: colors.shadow,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  green: {
    backgroundColor: colors.green,
  },
  red: {
    backgroundColor: colors.red,
  },
  greenPressed: {
    backgroundColor: colors.greenPressed,
  },
  redPressed: {
    backgroundColor: colors.redPressed,
  },
  emoji: {
    textAlign: 'center',
  },
  title: {
    color: colors.white,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 2,
  },
  badge: {
    marginTop: 2,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  points: {
    fontWeight: '900',
    fontFamily: fonts.mono,
    fontVariant: ['tabular-nums'],
  },
  pointsGreen: {
    color: colors.greenDark,
  },
  pointsRed: {
    color: colors.redDark,
  },
});
