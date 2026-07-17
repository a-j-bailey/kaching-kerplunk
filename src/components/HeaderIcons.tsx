import { StyleSheet, Text, View } from 'react-native';

type IconProps = {
  size: number;
  color: string;
};

/** Three ascending bars — no icon font required. */
export function StatsIcon({ size, color }: IconProps) {
  const barWidth = Math.max(3, Math.round(size * 0.18));
  const gap = Math.max(2, Math.round(size * 0.12));

  return (
    <View style={[styles.statsRow, { width: size, height: size, gap }]}>
      <View
        style={[
          styles.bar,
          { width: barWidth, height: size * 0.42, backgroundColor: color },
        ]}
      />
      <View
        style={[
          styles.bar,
          { width: barWidth, height: size * 0.68, backgroundColor: color },
        ]}
      />
      <View
        style={[
          styles.bar,
          { width: barWidth, height: size * 0.92, backgroundColor: color },
        ]}
      />
    </View>
  );
}

/** Circular refresh arrow using a system glyph — no icon font required. */
export function RefreshIcon({ size, color }: IconProps) {
  return (
    <Text
      style={{
        color,
        fontSize: Math.round(size * 0.9),
        lineHeight: size,
        width: size,
        height: size,
        textAlign: 'center',
        fontWeight: '700',
      }}
    >
      {'\u21BB'}
    </Text>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bar: {
    borderRadius: 1.5,
  },
});
