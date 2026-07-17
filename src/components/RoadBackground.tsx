import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors } from '../constants/theme';

const STRIPE_COUNT = 14;

type RoadBackgroundProps = {
  roadWidth: number;
};

/**
 * Full-bleed roadside scene: sky band, grass shoulders, asphalt lane with dashes.
 */
export function RoadBackground({ roadWidth }: RoadBackgroundProps) {
  return (
    <View style={[styles.root, styles.pointerPassthrough]}>
      <LinearGradient
        colors={[colors.skyTop, colors.skyMid, colors.skyBottom]}
        locations={[0, 0.4, 1]}
        style={styles.sky}
      />

      <View style={styles.horizonGlow} />

      <View style={styles.ground}>
        <LinearGradient
          colors={[colors.grass, colors.grassDark]}
          style={styles.shoulder}
        />

        <View style={[styles.road, { width: roadWidth }]}>
          <View style={styles.edgeLine} />
          <View style={styles.stripes}>
            {Array.from({ length: STRIPE_COUNT }, (_, i) => (
              <View key={i} style={styles.stripe} />
            ))}
          </View>
          <View style={styles.edgeLine} />
        </View>

        <LinearGradient
          colors={[colors.grass, colors.grassDark]}
          style={styles.shoulder}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
  },
  pointerPassthrough: {
    pointerEvents: 'none',
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '28%',
  },
  horizonGlow: {
    position: 'absolute',
    top: '22%',
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  ground: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    paddingTop: '24%',
  },
  shoulder: {
    flex: 1,
  },
  road: {
    flexDirection: 'row',
    backgroundColor: colors.road,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderTopWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  edgeLine: {
    width: 3,
    marginVertical: 10,
    borderRadius: 2,
    backgroundColor: colors.white,
    opacity: 0.5,
  },
  stripes: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 16,
  },
  stripe: {
    width: 11,
    height: 30,
    borderRadius: 3,
    backgroundColor: colors.roadLine,
    opacity: 0.85,
  },
});
