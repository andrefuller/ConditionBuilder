import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AboutDialog from './AboutDialog';

describe('AboutDialog', () => {
  let onCloseMock: jest.Mock;

  beforeEach(() => {
    onCloseMock = jest.fn();
  });

  test('renders the correct text', () => {
    render(<AboutDialog open={true} onClose={onCloseMock} />);
    const element: HTMLElement = screen.getByText(/About: Condition Builder/i);
    expect(element).toBeInTheDocument();
  });

  test('calls onClose when dialog is closed', async () => {
    const user = userEvent.setup();

    render(<AboutDialog open={true} onClose={onCloseMock} />);

    const okButton: HTMLElement = screen.getByRole('button', { name: /Ok/i });
    await user.click(okButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
