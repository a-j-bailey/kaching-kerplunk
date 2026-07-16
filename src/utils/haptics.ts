import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import type { ScoreAction, VehicleType } from '../types';

export async function triggerScoreHaptics(
  vehicle: VehicleType,
  action: ScoreAction,
): Promise<void> {
  try {
    if (action === 'pass') {
      if (vehicle === 'truck') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (Platform.OS !== 'web') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      return;
    }

    if (vehicle === 'truck') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  } catch {
    // Haptics may be unavailable on some devices / browsers.
  }
}
