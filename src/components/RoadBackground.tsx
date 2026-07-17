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
    <View style={styles.root} pointerEvents="none">
      <LinearGradient
        colors={[colors.skyTop, colors.skyMid, colors.skyBottom]}
        locations={[0, 0.45, 1]}
        style={styles.sky}
      />

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
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '22%',
  },
  ground: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    paddingTop: '18%',
  },
  shoulder: {
    flex: 1,
  },
  road: {
    flexDirection: 'row',
    backgroundColor: colors.road,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  edgeLine: {
    width: 3,
    marginVertical: 12,
    borderRadius: 2,
    backgroundColor: colors.white,
    opacity: 0.55,
  },
  stripes: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  stripe: {
    width: 12,
    height: 34,
    borderRadius: 3,
    backgroundColor: colors.roadLine,
    opacity: 0.95,
  },
});
