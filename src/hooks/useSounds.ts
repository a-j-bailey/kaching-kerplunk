import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';

import type { ScoreAction, VehicleType } from '../types';

const soundSources = {
  carPass: require('../../assets/sounds/kaching.wav'),
  carPassed: require('../../assets/sounds/kerplunk.wav'),
  truckPass: require('../../assets/sounds/truck-kaching.wav'),
  truckPassed: require('../../assets/sounds/truck-kerplunk.wav'),
} as const;

type SoundKey = keyof typeof soundSources;

function getSoundKey(vehicle: VehicleType, action: ScoreAction): SoundKey {
  if (vehicle === 'car' && action === 'pass') return 'carPass';
  if (vehicle === 'car' && action === 'passed') return 'carPassed';
  if (vehicle === 'truck' && action === 'pass') return 'truckPass';
  return 'truckPassed';
}

export function useSounds() {
  const playersRef = useRef<Partial<Record<SoundKey, AudioPlayer>>>({});
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: 'mixWithOthers',
        });
      } catch {
        // Web / unsupported platforms may ignore audio mode.
      }

      if (cancelled) return;

      const players: Partial<Record<SoundKey, AudioPlayer>> = {};
      (Object.keys(soundSources) as SoundKey[]).forEach((key) => {
        try {
          players[key] = createAudioPlayer(soundSources[key]);
        } catch {
          // Ignore individual sound load failures.
        }
      });
      playersRef.current = players;
      readyRef.current = true;
    })();

    return () => {
      cancelled = true;
      Object.values(playersRef.current).forEach((player) => {
        try {
          player?.release();
        } catch {
          // no-op
        }
      });
      playersRef.current = {};
      readyRef.current = false;
    };
  }, []);

  const playActionSound = useCallback((vehicle: VehicleType, action: ScoreAction) => {
    if (!readyRef.current) return;
    const key = getSoundKey(vehicle, action);
    const player = playersRef.current[key];
    if (!player) return;
    try {
      player.seekTo(0);
      player.play();
    } catch {
      // Sound playback is best-effort.
    }
  }, []);

  return { playActionSound };
}
