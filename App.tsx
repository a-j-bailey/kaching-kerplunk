import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FloatingPoints } from './src/components/FloatingPoints';
import { PointButton } from './src/components/PointButton';
import { ScoreHeader } from './src/components/ScoreHeader';
import { StatsModal } from './src/components/StatsModal';
import { colors, spacing } from './src/constants/theme';
import { useGameState } from './src/hooks/useGameState';
import { useSounds } from './src/hooks/useSounds';
import type { ScoreAction, VehicleType } from './src/types';
import { triggerScoreHaptics } from './src/utils/haptics';

type Floater = { id: string; points: number };

const STRIPE_COUNT = 12;

export default function App() {
  const {
    score,
    streak,
    stats,
    ready,
    lastDelta,
    recordAction,
    resetScore,
  } = useGameState();
  const { playActionSound } = useSounds();
  const [statsOpen, setStatsOpen] = useState(false);
  const [floaters, setFloaters] = useState<Floater[]>([]);

  const removeFloater = useCallback((id: string) => {
    setFloaters((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleAction = useCallback(
    (vehicle: VehicleType, action: ScoreAction) => {
      const points = recordAction(vehicle, action);
      playActionSound(vehicle, action);
      void triggerScoreHaptics(vehicle, action);
      setFloaters((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, points },
      ]);
    },
    [playActionSound, recordAction],
  );

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={styles.loadingText}>Loading Ka-Ching Kerplunk…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.centerStripes} pointerEvents="none">
        {Array.from({ length: STRIPE_COUNT }, (_, i) => (
          <View key={i} style={styles.stripe} />
        ))}
      </View>

      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScoreHeader
          score={score}
          highScore={stats.highScore}
          streak={streak}
          lastDelta={lastDelta}
        />

        <View style={styles.board}>
          {floaters.map((floater) => (
            <FloatingPoints
              key={floater.id}
              id={floater.id}
              points={floater.points}
              onDone={removeFloater}
            />
          ))}

          <Text style={styles.hint}>Tap when you pass — or get passed!</Text>

          <View style={styles.row}>
            <PointButton vehicle="car" action="pass" onPress={handleAction} />
            <PointButton vehicle="car" action="passed" onPress={handleAction} />
          </View>

          <View style={styles.row}>
            <PointButton vehicle="truck" action="pass" onPress={handleAction} />
            <PointButton vehicle="truck" action="passed" onPress={handleAction} />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.footerBtn} onPress={() => setStatsOpen(true)}>
            <Text style={styles.footerBtnText}>📊 Stats & History</Text>
          </Pressable>
          <Pressable style={styles.footerBtnSecondary} onPress={resetScore}>
            <Text style={styles.footerBtnSecondaryText}>New Round</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <StatsModal
        visible={statsOpen}
        stats={stats}
        onClose={() => setStatsOpen(false)}
        onResetScore={() => {
          resetScore();
          setStatsOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.road,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.road,
    gap: spacing.sm,
  },
  loadingText: {
    fontWeight: '800',
    color: colors.white,
  },
  centerStripes: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 24,
  },
  stripe: {
    width: 14,
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.roadLine,
    opacity: 0.9,
  },
  safe: {
    flex: 1,
  },
  board: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.md,
    justifyContent: 'center',
  },
  hint: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  footerBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.brand,
  },
  footerBtnText: {
    fontWeight: '900',
    color: colors.brand,
  },
  footerBtnSecondary: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  footerBtnSecondaryText: {
    fontWeight: '900',
    color: colors.scoreText,
  },
});
