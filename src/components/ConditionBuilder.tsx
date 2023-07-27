import React, { useMemo } from 'react';

import { Add } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { ConditionType } from '../enums/ConditionType';
import { Condition, ConditionBuilderProps, ConditionOption } from '../types';
import ConditionBuilderRow from './ConditionBuilderRow';

const AndButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  width: 80,
  '&::before': {
    position: 'absolute',
    content: '""',
    height: 24,
    border: `2px solid ${theme.palette.neutral.light}`,
    top: -24,
  },
}));

const AndDivider = styled(Typography)(({ theme }) => ({
  position: 'relative',
  width: 40,
  color: theme.palette.neutral.dark,
  '&::before': {
    position: 'absolute',
    content: '""',
    height: 24,
    border: `2px solid ${theme.palette.neutral.light}`,
    top: -24,
    left: '38%',
  },
  '&::after': {
    position: 'absolute',
    content: '""',
    height: 24,
    border: `2px solid ${theme.palette.neutral.light}`,
    top: 24,
    left: '38%',
  },
}));

const ConditionBuilder = ({
  isLoading,
  tableColumnNames,
  conditionsList,
  addCondition,
  deleteCondition,
  updateCondition,
}: ConditionBuilderProps): React.ReactNode => {
  const availableColumns: Array<ConditionOption> =
    tableColumnNames?.map((col: string) => {
      return {
        label: col,
        value: col,
      };
    }) || [];

  const handleAddConditon = () => {
    addCondition(
      conditionsList && conditionsList[conditionsList?.length - 1],
      ConditionType.AND,
      true,
    );
  };

  const buildMappedConditions = useMemo((): {
    [key: string]: Array<Condition>;
  } => {
    const mappedConditions: { [key: string]: Array<Condition> } = {};
    let parentCondition: Condition;

    if (conditionsList) {
      conditionsList.forEach((condition: Condition) => {
        if (condition.isParent) {
          mappedConditions[condition.guid!] = [condition];
          parentCondition = condition;
        } else {
          mappedConditions[parentCondition.guid!].push(condition);
        }
      });
    }

    return mappedConditions;
  }, [conditionsList]);

  return (
    <>
      {Object.values(buildMappedConditions).map((conditions, index) => (
        <React.Fragment key={index}>
          {index !== 0 && (
            <AndDivider
              data-testid="and-divider"
              color="neutral"
              variant="body1"
              sx={{ fontWeight: 'bold', marginLeft: '20px !important' }}
            >
              AND
            </AndDivider>
          )}
          <Paper elevation={2}>
            {conditions.map((condition: Condition) => (
              <Box key={condition.guid} padding={2}>
                <ConditionBuilderRow
                  key={condition.guid}
                  isLoading={isLoading}
                  availableColumns={availableColumns}
                  condition={condition}
                  conditionsList={conditionsList}
                  addCondition={addCondition}
                  deleteCondition={deleteCondition}
                  updateCondition={updateCondition}
                />
              </Box>
            ))}
          </Paper>
        </React.Fragment>
      ))}

      {availableColumns.length !== 0 && conditionsList?.length !== 0 && (
        <AndButton
          variant="outlined"
          onClick={handleAddConditon}
          disabled={isLoading}
        >
          <Add />
          AND
        </AndButton>
      )}
    </>
  );
};

export default ConditionBuilder;
