import {
  SET_NODE_SIZE_FILTER_LIST,
  SET_NODE_COLOR_FILTER_LIST,
  SET_EDGE_WIDTH_FILTER_LIST,
  SET_EDGE_COLOR_FILTER_LIST
} from '../actions'

export const nodeSizeFilterList = (state = [], action) => {
  switch (action.type) {
    case SET_NODE_SIZE_FILTER_LIST:
      return action.list;
    default:
      return state;
  }
};

export const nodeColorFilterList = (state = [], action) => {
  switch (action.type) {
    case SET_NODE_COLOR_FILTER_LIST:
      return action.list;
    default:
      return state;
  }
};

export const edgeWidthFilterList = (state = [], action) => {
  switch (action.type) {
    case SET_EDGE_WIDTH_FILTER_LIST:
      return action.list;
    default:
      return state;
  }
};

export const edgeColorFilterList = (state = [], action) => {
  switch (action.type) {
    case SET_EDGE_COLOR_FILTER_LIST:
      return action.list;
    default:
      return state;
  }
};

