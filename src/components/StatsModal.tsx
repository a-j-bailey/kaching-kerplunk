import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { formatPoints } from '../constants/points';
import { colors, spacing } from '../constants/theme';
import type { GameStats } from '../types';

type StatsModalProps = {
  visible: boolean;
  stats: GameStats;
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

export function StatsModal({
  visible,
  stats,
  onClose,
  onResetScore,
}: StatsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Game Stats</Text>
          <Text style={styles.subtitle}>Saved on this device</Text>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <StatRow label="All-time high" value={stats.highScore} />
            <StatRow label="Best streak" value={stats.bestStreak} />
            <StatRow label="Games played" value={stats.gamesPlayed} />
            <StatRow label="Cars passed" value={stats.carsPassed} />
            <StatRow label="Got passed (cars)" value={stats.carsGotPassed} />
            <StatRow label="Trucks passed" value={stats.trucksPassed} />
            <StatRow label="Got passed (trucks)" value={stats.trucksGotPassed} />

            <Text style={styles.historyTitle}>Recent history</Text>
            {stats.history.length === 0 ? (
              <Text style={styles.empty}>No plays yet — hit those big buttons!</Text>
            ) : (
              stats.history.slice(0, 30).map((event) => (
                <View key={event.id} style={styles.historyRow}>
                  <Text style={styles.historyLeft}>
                    {event.vehicle === 'car' ? '🚗' : '🚛'}{' '}
                    {event.action === 'pass' ? 'passed' : 'got passed'}
                  </Text>
                  <Text
                    style={[
                      styles.historyPoints,
                      event.points >= 0 ? styles.pos : styles.neg,
                    ]}
                  >
                    {formatPoints(event.points)}
                  </Text>
                </View>
              ))
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
  },
  sheet: {
    maxHeight: '88%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
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
  scroll: {
    marginTop: spacing.md,
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
