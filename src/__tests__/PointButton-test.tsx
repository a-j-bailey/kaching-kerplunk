import { fireEvent, render } from '@testing-library/react-native';

import { PointButton } from '../components/PointButton';

describe('<PointButton />', () => {
  test('renders title, emoji, and points for a car pass', async () => {
    const { getByText } = await render(
      <PointButton vehicle="car" action="pass" onPress={jest.fn()} />,
    );

    expect(getByText('PASS CAR')).toBeTruthy();
    expect(getByText('🚗')).toBeTruthy();
    expect(getByText('+10')).toBeTruthy();
  });

  test('renders truck passed copy without truncating the label', async () => {
    const { getByText } = await render(
      <PointButton vehicle="truck" action="passed" onPress={jest.fn()} />,
    );

    expect(getByText('TRUCK PASSED')).toBeTruthy();
    expect(getByText('-100')).toBeTruthy();
  });

  test('uses the same stacked layout for motorcycle buttons', async () => {
    const { getByText } = await render(
      <PointButton vehicle="motorcycle" action="pass" onPress={jest.fn()} />,
    );

    expect(getByText('PASS BIKE')).toBeTruthy();
    expect(getByText('🏍️')).toBeTruthy();
    expect(getByText('+20')).toBeTruthy();
  });

  test('invokes onPress with the vehicle and action', async () => {
    const onPress = jest.fn();
    const { getByLabelText } = await render(
      <PointButton vehicle="truck" action="pass" onPress={onPress} />,
    );

    fireEvent.press(getByLabelText('PASS TRUCK +100'));
    expect(onPress).toHaveBeenCalledWith('truck', 'pass');
  });
});
