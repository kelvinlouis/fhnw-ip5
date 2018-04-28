import { combineReducers } from 'redux';
import { selectedGraph, graphs } from './graph';
import * as filters from './filter';
import * as listFilters from './listFilter';

export default combineReducers({
  ...filters,
  ...listFilters,
  selectedGraph,
  graphs,
});
