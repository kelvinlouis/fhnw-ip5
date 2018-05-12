import {
  SET_NODE_SIZE_FILTER,
  SET_NODE_COLOR_FILTER,
  SET_LINK_WIDTH_FILTER,
  SET_LINK_COLOR_FILTER,
  CLEAR_SELECTED_GRAPH, SET_NODE_SHOW_FULL_LABEL,
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

export const nodeShowFullLabel = (state = false, action) => {
  switch (action.type) {
    case SET_NODE_SHOW_FULL_LABEL:
      return action.show;
    default:
      return state;
  }
};

export const linkWidthFilter = (state = '', action) => {
  switch (action.type) {
    case SET_LINK_WIDTH_FILTER:
      return action.filter;
    case CLEAR_SELECTED_GRAPH:
      return '';
    default:
    return state;
  }
};

export const linkColorFilter = (state = '', action) => {
  switch (action.type) {
    case SET_LINK_COLOR_FILTER:
      return action.filter;
    case CLEAR_SELECTED_GRAPH:
      return '';
    default:
    return state;
  }
};
