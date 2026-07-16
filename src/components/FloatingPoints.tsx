import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { formatPoints } from '../constants/points';
import { colors } from '../constants/theme';

type FloatingPointsProps = {
  id: string;
  points: number;
  onDone: (id: string) => void;
};

export function FloatingPoints({ id, points, onDone }: FloatingPointsProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -70,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.15,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 700,
        delay: 120,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onDone(id);
    });
  }, [id, onDone, opacity, scale, translateY]);

  const positive = points >= 0;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Text style={[styles.text, positive ? styles.positive : styles.negative]}>
        {formatPoints(points)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    alignSelf: 'center',
    top: '42%',
    zIndex: 20,
  },
  text: {
    fontSize: 42,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  positive: {
    color: colors.green,
  },
  negative: {
    color: colors.red,
  },
});
