import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Chance from 'chance';
import { ConditionOperator } from '../enums/ConditionOperator';
import { ConditionType } from '../enums/ConditionType';
import { Condition } from '../types';
import ConditionBuilderRow from './ConditionBuilderRow';

const chance = new Chance();

describe('ConditionBuilderRow', () => {
  let addConditionMock: jest.Mock;
  let deleteConditionMock: jest.Mock;
  let updateConditionMock: jest.Mock;

  let person: { name: string; age: string; email: string };
  let mockAvailableColumns: Array<{ label: string; value: string }>;
  let mockCondition: Condition;
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

    mockAvailableColumns = [
      { label: 'Name', value: 'name' },
      { label: 'Age', value: 'age' },
      { label: 'Email', value: 'email' },
    ];

    mockCondition = {
      guid: chance.guid(),
      isParent: false,
      leftCondition: mockAvailableColumns[0].value,
      operator: ConditionOperator.EQUALS,
      value: person.name,
      type: ConditionType.AND,
    };

    mockConditionsList = [mockCondition];
  });

  test('renders without errors', () => {
    render(
      <ConditionBuilderRow
        isLoading={false}
        availableColumns={mockAvailableColumns}
        condition={mockCondition}
        conditionsList={mockConditionsList}
        addCondition={addConditionMock}
        deleteCondition={deleteConditionMock}
        updateCondition={updateConditionMock}
      />,
    );

    expect(screen.getByLabelText('Left Condition')).toBeInTheDocument();
    expect(screen.getByLabelText('Operator')).toBeInTheDocument();
    expect(screen.getByLabelText('Value')).toBeInTheDocument();
    expect(screen.getByLabelText('add')).toBeInTheDocument();
  });

  test('left condition, operator, and value fields render correctly when not loading', async () => {
    render(
      <ConditionBuilderRow
        isLoading={false}
        availableColumns={mockAvailableColumns}
        condition={mockCondition}
        conditionsList={mockConditionsList}
        addCondition={addConditionMock}
        deleteCondition={deleteConditionMock}
        updateCondition={updateConditionMock}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`select-left-condition-${mockCondition.guid!}`),
      ).toHaveValue('name');
    });
    await waitFor(() => {
      expect(
        screen.getByTestId(`select-operator-${mockCondition.guid!}`),
      ).toHaveValue(ConditionOperator.EQUALS);
    });
    await waitFor(() => {
      expect(
        screen.getByTestId(`select-value-${mockCondition.guid!}`),
      ).toHaveValue(person.name);
    });
  });

  test('add and delete buttons render correctly when not loading', () => {
    mockConditionsList = [mockCondition, mockCondition];

    render(
      <ConditionBuilderRow
        isLoading={false}
        availableColumns={mockAvailableColumns}
        condition={mockCondition}
        conditionsList={mockConditionsList}
        addCondition={addConditionMock}
        deleteCondition={deleteConditionMock}
        updateCondition={updateConditionMock}
      />,
    );

    expect(screen.getByLabelText('add')).toBeEnabled();
    expect(screen.getByLabelText('delete')).toBeEnabled();
  });

  test('add button calls the addCondition function when clicked', () => {
    render(
      <ConditionBuilderRow
        isLoading={false}
        availableColumns={mockAvailableColumns}
        condition={mockCondition}
        conditionsList={mockConditionsList}
        addCondition={addConditionMock}
        deleteCondition={deleteConditionMock}
        updateCondition={updateConditionMock}
      />,
    );

    const addButton = screen.getByLabelText('add');
    fireEvent.click(addButton);

    expect(addConditionMock).toHaveBeenCalledTimes(1);
  });

  test('delete button calls the deleteCondition function when clicked', () => {
    mockConditionsList = [mockCondition, mockCondition];
    render(
      <ConditionBuilderRow
        isLoading={false}
        availableColumns={mockAvailableColumns}
        condition={mockCondition}
        conditionsList={mockConditionsList}
        addCondition={addConditionMock}
        deleteCondition={deleteConditionMock}
        updateCondition={updateConditionMock}
      />,
    );

    const deleteButton = screen.getByLabelText('delete');
    fireEvent.click(deleteButton);

    expect(deleteConditionMock).toHaveBeenCalledTimes(1);
  });

  test('validation message is shown for invalid value input', async () => {
    render(
      <ConditionBuilderRow
        isLoading={false}
        availableColumns={mockAvailableColumns}
        condition={{
          ...mockCondition,
          operator: ConditionOperator.GREATER_THAN,
          value: 'abc',
        }}
        conditionsList={mockConditionsList}
        addCondition={addConditionMock}
        deleteCondition={deleteConditionMock}
        updateCondition={updateConditionMock}
      />,
    );

    const valueInput = screen.getByLabelText('Value');
    expect(valueInput).toHaveValue('abc');

    // Value input should have an error tooltip with the validation message
    fireEvent.mouseEnter(valueInput);

    await waitFor(() => {
      const validationMessage = screen.getByText(
        'Input must be a number when using comparison operators (i.e. < or >).',
      );
      expect(validationMessage).toBeInTheDocument();
    });
  });
});
