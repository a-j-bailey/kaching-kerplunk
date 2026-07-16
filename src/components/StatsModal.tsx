import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatPoints } from '../constants/points';
import { colors, fonts, spacing } from '../constants/theme';
import type { GameStats, ScoreEvent, SessionStats, StatsScope } from '../types';

type StatsModalProps = {
  visible: boolean;
  score: number;
  sessionStats: SessionStats;
  allTimeStats: GameStats;
  onClose: () => void;
  onResetScore: () => void;
};

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function HistoryList({ history }: { history: ScoreEvent[] }) {
  if (history.length === 0) {
    return <Text style={styles.empty}>No plays yet — hit those big buttons!</Text>;
  }

  return (
    <>
      {history.slice(0, 30).map((event) => (
        <View key={event.id} style={styles.historyRow}>
          <Text style={styles.historyLeft}>
            {event.vehicle === 'car' ? '🚗' : '🚛'}{' '}
            {event.action === 'pass' ? 'passed' : 'got passed'}
          </Text>
          <Text
            style={[styles.historyPoints, event.points >= 0 ? styles.pos : styles.neg]}
          >
            {formatPoints(event.points)}
          </Text>
        </View>
      ))}
    </>
  );
}

export function StatsModal({
  visible,
  score,
  sessionStats,
  allTimeStats,
  onClose,
  onResetScore,
}: StatsModalProps) {
  const [scope, setScope] = useState<StatsScope>('thisGame');
  const isThisGame = scope === 'thisGame';
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const sheetMaxHeight = Math.min(height * 0.9, height - Math.max(insets.top, 12));
  const sheetMaxWidth = Math.min(width, 520);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            {
              maxHeight: sheetMaxHeight,
              maxWidth: sheetMaxWidth,
              width: '100%',
              paddingBottom: Math.max(spacing.xl, insets.bottom + spacing.md),
              paddingLeft: Math.max(spacing.lg, insets.left + spacing.md),
              paddingRight: Math.max(spacing.lg, insets.right + spacing.md),
            },
          ]}
        >          <Text style={styles.title}>Game Stats</Text>
          <Text style={styles.subtitle}>
            {isThisGame ? 'Current round only' : 'Saved on this device'}
          </Text>

          <View style={styles.toggle}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isThisGame }}
              onPress={() => setScope('thisGame')}
              style={[styles.toggleBtn, isThisGame && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, isThisGame && styles.toggleTextActive]}>
                This Game
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: !isThisGame }}
              onPress={() => setScope('allTime')}
              style={[styles.toggleBtn, !isThisGame && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, !isThisGame && styles.toggleTextActive]}>
                All Time
              </Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces
          >
            {isThisGame ? (
              <>
                <StatRow label="Current score" value={score} />
                <StatRow label="Peak this round" value={sessionStats.peakScore} />
                <StatRow label="Cars passed" value={sessionStats.carsPassed} />
                <StatRow label="Got passed (cars)" value={sessionStats.carsGotPassed} />
                <StatRow label="Trucks passed" value={sessionStats.trucksPassed} />
                <StatRow label="Got passed (trucks)" value={sessionStats.trucksGotPassed} />
                <Text style={styles.historyTitle}>This round</Text>
                <HistoryList history={sessionStats.history} />
              </>
            ) : (
              <>
                <StatRow label="All-time high" value={allTimeStats.highScore} />
                <StatRow label="Games played" value={allTimeStats.gamesPlayed} />
                <StatRow label="Cars passed" value={allTimeStats.carsPassed} />
                <StatRow label="Got passed (cars)" value={allTimeStats.carsGotPassed} />
                <StatRow label="Trucks passed" value={allTimeStats.trucksPassed} />
                <StatRow label="Got passed (trucks)" value={allTimeStats.trucksGotPassed} />
                <Text style={styles.historyTitle}>Recent history</Text>
                <HistoryList history={allTimeStats.history} />
              </>
            )}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable style={styles.secondaryBtn} onPress={onResetScore}>
              <Text style={styles.secondaryText}>Reset Score</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={onClose}>
              <Text style={styles.primaryText}>Back to Game</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.scoreText,
  },
  subtitle: {
    marginTop: 2,
    color: colors.muted,
    fontWeight: '600',
  },
  toggle: {
    marginTop: spacing.md,
    flexDirection: 'row',
    backgroundColor: '#ECEFF1',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    borderRadius: 11,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: colors.brand,
  },
  toggleText: {
    fontWeight: '800',
    color: colors.muted,
  },
  toggleTextActive: {
    color: colors.white,
  },
  scroll: {
    marginTop: spacing.md,
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  statLabel: {
    fontWeight: '700',
    color: colors.muted,
  },
  statValue: {
    fontWeight: '900',
    color: colors.scoreText,
    fontSize: 16,
    fontFamily: fonts.mono,
    fontVariant: ['tabular-nums'],
  },
  historyTitle: {
    marginTop: spacing.md,
    marginBottom: 4,
    fontSize: 18,
    fontWeight: '900',
    color: colors.scoreText,
  },
  empty: {
    color: colors.muted,
    fontWeight: '600',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CFD8DC',
  },
  historyLeft: {
    fontWeight: '700',
    color: colors.black,
    textTransform: 'capitalize',
  },
  historyPoints: {
    fontWeight: '900',
    fontFamily: fonts.mono,
    fontVariant: ['tabular-nums'],
  },
  pos: {
    color: colors.greenDark,
  },
  neg: {
    color: colors.redDark,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: '#ECEFF1',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.scoreText,
    fontWeight: '800',
  },
});
