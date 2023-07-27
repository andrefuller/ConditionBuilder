import { ConditionOperator } from './enums/ConditionOperator';
import { ConditionType } from './enums/ConditionType';
import { Condition } from './types';
import {
  getConditionIndex,
  isNumber,
  isValidUrl,
  validateInput,
} from './utils';

describe('isNumber', () => {
  it('should return true for valid numbers', () => {
    expect(isNumber('123')).toBe(true);
    expect(isNumber('-456')).toBe(true);
    expect(isNumber('0')).toBe(true);
    expect(isNumber('3.14')).toBe(true);
  });

  it('should return false for invalid numbers', () => {
    expect(isNumber('abc')).toBe(false);
    expect(isNumber('12abc')).toBe(false);
    expect(isNumber('123,456')).toBe(false);
  });
});

describe('isValidUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
    expect(isValidUrl('https://www.example.com')).toBe(true);
    expect(isValidUrl('www.example.com')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isValidUrl('thisshouldnotmatch')).toBe(false);
    expect(isValidUrl('htt://example.com')).toBe(false);
    expect(isValidUrl('http//example.com')).toBe(false);
  });
});

describe('validateInput', () => {
  const mockValidationFunc = (str: string) => str === 'valid';
  const errorMessage = 'Input must be "valid"';

  it('should return valid result for allowed empty value', () => {
    const result = validateInput({
      field: 'testField',
      value: '',
      validationFunc: mockValidationFunc,
      errorMessage,
      allowEmpty: true,
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should return invalid result for disallowed empty value', () => {
    const result = validateInput({
      field: 'testField',
      value: '',
      validationFunc: mockValidationFunc,
      errorMessage,
      allowEmpty: false,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      testField: {
        message: errorMessage,
      },
    });
  });

  it('should return valid result for valid input', () => {
    const result = validateInput({
      field: 'testField',
      value: 'valid',
      validationFunc: mockValidationFunc,
      errorMessage,
      allowEmpty: true,
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should return invalid result for invalid input', () => {
    const result = validateInput({
      field: 'testField',
      value: 'invalid',
      validationFunc: mockValidationFunc,
      errorMessage,
      allowEmpty: true,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      testField: {
        message: errorMessage,
      },
    });
  });
});

describe('getConditionIndex', () => {
  const condition1: Condition = {
    guid: '123',
    isParent: true,
    type: ConditionType.OR,
    operator: ConditionOperator.CONTAIN,
    value: 'Condition 1',
  };
  const condition2: Condition = {
    guid: '456',
    isParent: false,
    type: ConditionType.OR,
    operator: ConditionOperator.EQUALS,
    value: 'Condition 2',
  };
  const condition3: Condition = {
    guid: '789',
    isParent: true,
    type: ConditionType.AND,
    operator: ConditionOperator.GREATER_THAN,
    value: '3',
  };

  const conditionsList: Array<Condition> = [condition1, condition2, condition3];

  it('should return the correct index when condition is present', () => {
    expect(getConditionIndex(conditionsList, '123')).toEqual(0);
    expect(getConditionIndex(conditionsList, '456')).toEqual(1);
    expect(getConditionIndex(conditionsList, '789')).toEqual(2);
  });

  it('should return -1 when condition is not present', () => {
    expect(getConditionIndex(conditionsList, '999')).toEqual(-1);
  });

  it('should handle empty conditionsList', () => {
    expect(getConditionIndex([], '123')).toEqual(-1);
  });

  it('should handle conditionsList with one condition', () => {
    const singleConditionList = [condition1];
    expect(getConditionIndex(singleConditionList, '123')).toEqual(0);
    expect(getConditionIndex(singleConditionList, '999')).toEqual(-1);
  });
});
