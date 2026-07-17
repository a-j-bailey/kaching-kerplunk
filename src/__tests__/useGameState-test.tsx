import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useGameState } from '../hooks/useGameState';
import { DEFAULT_STATS } from '../storage/gameStorage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('useGameState', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem(
      '@kaching_kerplunk/game_stats_v1',
      JSON.stringify({ ...DEFAULT_STATS, highScore: 40 }),
    );
  });

  test('loads persisted stats and becomes ready', async () => {
    const { result } = await renderHook(() => useGameState());

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });
    expect(result.current.stats.highScore).toBe(40);
    expect(result.current.score).toBe(0);
  });

  test('recordAction updates score, session stats, and persists all-time stats', async () => {
    const { result } = await renderHook(() => useGameState());
    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    let points = 0;
    await act(async () => {
      points = result.current.recordAction('truck', 'pass');
    });

    expect(points).toBe(100);
    expect(result.current.score).toBe(100);
    expect(result.current.lastDelta).toBe(100);
    expect(result.current.sessionStats.trucksPassed).toBe(1);
    expect(result.current.sessionStats.peakScore).toBe(100);
    expect(result.current.stats.highScore).toBe(100);
    expect(result.current.stats.gamesPlayed).toBe(1);

    await waitFor(async () => {
      const raw = await AsyncStorage.getItem('@kaching_kerplunk/game_stats_v1');
      expect(raw).toContain('"highScore":100');
    });
  });

  test('resetScore clears the round but keeps all-time stats', async () => {
    const { result } = await renderHook(() => useGameState());
    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    await act(async () => {
      result.current.recordAction('car', 'pass');
      result.current.recordAction('car', 'pass');
    });

    expect(result.current.score).toBe(20);

    await act(async () => {
      result.current.resetScore();
    });

    expect(result.current.score).toBe(0);
    expect(result.current.lastDelta).toBeNull();
    expect(result.current.sessionStats.carsPassed).toBe(0);
    expect(result.current.stats.carsPassed).toBe(2);
    expect(result.current.stats.highScore).toBe(40);
  });

  test('only increments gamesPlayed once per round', async () => {
    const { result } = await renderHook(() => useGameState());
    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    await act(async () => {
      result.current.recordAction('car', 'pass');
      result.current.recordAction('motorcycle', 'pass');
    });

    expect(result.current.stats.gamesPlayed).toBe(1);

    await act(async () => {
      result.current.resetScore();
      result.current.recordAction('car', 'pass');
    });

    expect(result.current.stats.gamesPlayed).toBe(2);
  });
});
