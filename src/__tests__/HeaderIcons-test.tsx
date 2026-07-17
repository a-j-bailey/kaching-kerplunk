import { render } from '@testing-library/react-native';

import { RefreshIcon, StatsIcon } from '../components/HeaderIcons';

describe('HeaderIcons', () => {
  test('renders stats bars without crashing', async () => {
    const tree = await render(<StatsIcon size={26} color="#FFFFFF" />);
    expect(tree.toJSON()).toBeTruthy();
  });

  test('renders refresh glyph without crashing', async () => {
    const tree = await render(<RefreshIcon size={26} color="#FFFFFF" />);
    expect(tree.toJSON()).toBeTruthy();
  });
});
