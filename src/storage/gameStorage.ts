import AsyncStorage from '@react-native-async-storage/async-storage';

import type { GameStats, ScoreEvent } from '../types';

const STORAGE_KEY = '@kaching_kerplunk/game_stats_v1';
const MAX_HISTORY = 200;

export const DEFAULT_STATS: GameStats = {
  highScore: 0,
  totalPasses: 0,
  totalPassed: 0,
  carsPassed: 0,
  carsGotPassed: 0,
  trucksPassed: 0,
  trucksGotPassed: 0,
  gamesPlayed: 0,
  bestStreak: 0,
  history: [],
};

export async function loadGameStats(): Promise<GameStats> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_STATS };
    }
    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return {
      ...DEFAULT_STATS,
      ...parsed,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export async function saveGameStats(stats: GameStats): Promise<void> {
  const trimmed: GameStats = {
    ...stats,
    history: stats.history.slice(0, MAX_HISTORY),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function applyEventToStats(
  stats: GameStats,
  event: ScoreEvent,
  nextScore: number,
  nextStreak: number,
): GameStats {
  const next: GameStats = {
    ...stats,
    highScore: Math.max(stats.highScore, nextScore),
    bestStreak: Math.max(stats.bestStreak, nextStreak),
    history: [event, ...stats.history].slice(0, MAX_HISTORY),
  };

  if (event.action === 'pass') {
    next.totalPasses += 1;
    if (event.vehicle === 'car') {
      next.carsPassed += 1;
    } else {
      next.trucksPassed += 1;
    }
  } else {
    next.totalPassed += 1;
    if (event.vehicle === 'car') {
      next.carsGotPassed += 1;
    } else {
      next.trucksGotPassed += 1;
    }
  }

  return next;
}
