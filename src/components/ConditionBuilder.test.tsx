import { grey } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import Chance from 'chance';
import { ConditionOperator } from '../enums/ConditionOperator';
import { ConditionType } from '../enums/ConditionType';
import { Condition } from '../types';
import ConditionBuilder from './ConditionBuilder';

const chance = new Chance();

const testTheme = createTheme({
  // Add any necessary overrides or modifications here
  palette: {
    neutral: {
      main: grey[100],
      light: grey[300],
      dark: grey.A700,
    },
  },
});

describe('ConditionBuilder', () => {
  let addConditionMock: jest.Mock;
  let deleteConditionMock: jest.Mock;
  let updateConditionMock: jest.Mock;

  let person: { name: string; age: string; email: string };
  let mockTableColumnNames: Array<string>;
  let mockConditionsList: Array<Condition>;

  beforeEach(() => {
    addConditionMock = jest.fn();
    deleteConditionMock = jest.fn();
    updateConditionMock = jest.fn();

    person = {
      name: chance.name(),
      age: chance.age().toString(),
      email: chance.email(),
    };
    mockTableColumnNames = ['Name', 'Age', 'Email'];
    mockConditionsList = [
      {
        guid: chance.guid(),
        isParent: true,
        leftCondition: mockTableColumnNames[0],
        operator: ConditionOperator.CONTAIN,
        value: person.name,
        type: ConditionType.OR,
      },
      {
        guid: chance.guid(),
        isParent: false,
        leftCondition: mockTableColumnNames[1],
        operator: ConditionOperator.NOT_CONTAIN,
        value: person.age,
        type: ConditionType.OR,
      },
      {
        guid: chance.guid(),
        isParent: true,
        leftCondition: mockTableColumnNames[2],
        operator: ConditionOperator.EQUALS,
        value: person.email,
        type: ConditionType.AND,
      },
    ];
  });

  test('renders without errors', () => {
    render(
      <ThemeProvider theme={testTheme}>
        <ConditionBuilder
          isLoading={false}
          tableColumnNames={mockTableColumnNames}
          conditionsList={mockConditionsList}
          addCondition={addConditionMock}
          deleteCondition={deleteConditionMock}
          updateCondition={updateConditionMock}
        />
      </ThemeProvider>,
    );

    const andDivider: HTMLElement = screen.getByTestId('and-divider');
    expect(andDivider).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  test('AND button is enabled when conditionsList is not empty', () => {
    render(
      <ThemeProvider theme={testTheme}>
        <ConditionBuilder
          isLoading={false}
          tableColumnNames={mockTableColumnNames}
          conditionsList={mockConditionsList}
          addCondition={addConditionMock}
          deleteCondition={deleteConditionMock}
          updateCondition={updateConditionMock}
        />
      </ThemeProvider>,
    );
    const andButton = screen.getByRole('button', { name: 'AND' });
    expect(andButton).not.toBeDisabled();
  });

  test('handleAddConditon function is called when clicking the AND button', () => {
    render(
      <ThemeProvider theme={testTheme}>
        <ConditionBuilder
          isLoading={false}
          tableColumnNames={mockTableColumnNames}
          conditionsList={mockConditionsList}
          addCondition={addConditionMock}
          deleteCondition={deleteConditionMock}
          updateCondition={updateConditionMock}
        />
      </ThemeProvider>,
    );
    const andButton = screen.getByRole('button', { name: 'AND' });
    fireEvent.click(andButton);
    expect(addConditionMock).toHaveBeenCalledTimes(1);
  });
});
