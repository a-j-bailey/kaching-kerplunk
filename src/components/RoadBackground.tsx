import { StyleSheet, View } from 'react-native';

import { colors } from '../constants/theme';

const STRIPE_COUNT = 14;

/**
 * Full-bleed asphalt lane with edge lines and dashed center stripe.
 */
export function RoadBackground() {
  return (
    <View style={[styles.root, styles.pointerPassthrough]}>
      <View style={styles.road}>
        <View style={styles.edgeLine} />
        <View style={styles.stripes}>
          {Array.from({ length: STRIPE_COUNT }, (_, i) => (
            <View key={i} style={styles.stripe} />
          ))}
        </View>
        <View style={styles.edgeLine} />
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
  road: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    backgroundColor: colors.road,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
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
