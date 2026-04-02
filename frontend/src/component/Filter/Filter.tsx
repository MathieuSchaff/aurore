// Barrel re-export — consumers import from '@/component/Filter/Filter'
// and get the types + the dialog component without knowing the internal split.
import './Filter.css'

export { GroupedFilterDialog } from './GroupedFilterDialog'
export type {
  FilterFieldConfig,
  FilterGroupConfig,
  FilterOption,
  FilterSubGroup,
  FilterValues,
  GroupedFilterField,
} from './types'
