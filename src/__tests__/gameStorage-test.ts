import AsyncStorage from '@react-native-async-storage/async-storage';

import type { GameStats, ScoreEvent } from '../types';
import {
  applyEventToSession,
  applyEventToStats,
  DEFAULT_STATS,
  EMPTY_SESSION_STATS,
  loadGameStats,
  saveGameStats,
} from '../storage/gameStorage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const STORAGE_KEY = '@kaching_kerplunk/game_stats_v1';

function makeEvent(overrides: Partial<ScoreEvent> = {}): ScoreEvent {
  return {
    id: 'evt-1',
    vehicle: 'car',
    action: 'pass',
    points: 10,
    scoreAfter: 10,
    timestamp: 1_700_000_000_000,
    ...overrides,
  };
}

describe('applyEventToStats', () => {
  test('updates high score, totals, vehicle counts, and history', () => {
    const next = applyEventToStats(DEFAULT_STATS, makeEvent(), 10);

    expect(next.highScore).toBe(10);
    expect(next.totalPasses).toBe(1);
    expect(next.totalPassed).toBe(0);
    expect(next.carsPassed).toBe(1);
    expect(next.history).toHaveLength(1);
    expect(next.history[0]?.id).toBe('evt-1');
  });

  test('does not lower an existing high score', () => {
    const withHigh: GameStats = { ...DEFAULT_STATS, highScore: 250 };
    const next = applyEventToStats(withHigh, makeEvent({ scoreAfter: 10 }), 10);
    expect(next.highScore).toBe(250);
  });

  test('counts got-passed events on the correct vehicle buckets', () => {
    const next = applyEventToStats(
      DEFAULT_STATS,
      makeEvent({ vehicle: 'truck', action: 'passed', points: -100, scoreAfter: -100 }),
      -100,
    );

    expect(next.totalPassed).toBe(1);
    expect(next.totalPasses).toBe(0);
    expect(next.trucksGotPassed).toBe(1);
    expect(next.trucksPassed).toBe(0);
  });

  test('increments motorcycle pass counts', () => {
    const next = applyEventToStats(
      DEFAULT_STATS,
      makeEvent({ vehicle: 'motorcycle', action: 'pass', points: 20, scoreAfter: 20 }),
      20,
    );
    expect(next.motorcyclesPassed).toBe(1);
  });
});

describe('applyEventToSession', () => {
  test('tracks peak score and prepends history without all-time totals', () => {
    const first = applyEventToSession(EMPTY_SESSION_STATS, makeEvent(), 10);
    const second = applyEventToSession(
      first,
      makeEvent({ id: 'evt-2', action: 'passed', points: -10, scoreAfter: 0 }),
      0,
    );

    expect(second.peakScore).toBe(10);
    expect(second.carsPassed).toBe(1);
    expect(second.carsGotPassed).toBe(1);
    expect(second.history.map((event) => event.id)).toEqual(['evt-2', 'evt-1']);
  });
});

describe('loadGameStats / saveGameStats', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('returns defaults when nothing is stored', async () => {
    await expect(loadGameStats()).resolves.toEqual(DEFAULT_STATS);
  });

  test('round-trips saved stats', async () => {
    const stats: GameStats = {
      ...DEFAULT_STATS,
      highScore: 120,
      carsPassed: 3,
      gamesPlayed: 2,
      history: [makeEvent()],
    };

    await saveGameStats(stats);
    await expect(loadGameStats()).resolves.toEqual(stats);
  });

  test('fills missing fields from defaults', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ highScore: 55, carsPassed: 4 }),
    );

    const loaded = await loadGameStats();
    expect(loaded.highScore).toBe(55);
    expect(loaded.carsPassed).toBe(4);
    expect(loaded.trucksPassed).toBe(0);
    expect(loaded.history).toEqual([]);
  });

  test('returns defaults when stored JSON is invalid', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, '{not-json');
    await expect(loadGameStats()).resolves.toEqual(DEFAULT_STATS);
  });

  test('trims history to 200 events on save', async () => {
    const history = Array.from({ length: 250 }, (_, index) =>
      makeEvent({ id: `evt-${index}` }),
    );

    await saveGameStats({ ...DEFAULT_STATS, history });
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw!) as GameStats;
    expect(parsed.history).toHaveLength(200);
    expect(parsed.history[0]?.id).toBe('evt-0');
  });
});
