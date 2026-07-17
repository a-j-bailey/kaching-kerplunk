import { Alert, Platform } from 'react-native';

import { showAlert } from '../utils/alert';

describe('showAlert', () => {
  const originalPlatform = Platform.OS;
  const originalAlert = globalThis.alert;
  const originalConfirm = globalThis.confirm;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => originalPlatform,
    });
    globalThis.alert = originalAlert;
    globalThis.confirm = originalConfirm;
    jest.restoreAllMocks();
  });

  test('uses React Native Alert on native platforms', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => 'ios',
    });
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const onPress = jest.fn();

    showAlert('Title', 'Message', [{ text: 'OK', onPress }]);

    expect(alertSpy).toHaveBeenCalledWith('Title', 'Message', [
      { text: 'OK', onPress },
    ]);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('uses window.alert for single-button prompts on web', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => 'web',
    });
    const alertMock = jest.fn();
    globalThis.alert = alertMock;
    const onPress = jest.fn();

    showAlert('Heads up', 'All good', [{ text: 'OK', onPress }]);

    expect(alertMock).toHaveBeenCalledWith('Heads up\n\nAll good');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('uses window.confirm and runs destructive action when accepted', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => 'web',
    });
    globalThis.confirm = jest.fn(() => true);
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    showAlert('Start a new round?', 'Reset score?', [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { text: 'New Round', style: 'destructive', onPress: onConfirm },
    ]);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  test('runs cancel action when window.confirm is dismissed', () => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => 'web',
    });
    globalThis.confirm = jest.fn(() => false);
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    showAlert('Start a new round?', 'Reset score?', [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { text: 'New Round', style: 'destructive', onPress: onConfirm },
    ]);

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
