import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
    stats,
    sessionStats,
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

  const confirmResetScore = useCallback(
    (onConfirm?: () => void) => {
      if (score === 0) {
        resetScore();
        onConfirm?.();
        return;
      }

      Alert.alert(
        'Start a new round?',
        `This will reset your current score of ${score}. Your high score will be kept.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'New Round',
            style: 'destructive',
            onPress: () => {
              resetScore();
              onConfirm?.();
            },
          },
        ],
      );
    },
    [resetScore, score],
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

        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Stats"
            hitSlop={8}
            onPress={() => setStatsOpen(true)}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          >
            <Ionicons name="stats-chart" size={22} color={colors.white} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="New round"
            hitSlop={8}
            onPress={() => confirmResetScore()}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          >
            <Ionicons name="refresh" size={22} color={colors.white} />
          </Pressable>
        </View>

        <ScoreHeader
          score={score}
          highScore={stats.highScore}
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
      </SafeAreaView>

      <StatsModal
        visible={statsOpen}
        score={score}
        sessionStats={sessionStats}
        allTimeStats={stats}
        onClose={() => setStatsOpen(false)}
        onResetScore={() => {
          confirmResetScore(() => setStatsOpen(false));
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  iconBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  board: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.md,
    justifyContent: 'center',
    paddingBottom: spacing.lg,
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
});
