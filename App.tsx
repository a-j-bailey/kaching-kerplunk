import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { FloatingPoints } from './src/components/FloatingPoints';
import { PointButton } from './src/components/PointButton';
import { RoadBackground } from './src/components/RoadBackground';
import { ScoreHeader } from './src/components/ScoreHeader';
import { StatsModal } from './src/components/StatsModal';
import { colors, spacing } from './src/constants/theme';
import { useGameState } from './src/hooks/useGameState';
import { useResponsiveLayout } from './src/hooks/useResponsiveLayout';
import { useSounds } from './src/hooks/useSounds';
import type { ScoreAction, VehicleType } from './src/types';
import { triggerScoreHaptics } from './src/utils/haptics';

type Floater = { id: string; points: number };

function GameScreen() {
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
  const layout = useResponsiveLayout();
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
      <SafeAreaView style={styles.loading} edges={['top', 'bottom', 'left', 'right']}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={styles.loadingText}>Loading Ka-Ching Kerplunk…</Text>
      </SafeAreaView>
    );
  }

  const iconBtnStyle = {
    width: layout.iconButtonSize,
    height: layout.iconButtonSize,
    borderRadius: layout.iconButtonSize / 2,
  };

  return (
    <View style={styles.root}>
      <RoadBackground roadWidth={layout.roadWidth} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar style="light" />

        <View
          style={[
            styles.content,
            {
              maxWidth: layout.contentMaxWidth,
              paddingHorizontal: layout.horizontalPadding,
            },
          ]}
        >
          <View style={styles.topBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Stats"
              hitSlop={8}
              onPress={() => setStatsOpen(true)}
              style={({ pressed }) => [
                styles.iconBtn,
                iconBtnStyle,
                pressed && styles.iconBtnPressed,
              ]}
            >
              <Ionicons
                name="stats-chart"
                size={layout.iconGlyphSize}
                color={colors.white}
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="New round"
              hitSlop={8}
              onPress={() => confirmResetScore()}
              style={({ pressed }) => [
                styles.iconBtn,
                iconBtnStyle,
                pressed && styles.iconBtnPressed,
              ]}
            >
              <Ionicons
                name="refresh"
                size={layout.iconGlyphSize}
                color={colors.white}
              />
            </Pressable>
          </View>

          <ScoreHeader
            score={score}
            highScore={stats.highScore}
            lastDelta={lastDelta}
            scoreFontSize={layout.scoreFontSize}
            scoreLineHeight={layout.scoreLineHeight}
            compact={layout.isCompact}
          />

          <View
            style={[
              styles.board,
              {
                gap: layout.boardGap,
                paddingBottom: Math.max(
                  spacing.md,
                  layout.insets.bottom > 0 ? spacing.sm : spacing.lg,
                ),
              },
            ]}
          >
            {floaters.map((floater) => (
              <FloatingPoints
                key={floater.id}
                id={floater.id}
                points={floater.points}
                onDone={removeFloater}
              />
            ))}

            <Text style={[styles.hint, { fontSize: layout.hintFontSize }]}>
              Tap when you pass — or get passed!
            </Text>

            <View style={[styles.row, { gap: layout.boardGap }]}>
              <PointButton
                vehicle="car"
                action="pass"
                onPress={handleAction}
                minHeight={layout.buttonMinHeight}
                titleSize={layout.buttonTitleSize}
                emojiSize={layout.buttonEmojiSize}
                pointsSize={layout.buttonPointsSize}
              />
              <PointButton
                vehicle="car"
                action="passed"
                onPress={handleAction}
                minHeight={layout.buttonMinHeight}
                titleSize={layout.buttonTitleSize}
                emojiSize={layout.buttonEmojiSize}
                pointsSize={layout.buttonPointsSize}
              />
            </View>

            <View style={[styles.row, { gap: layout.boardGap }]}>
              <PointButton
                vehicle="truck"
                action="pass"
                onPress={handleAction}
                minHeight={layout.buttonMinHeight}
                titleSize={layout.buttonTitleSize}
                emojiSize={layout.buttonEmojiSize}
                pointsSize={layout.buttonPointsSize}
              />
              <PointButton
                vehicle="truck"
                action="passed"
                onPress={handleAction}
                minHeight={layout.buttonMinHeight}
                titleSize={layout.buttonTitleSize}
                emojiSize={layout.buttonEmojiSize}
                pointsSize={layout.buttonPointsSize}
              />
            </View>

            <View style={[styles.row, { gap: layout.boardGap }]}>
              <PointButton
                vehicle="motorcycle"
                action="pass"
                onPress={handleAction}
                minHeight={layout.motorcycleMinHeight}
                titleSize={layout.motorcycleTitleSize}
                emojiSize={layout.motorcycleEmojiSize}
                pointsSize={layout.motorcyclePointsSize}
              />
              <PointButton
                vehicle="motorcycle"
                action="passed"
                onPress={handleAction}
                minHeight={layout.motorcycleMinHeight}
                titleSize={layout.motorcycleTitleSize}
                emojiSize={layout.motorcycleEmojiSize}
                pointsSize={layout.motorcyclePointsSize}
              />
            </View>
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

export default function App() {
  return (
    <SafeAreaProvider>
      <GameScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.skyBottom,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.skyBottom,
    gap: spacing.sm,
  },
  loadingText: {
    fontWeight: '800',
    color: colors.white,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 32, 39, 0.55)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  iconBtnPressed: {
    backgroundColor: 'rgba(16, 32, 39, 0.75)',
  },
  board: {
    flex: 1,
    paddingTop: spacing.sm,
    justifyContent: 'center',
  },
  hint: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
  },
});
