import { combineReducers } from 'redux';
import * as filters from './filter';
import * as listFilters from './listFilter';

export default combineReducers({
  ...filters,
  ...listFilters,
});
