import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DarkModeSwitch from './DarkModeSwitch';

test('DarkModeSwitch should toggle dark mode on click', async () => {
  render(<DarkModeSwitch />);

  const switchElement: HTMLElement = screen.getByRole('checkbox');
  // Check if the switch is initially unchecked (light mode)
  expect(switchElement).not.toBeChecked();

  // Click the switch to toggle it
  await userEvent.click(switchElement);

  // Check if the switch is now checked (dark mode)
  expect(switchElement).toBeChecked();

  // Click the switch again to toggle it back to light mode
  await userEvent.click(switchElement);

  // Check if the switch is now unchecked (light mode)
  expect(switchElement).not.toBeChecked();
});
