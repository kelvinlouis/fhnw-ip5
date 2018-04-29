import { combineReducers } from 'redux';
import { selectedGraphId, graphs } from './graph';
import * as filters from './filter';
import * as listFilters from './listFilter';
import nodeEditor from './nodeEditor';

export default combineReducers({
  ...filters,
  ...listFilters,
  selectedGraphId,
  graphs,
  nodeEditor,
});
