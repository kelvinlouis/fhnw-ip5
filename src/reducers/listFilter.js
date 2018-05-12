import {
  SET_NODE_SIZE_FILTER_LIST,
  SET_NODE_COLOR_FILTER_LIST,
  SET_LINK_WIDTH_FILTER_LIST,
  SET_LINK_COLOR_FILTER_LIST,
  SET_NODE_EPOCHS,
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

export const nodeEpochs = (state = 1, action) => {
  switch (action.type) {
    case SET_NODE_EPOCHS:
      return action.value - 1;
    default:
      return state;
  }
};

export const linkWidthFilterList = (state = [], action) => {
  switch (action.type) {
    case SET_LINK_WIDTH_FILTER_LIST:
      return action.list;
    default:
      return state;
  }
};

export const linkColorFilterList = (state = [], action) => {
  switch (action.type) {
    case SET_LINK_COLOR_FILTER_LIST:
      return action.list;
    default:
      return state;
  }
};

