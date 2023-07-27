import { Condition, ValidationResult } from './types';

export const isNumber = (str: string): boolean => {
  return !isNaN(Number(str));
};

export const isValidUrl = (str: string): boolean => {
  const urlRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{3,}(\/\S*)?$/;
  return urlRegex.test(str);
};

export const isValidRegex = (str: string): boolean => {
  try {
    new RegExp(str);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateInput = ({
  field,
  value,
  validationFunc,
  errorMessage,
  allowEmpty = true,
}: {
  field: string;
  value: string;
  validationFunc: { (str: string): boolean };
  errorMessage: string;
  allowEmpty?: boolean;
}): ValidationResult => {
  const isInputValid: boolean =
    (allowEmpty && value === '') || validationFunc(value);
  return {
    ...(!isInputValid && {
      errors: {
        [field]: {
          message: errorMessage,
        },
      },
    }),
    isValid: isInputValid,
  };
};

export const getConditionIndex = (
  conditionsList: Array<Condition>,
  guid: string,
): number => {
  return conditionsList.findIndex(
    (condition: Condition) => condition.guid === guid,
  );
};
