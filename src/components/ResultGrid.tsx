import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Condition, ResponseData, ResultGridProps } from '../types';

import { ConditionOperator } from '../enums/ConditionOperator';

const ResultGrid = ({
  isLoading,
  tableColumnNames,
  tableData,
  conditionsList,
}: ResultGridProps): React.ReactNode => {
  const [filteredData, setFilteredData] = useState<Array<any>>([]);

  const gridColumns: GridColDef[] = useMemo((): GridColDef[] => {
    return (
      tableColumnNames.map((columnName: string): GridColDef => {
        return {
          field: columnName,
          headerName: columnName,
          width: 110,
        } as GridColDef;
      }) || []
    );
  }, [tableColumnNames]);

  const getFilteredGridData = useMemo(() => {
    let filteredList = [];
    if (tableData && conditionsList) {
      const mappedConditions: { [key: string]: Array<Condition> } = {};
      let parentCondition: Condition | null = null;

      conditionsList.forEach((condition: Condition) => {
        if (condition.isParent) {
          mappedConditions[condition.guid!] = [condition];
          parentCondition = condition;
        } else if (parentCondition) {
          mappedConditions[parentCondition.guid!].push(condition);
        }
      });

      filteredList = tableData.filter(
        (rowItem: { [key: string]: number | string }): boolean => {
          return Object.values(mappedConditions).every(
            (conditions: Array<Condition>) => {
              return conditions.some((condition: Condition) => {
                const { leftCondition, value, operator } = condition;
                const rowValue = rowItem[leftCondition!] as string;

                if (value === '') {
                  // Skip the condition if the value is an empty string
                  return true;
                }

                switch (operator) {
                  case ConditionOperator.EQUALS:
                    return rowValue === value;
                  case ConditionOperator.GREATER_THAN:
                    return Number(rowValue) > Number(value);
                  case ConditionOperator.LESS_THAN:
                    return Number(rowValue) < Number(value);
                  case ConditionOperator.CONTAIN:
                    return rowValue.includes(value);
                  case ConditionOperator.NOT_CONTAIN:
                    return !rowValue.includes(value);
                  case ConditionOperator.REGEX:
                    // Prevent unterminated regex
                    try {
                      return new RegExp(value).test(rowValue);
                    } catch (error) {
                      // Do nothing
                    }
                    return true;
                  default:
                    return true;
                }
              });
            },
          );
        },
      );
    }

    setFilteredData(filteredList);
    return filteredList as Array<ResponseData>;
  }, [tableData, conditionsList]);

  return (
    <>
      {tableColumnNames.length !== 0 && (
        <Box paddingTop={3}>
          <Stack spacing={1} sx={{ height: 500, width: '100%' }}>
            <Typography variant="h6" component="h6" sx={{ fontWeight: 'bold' }}>
              Result
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                data-testid="total-chip"
                label={`Total: ${tableData.length}`}
              />
              <Chip
                data-testid="filtered-chip"
                label={`Filtered: ${filteredData.length}`}
                color="primary"
              />
            </Stack>
            <DataGrid
              rows={getFilteredGridData}
              columns={gridColumns}
              loading={isLoading}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 100 },
                },
              }}
              pageSizeOptions={[100, 200]}
            />
          </Stack>
        </Box>
      )}
    </>
  );
};

export default ResultGrid;
