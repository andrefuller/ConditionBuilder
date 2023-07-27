import { render, screen } from '@testing-library/react';
import Chance from 'chance';
import { ConditionOperator } from '../enums/ConditionOperator';
import { ConditionType } from '../enums/ConditionType';
import { Condition } from '../types';
import ResultGrid from './ResultGrid';

const chance = new Chance();

describe('ResultGrid', () => {
  let mockTableColumnNames: Array<string>;
  let mockConditionsList: Array<Condition>;
  let mockTableData: Array<{ [key: string]: string }>;
  beforeEach(() => {
    mockTableColumnNames = ['Name', 'Age', 'Email'];
    mockTableData = [
      ...Array(2)
        .fill(0)
        .map(() => ({
          id: chance.guid(),
          Name: chance.name(),
          Age: chance.age().toString(),
          Email: chance.email(),
        })),
    ];

    mockConditionsList = [
      {
        guid: chance.guid(),
        isParent: true,
        leftCondition: 'Name',
        operator: ConditionOperator.CONTAIN,
        value: mockTableData[0].Name,
        type: ConditionType.AND,
      },
    ];
  });

  test('renders without errors', () => {
    render(
      <ResultGrid
        isLoading={false}
        tableColumnNames={mockTableColumnNames}
        tableData={mockTableData}
        conditionsList={mockConditionsList}
      />,
    );
    expect(screen.getByText('Result')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('displays correct total and filtered counts', () => {
    render(
      <ResultGrid
        isLoading={false}
        tableColumnNames={mockTableColumnNames}
        tableData={mockTableData}
        conditionsList={mockConditionsList}
      />,
    );
    expect(screen.getByTestId('total-chip')).toHaveTextContent('Total: 2');
    expect(screen.getByTestId('filtered-chip')).toHaveTextContent(
      'Filtered: 1',
    );
  });

  test('filters data correctly based on conditions', () => {
    render(
      <ResultGrid
        isLoading={false}
        tableColumnNames={mockTableColumnNames}
        tableData={mockTableData}
        conditionsList={mockConditionsList}
      />,
    );

    // Verify that only one row remains after filtering
    const gridRows = screen.getAllByRole('row');
    expect(gridRows.length).toBe(2); // Header row + one data row
  });
});
