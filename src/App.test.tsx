import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('displays correct header text', () => {
    render(<App />);
    const headerElement = screen.getByText('Condition Builder');
    expect(headerElement).toBeInTheDocument();
  });

  it('toggles dark mode when switch is clicked', async () => {
    render(<App />);

    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).not.toBeChecked();

    await userEvent.click(switchElement);
    expect(switchElement).toBeChecked();
  });
});
