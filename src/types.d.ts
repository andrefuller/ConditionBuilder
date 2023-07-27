import { ConditionOperator } from './enums/ConditionOperator';
import { ConditionType } from './enums/ConditionType';

interface ConditionOption {
  label: string;
  value: string;
}

interface Condition {
  guid?: string;
  isParent?: boolean = false;
  leftCondition?: string;
  operator?: ConditionOperator.CONTAIN | ConditionOperator.EQUALS | ConditionOperator.GREATER_THAN | ConditionOperator.LESS_THAN | ConditionOperator.NOT_CONTAIN | ConditionOperator.REGEX;
  value: string;
  type: ConditionType.AND | ConditionType.OR;
}

interface ValidationResult {
  errors?: { [field: string]: { message?: string } };
  isValid: boolean;
}

interface ResponseData {
  [key: string]: number | string;
}

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

interface SearchInputProps {
  isLoading: boolean;
  updateSearchURL: (url: string) => void;
}

interface ConditionBuilderProps {
  isLoading: boolean;
  conditionsList: Array<Condition>;
  tableColumnNames: Array<string>;
  addCondition: (parentCondition?: Condtion,conditionType: ConditionType, isParent?: boolean) => void;
  deleteCondition: (guid: string) => void;
  updateCondition: (guid: string, updatedCondition: Condition) => void;
}

interface ConditionBuilderRowProps extends ConditionBuilderProps {
  availableColumns: Array<ConditionOption>;
  tableColumnNames?: never;
  condition?: Condition;
}

interface ResultGridProps {
  isLoading: boolean;
  tableColumnNames: Array<string>;
  tableData: Array<any>;
  conditionsList?: Array<Condition>;
}

interface GridFilterItem {
  field: string;
  value: string;
}

interface GridFilters {
  and?: Array<GridFilterItem>;
  or?: Array<GridFilterItem>;
}
