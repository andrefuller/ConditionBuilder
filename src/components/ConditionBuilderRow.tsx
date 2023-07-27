import { useEffect, useMemo, useState } from 'react';

import { Add, Delete } from '@mui/icons-material';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ConditionOperator } from '../enums/ConditionOperator';
import { ConditionType } from '../enums/ConditionType';
import {
  Condition,
  ConditionBuilderRowProps,
  ConditionOption,
  ValidationResult,
} from '../types';
import { isNumber, isValidRegex } from '../utils';
import ErrorTooltip from './ErrorTooltip';

const operations: Array<ConditionOption> = [
  {
    label: 'Equals',
    value: ConditionOperator.EQUALS,
  },
  {
    label: 'Greater Than',
    value: ConditionOperator.GREATER_THAN,
  },
  {
    label: 'Less Than',
    value: ConditionOperator.LESS_THAN,
  },
  {
    label: 'Contain',
    value: ConditionOperator.CONTAIN,
  },
  {
    label: 'Not Contain',
    value: ConditionOperator.NOT_CONTAIN,
  },
  {
    label: 'Regex',
    value: ConditionOperator.REGEX,
  },
];

const validateInput = (conditionToValidate: Condition): ValidationResult => {
  let isInputValid = true;
  switch (conditionToValidate?.operator) {
    case ConditionOperator.GREATER_THAN:
    case ConditionOperator.LESS_THAN:
      isInputValid = isNumber(conditionToValidate.value);
      return {
        ...(!isInputValid && {
          errors: {
            value: {
              message:
                'Input must be a number when using comparison operators (i.e. < or >).',
            },
          },
        }),
        isValid: isInputValid,
      };
    case ConditionOperator.REGEX:
      isInputValid = isValidRegex(conditionToValidate.value);
      return {
        ...(!isInputValid && {
          errors: {
            value: {
              message: 'Invalid regular expression.',
            },
          },
        }),
        isValid: isInputValid,
      };
    default:
      return { isValid: isInputValid }; // Ignore other operations
  }
};

const ConditionBuilderRow = ({
  isLoading,
  availableColumns,
  condition,
  conditionsList,
  addCondition,
  deleteCondition,
  updateCondition,
}: ConditionBuilderRowProps): React.ReactNode => {
  const [showAddFeedback, setShowAddFeedback] = useState<boolean>(false);
  const [validations, setValidations] = useState<ValidationResult>({
    isValid: true,
  });

  const canShowOr: boolean = useMemo((): boolean => {
    return !condition?.isParent && condition?.type === ConditionType.OR;
  }, [condition]);

  const canDelete: boolean = useMemo((): boolean => {
    return conditionsList?.length > 1;
  }, [conditionsList]);

  useEffect(() => {
    setValidations(validateInput(condition!));
  }, [condition]);

  const handleAddConditon = () => {
    addCondition(condition, ConditionType.OR, false);
    setShowAddFeedback(false);
  };

  const handleDeleteCondition = () => {
    deleteCondition(condition?.guid as string);
  };

  const handleUpdateLeftCondition = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { value },
    } = event;

    const updatedCondition: Condition = {
      ...condition,
      leftCondition: value,
    } as Condition;
    updateCondition(condition?.guid as string, updatedCondition);
  };

  const handleUpdateOperator = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;

    const updatedCondition: Condition = {
      ...condition,
      operator: value,
    } as Condition;
    updateCondition(condition?.guid as string, updatedCondition);
  };

  const handleUpdateValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;

    const updatedCondition: Condition = { ...condition, value } as Condition;

    const validationResult: ValidationResult = validateInput(updatedCondition);
    setValidations(validationResult);

    if (validationResult.isValid) {
      updateCondition(condition?.guid as string, updatedCondition);
    }
  };

  const handleMouseEnter = () => {
    setShowAddFeedback(true);
  };

  const handleMouseLeave = () => {
    setShowAddFeedback(false);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems="center"
        style={{ display: 'flex' }}
      >
        {canShowOr && (
          <Grid item>
            <Typography
              color="primary"
              variant="h6"
              component="h6"
              sx={{ fontWeight: 'bold' }}
            >
              OR
            </Typography>
          </Grid>
        )}

        {/* Left Condition */}
        <Grid item xs={8} style={{ flex: '1 1 auto' }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={55} />
          ) : (
            <TextField
              id={`select-left-condition-${condition?.guid || ''}`}
              inputProps={{
                'data-testid': `select-left-condition-${condition?.guid || ''}`,
              }}
              select
              value={condition?.leftCondition}
              label="Left Condition"
              fullWidth
              disabled={isLoading}
              onChange={handleUpdateLeftCondition}
            >
              {availableColumns.map((option: ConditionOption) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>

        {/* Operator */}
        <Grid item xs={8} style={{ flex: '1 1 auto' }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={55} />
          ) : (
            <TextField
              id={`select-operator-${condition?.guid || ''}`}
              inputProps={{
                'data-testid': `select-operator-${condition?.guid || ''}`,
              }}
              select
              value={condition?.operator}
              label="Operator"
              fullWidth
              disabled={isLoading}
              onChange={handleUpdateOperator}
            >
              {operations.map((option: ConditionOption) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>

        {/* Value */}
        <Grid item xs={8} style={{ flex: '1 1 auto' }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={55} />
          ) : (
            <ErrorTooltip
              disableFocusListener
              followCursor
              title={
                !validations.isValid ? validations.errors!.value.message : ''
              }
            >
              <TextField
                id={`select-value-${condition?.guid || ''}`}
                inputProps={{
                  'data-testid': `select-value-${condition?.guid || ''}`,
                }}
                label="Value"
                error={!validations.isValid}
                defaultValue={condition?.value}
                fullWidth
                onChange={handleUpdateValue}
              />
            </ErrorTooltip>
          )}
        </Grid>

        {/* Add Icon */}
        <Grid item>
          {isLoading ? (
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
          ) : (
            <IconButton
              aria-label="add"
              onClick={handleAddConditon}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Add color="primary" />
            </IconButton>
          )}
        </Grid>

        {/* Delete Icon */}
        {canDelete && (
          <Grid item>
            {isLoading ? (
              <Skeleton variant="circular" width={40} height={40}></Skeleton>
            ) : (
              <IconButton
                aria-label="delete"
                disabled={isLoading}
                onClick={handleDeleteCondition}
              >
                <Delete color="secondary" />
              </IconButton>
            )}
          </Grid>
        )}
      </Grid>
      {showAddFeedback && (
        <Fade in={showAddFeedback}>
          <Grid
            container
            alignItems="center"
            style={{ display: 'flex', paddingTop: 20 }}
          >
            <Grid item style={{ flex: 'auto' }}>
              <Skeleton variant="rounded" height={55} />
            </Grid>
          </Grid>
        </Fade>
      )}
    </>
  );
};

export default ConditionBuilderRow;
