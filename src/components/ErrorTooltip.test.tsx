import { render } from '@testing-library/react';
import ErrorTooltip from './ErrorTooltip';

describe('ErrorTooltip', () => {
  const renderErrorTooltip = () =>
    render(
      <ErrorTooltip title="Error occurred!" open={true} placement="top">
        <div>Content with Error Tooltip</div>
      </ErrorTooltip>,
    );

  test('renders without errors', () => {
    const { getByText } = renderErrorTooltip();
    const contentElement = getByText('Content with Error Tooltip');
    expect(contentElement).toBeInTheDocument();
  });
});
