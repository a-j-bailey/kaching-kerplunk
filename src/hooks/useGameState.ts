import { useCallback, useEffect, useRef, useState } from 'react';

import { getPoints } from '../constants/points';
import {
  applyEventToStats,
  DEFAULT_STATS,
  loadGameStats,
  saveGameStats,
} from '../storage/gameStorage';
import type { GameStats, ScoreAction, ScoreEvent, VehicleType } from '../types';

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useGameState() {
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [ready, setReady] = useState(false);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const scoreRef = useRef(0);
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

    scoreRef.current = nextScore;

    const event: ScoreEvent = {
      id: createId(),
      vehicle,
      action,
      points,
      scoreAfter: nextScore,
      timestamp: Date.now(),
    };

    setScore(nextScore);
    setLastDelta(points);

    setStats((prevStats) => {
      let base = prevStats;
      if (!startedRef.current) {
        startedRef.current = true;
        base = { ...prevStats, gamesPlayed: prevStats.gamesPlayed + 1 };
      }
      const updated = applyEventToStats(base, event, nextScore);
      void saveGameStats(updated);
      return updated;
    });

    return points;
  }, []);

  const resetScore = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
    setLastDelta(null);
    startedRef.current = false;
  }, []);

  return {
    score,
    stats,
    ready,
    lastDelta,
    recordAction,
    resetScore,
  };
}
