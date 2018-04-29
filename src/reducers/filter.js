import {
  SET_NODE_SIZE_FILTER,
  SET_NODE_COLOR_FILTER,
  SET_EDGE_WIDTH_FILTER,
  SET_EDGE_COLOR_FILTER,
  CLEAR_SELECTED_GRAPH,
} from '../actions'

export const nodeSizeFilter = (state = '', action) => {
  switch (action.type) {
    case SET_NODE_SIZE_FILTER:
      return action.filter;
    case CLEAR_SELECTED_GRAPH:
      return '';
    default:
    return state;
  }
};

export const nodeColorFilter = (state = '', action) => {
  switch (action.type) {
    case SET_NODE_COLOR_FILTER:
      return action.filter;
    case CLEAR_SELECTED_GRAPH:
      return '';
    default:
    return state;
  }
};

export const edgeWidthFilter = (state = '', action) => {
  switch (action.type) {
    case SET_EDGE_WIDTH_FILTER:
      return action.filter;
    case CLEAR_SELECTED_GRAPH:
      return '';
    default:
    return state;
  }
};

export const edgeColorFilter = (state = '', action) => {
  switch (action.type) {
    case SET_EDGE_COLOR_FILTER:
      return action.filter;
    case CLEAR_SELECTED_GRAPH:
      return '';
    default:
    return state;
  }
};
