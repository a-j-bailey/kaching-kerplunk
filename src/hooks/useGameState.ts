import { useCallback, useEffect, useRef, useState } from 'react';

import { getPoints } from '../constants/points';
import {
  applyEventToStats,
  DEFAULT_STATS,
  loadGameStats,
  resetGameStats,
  saveGameStats,
} from '../storage/gameStorage';
import type { GameStats, ScoreAction, ScoreEvent, VehicleType } from '../types';

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useGameState() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [ready, setReady] = useState(false);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const startedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await loadGameStats();
      if (!cancelled) {
        setStats(loaded);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const recordAction = useCallback((vehicle: VehicleType, action: ScoreAction) => {
    const points = getPoints(vehicle, action);
    const nextScore = scoreRef.current + points;
    const nextStreak = action === 'pass' ? streakRef.current + 1 : 0;

    scoreRef.current = nextScore;
    streakRef.current = nextStreak;

    const event: ScoreEvent = {
      id: createId(),
      vehicle,
      action,
      points,
      scoreAfter: nextScore,
      timestamp: Date.now(),
    };

    setScore(nextScore);
    setStreak(nextStreak);
    setLastDelta(points);

    setStats((prevStats) => {
      let base = prevStats;
      if (!startedRef.current) {
        startedRef.current = true;
        base = { ...prevStats, gamesPlayed: prevStats.gamesPlayed + 1 };
      }
      const updated = applyEventToStats(base, event, nextScore, nextStreak);
      void saveGameStats(updated);
      return updated;
    });

    return points;
  }, []);

  const resetScore = useCallback(() => {
    scoreRef.current = 0;
    streakRef.current = 0;
    setScore(0);
    setStreak(0);
    setLastDelta(null);
    startedRef.current = false;
  }, []);

  const clearAllData = useCallback(async () => {
    const fresh = await resetGameStats();
    scoreRef.current = 0;
    streakRef.current = 0;
    setStats(fresh);
    setScore(0);
    setStreak(0);
    setLastDelta(null);
    startedRef.current = false;
  }, []);

  return {
    score,
    streak,
    stats,
    ready,
    lastDelta,
    recordAction,
    resetScore,
    clearAllData,
  };
}
