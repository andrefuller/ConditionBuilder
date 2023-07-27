import { useCallback, useEffect, useMemo, useState } from 'react';

import uuid from 'react-native-uuid';

import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { blue, grey, orange, red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { debounce } from '@mui/material/utils';

import AboutDialog from './components/AboutDialog';
import ConditionBuilder from './components/ConditionBuilder';
import DarkModeSwitch from './components/DarkModeSwitch';
import ResultGrid from './components/ResultGrid';
import SearchInput from './components/SearchInput';
import { ConditionOperator } from './enums/ConditionOperator';
import { ConditionType } from './enums/ConditionType';
import { ResponseStatus } from './enums/ResponseStatus';
import { Condition, ResponseData } from './types';
import { getConditionIndex } from './utils';

// EXAMPLE URL: https://data.nasa.gov/resource/y77d-th95.json

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

const App = (): React.ReactNode => {
  const [open, setOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode ? (JSON.parse(storedMode) as boolean) : false;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchURL, setSearchURL] = useState<string>('');
  const [tableColumnNames, setTableColumnNames] = useState<Array<string>>([]);
  const [tableData, setTableData] = useState<Array<any>>([]);
  const [conditionsList, setConditionsList] = useState<Array<Condition>>([]);

  // Search Input Callbacks
  const updateSearchURL = useCallback((url: string) => {
    setSearchURL(url);
  }, []);

  const getData = useMemo(
    () =>
      debounce(
        async (
          url: string,
          callback: (status: string, response?: [], error?: Error) => void,
        ) => {
          try {
            const response = await fetch(url);

            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }

            const jsonData: [] = (await response.json()) as [];

            callback(ResponseStatus.OK, jsonData);
          } catch (error: any) {
            callback(ResponseStatus.ERROR, undefined, error as Error);
          }
        },
        400,
      ),
    [],
  );

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    if (searchURL === '') {
      setTableColumnNames([]);
      setTableData([]);
      setConditionsList([]);
      return;
    }

    setIsLoading(true);

    void getData(searchURL, (status: string, response?: [], error?: Error) => {
      if (error) {
        // TODO: Better error state handling/display (i.e. Error boundaries?)
        setTableColumnNames([]);
        setTableData([]);
        setConditionsList([]);
      } else if (status === ResponseStatus.OK) {
        let newOptions: Array<ResponseData> = [];
        let columnNames: Array<string> = [];

        if (response) {
          const distinctKeysSet = new Set<string>();
          let guid = '';

          newOptions = response.map((obj: ResponseData): ResponseData => {
            Object.keys(obj).forEach((key: string) => {
              // Only allow words for column names
              if (!key.match(/\W/)) {
                distinctKeysSet.add(key);
              }
            });

            guid = uuid.v4() as string;

            return {
              ...obj,
              ...{ guid },
              ...(!(obj.id as string) && { id: guid }),
            };
          });

          columnNames = Array.from(distinctKeysSet);
        }

        setTableColumnNames(columnNames);
        setTableData(newOptions);
        setConditionsList([
          {
            guid: uuid.v4() as string,
            isParent: true,
            leftCondition: columnNames[0],
            operator: ConditionOperator.EQUALS,
            value: '',
            type: ConditionType.OR,
          },
        ]);
      }
      setIsLoading(false);
    });
  }, [searchURL, getData]);

  // Condition Builder Callbacks
  const addCondition = useCallback(
    (
      parentCondition: Condition,
      conditionType: ConditionType,
      isParent = false,
    ) => {
      const indexToAdd: number =
        getConditionIndex(conditionsList, parentCondition.guid!) + 1 ||
        conditionsList.length;

      const conditionToAdd: Condition = {
        guid: uuid.v4() as string,
        isParent,
        leftCondition: tableColumnNames[0],
        operator: ConditionOperator.EQUALS,
        value: '',
        type: conditionType,
      };

      const newList = [...conditionsList];
      newList.splice(indexToAdd, 0, conditionToAdd);

      setConditionsList(newList);
    },
    [conditionsList, tableColumnNames],
  );

  const updateCondition = useCallback(
    (guid: string, updatedCondition: Condition): void => {
      const updatedConditions: Array<Condition> = conditionsList.map(
        (condition: Condition) =>
          condition.guid === guid ? updatedCondition : condition,
      );

      setConditionsList(updatedConditions);
    },
    [conditionsList],
  );

  const deleteCondition = useCallback(
    (guid: string): void => {
      const index: number = getConditionIndex(conditionsList, guid);

      const conditionToDelete = conditionsList[index];

      // Check if removing parent and ensure that the following condition
      // becomes new parent
      if (conditionToDelete.isParent) {
        const nextIndex: number = index + 1;
        const nextCondition: Condition = conditionsList[nextIndex];

        if (nextCondition) {
          updateCondition(nextCondition.guid as string, {
            ...nextCondition,
            isParent: true,
          });
        }
      }
      setConditionsList(previousState => {
        return previousState.filter(condition => condition.guid !== guid);
      });
    },
    [conditionsList, updateCondition],
  );

  const handleAboutOpen = useCallback((): void => {
    setOpen(true);
  }, []);

  const handleAboutClose = useCallback((): void => {
    setOpen(false);
  }, []);

  const handleDarkModeToggle = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: blue.A700,
      },
      secondary: {
        main: orange.A700,
      },
      error: {
        main: red.A400,
      },
      neutral: {
        main: grey[100],
        light: grey[300],
        dark: grey.A700,
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" disabled aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Condition Builder
            </Typography>
            <Button color="inherit" onClick={handleAboutOpen}>
              About
            </Button>
            <DarkModeSwitch
              id="dark-mode-toggle"
              data-testid="dark-mode-toggle"
              aria-checked={darkMode}
              checked={darkMode}
              size="small"
              onChange={handleDarkModeToggle}
            />
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Box paddingTop={3}>
            <Stack spacing={3}>
              <SearchInput
                isLoading={isLoading}
                updateSearchURL={updateSearchURL}
              />
              <ConditionBuilder
                isLoading={isLoading}
                tableColumnNames={tableColumnNames}
                conditionsList={conditionsList}
                addCondition={addCondition}
                deleteCondition={deleteCondition}
                updateCondition={updateCondition}
              />
              <ResultGrid
                isLoading={isLoading}
                tableColumnNames={tableColumnNames}
                tableData={tableData}
                conditionsList={conditionsList}
              />
            </Stack>
          </Box>
        </Container>
        <AboutDialog open={open} onClose={handleAboutClose} />
      </ThemeProvider>
    </>
  );
};

export default App;
