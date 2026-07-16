import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import type { ScoreAction, VehicleType } from '../types';

export async function triggerScoreHaptics(
  vehicle: VehicleType,
  action: ScoreAction,
): Promise<void> {
  try {
    if (action === 'pass') {
      switch (vehicle) {
        case 'truck':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          break;
        case 'motorcycle':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'car':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        default: {
          const _exhaustive: never = vehicle;
          return _exhaustive;
        }
      }
      return;
    }

    switch (vehicle) {
      case 'truck':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'motorcycle':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'car':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      default: {
        const _exhaustive: never = vehicle;
        return _exhaustive;
      }
    }
  } catch {
    // Haptics may be unavailable on some devices / browsers.
  }
}
