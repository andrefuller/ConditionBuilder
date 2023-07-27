import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from './SearchInput';

describe('SearchInput', () => {
  const defaultUrl = 'https://data.nasa.gov/resource/y77d-th95.json';
  let updateSearchUrlMock: jest.Mock;

  beforeEach(() => {
    updateSearchUrlMock = jest.fn();
  });

  test('should update search URL on change', () => {
    render(
      <SearchInput isLoading={false} updateSearchURL={updateSearchUrlMock} />,
    );

    const input: HTMLInputElement = screen.getByTestId('search-input-text');

    fireEvent.change(input, {
      target: { value: defaultUrl },
    });

    expect(input.value).toBe(defaultUrl);
  });

  test('should trigger updateSearchURL when onBlur and URL is valid', () => {
    render(
      <SearchInput isLoading={false} updateSearchURL={updateSearchUrlMock} />,
    );

    const input: HTMLInputElement = screen.getByTestId('search-input-text');

    fireEvent.change(input, {
      target: { value: defaultUrl },
    });
    fireEvent.blur(input);

    expect(updateSearchUrlMock).toHaveBeenCalledTimes(1);
    expect(updateSearchUrlMock).toHaveBeenCalledWith(defaultUrl);
  });

  test('should not trigger updateSearchURL when onBlur and URL is invalid', () => {
    render(
      <SearchInput isLoading={false} updateSearchURL={updateSearchUrlMock} />,
    );

    const input: HTMLInputElement = screen.getByTestId('search-input-text');

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.blur(input);

    expect(updateSearchUrlMock).not.toHaveBeenCalled();
  });

  test('should show error tooltip when URL is invalid', async () => {
    const user = userEvent.setup();
    render(
      <SearchInput isLoading={false} updateSearchURL={updateSearchUrlMock} />,
    );

    const input: HTMLInputElement = screen.getByTestId('search-input-text');

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.blur(input);

    await user.click(input);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent(
        'Invalid URL. Please enter a valid URL, including http:// or https://',
      );
    });
  });

  test('should not show error tooltip when URL is valid', () => {
    render(
      <SearchInput isLoading={false} updateSearchURL={updateSearchUrlMock} />,
    );

    const input: HTMLInputElement = screen.getByTestId('search-input-text');

    fireEvent.change(input, {
      target: { value: defaultUrl },
    });
    fireEvent.blur(input);

    const tooltip = screen.queryByRole('tooltip');
    expect(tooltip).not.toBeInTheDocument();
  });

  test('should show helper text', () => {
    render(
      <SearchInput isLoading={false} updateSearchURL={updateSearchUrlMock} />,
    );

    const helperText = screen.getByText(
      'Insert data url. Returning data MUST be an array json where each element is a key/value pair.',
    );
    expect(helperText).toBeInTheDocument();
  });
});
