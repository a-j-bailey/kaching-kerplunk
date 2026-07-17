import { Alert, Platform } from 'react-native';

type AlertButton = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

/**
 * Cross-platform alert. React Native's Alert is a no-op on web, so we
 * fall back to window.confirm / window.alert there.
 */
export function showAlert(
  title: string,
  message?: string,
  buttons: AlertButton[] = [{ text: 'OK' }],
): void {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons);
    return;
  }

  const body = [title, message].filter(Boolean).join('\n\n');
  const cancelButton = buttons.find((button) => button.style === 'cancel');
  const confirmButton =
    buttons.find((button) => button.style === 'destructive') ??
    buttons.find((button) => button.style !== 'cancel') ??
    buttons[0];

  if (!cancelButton || buttons.length < 2) {
    window.alert(body);
    confirmButton?.onPress?.();
    return;
  }

  if (window.confirm(body)) {
    confirmButton?.onPress?.();
  } else {
    cancelButton.onPress?.();
  }
}
