import { useState } from 'react';

import TextField from '@mui/material/TextField';
import { SearchInputProps, ValidationResult } from '../types';
import { isValidUrl, validateInput } from '../utils';
import ErrorTooltip from './ErrorTooltip';

const validationField = 'url';

const SearchInput = ({
  isLoading,
  updateSearchURL,
}: SearchInputProps): React.ReactNode => {
  const [searchUrl, setSearchUrl] = useState<string>('');
  const [validations, setValidations] = useState<ValidationResult>({
    isValid: true,
  });

  const handleSearchURLChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { value },
    } = event;

    setValidations({ isValid: true });
    setSearchUrl(value);
  };

  const handleOnBlur = () => {
    const validationResult: ValidationResult = validateInput({
      field: validationField,
      value: searchUrl,
      validationFunc: isValidUrl,
      errorMessage:
        'Invalid URL. Please enter a valid URL, including http:// or https://',
    });
    setValidations(validationResult);
    if (validationResult.isValid) {
      updateSearchURL(searchUrl);
    }
  };

  return (
    <ErrorTooltip
      disableFocusListener
      followCursor
      title={
        !validations.isValid ? validations.errors![validationField].message : ''
      }
    >
      <TextField
        id="search-input-text"
        inputProps={{ 'data-testid': 'search-input-text' }}
        label="URL"
        value={searchUrl}
        error={!validations.isValid}
        disabled={isLoading}
        helperText="Insert data url. Returning data MUST be an array json where each element is a key/value pair."
        onChange={handleSearchURLChange}
        onBlur={handleOnBlur}
      />
    </ErrorTooltip>
  );
};

export default SearchInput;
