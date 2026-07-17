import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { triggerScoreHaptics } from '../utils/haptics';

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

describe('triggerScoreHaptics', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => originalPlatform,
    });
    jest.clearAllMocks();
  });

  test('plays a medium impact for car passes', async () => {
    await triggerScoreHaptics('car', 'pass');
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Medium,
    );
  });

  test('plays success notification and heavy impact for truck passes on native', async () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => 'ios',
    });

    await triggerScoreHaptics('truck', 'pass');

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success,
    );
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Heavy,
    );
  });

  test('skips heavy impact for truck passes on web', async () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => 'web',
    });

    await triggerScoreHaptics('truck', 'pass');

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success,
    );
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  test('plays error notification when a truck passes you', async () => {
    await triggerScoreHaptics('truck', 'passed');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Error,
    );
  });

  test('swallows haptics failures', async () => {
    jest.mocked(Haptics.impactAsync).mockRejectedValueOnce(new Error('unavailable'));
    await expect(triggerScoreHaptics('car', 'pass')).resolves.toBeUndefined();
  });
});
