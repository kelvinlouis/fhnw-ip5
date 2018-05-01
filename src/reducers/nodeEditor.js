import {
  CLOSE_NODE_EDITOR,
  SELECT_NODE
} from '../actions';

const initialState = {
  selectedNode: null,
  graph: null,
  open: false,
};

export const nodeEditor = (state = initialState, action) => {
  switch (action.type) {
    case CLOSE_NODE_EDITOR:
      return initialState;
    case SELECT_NODE:
      return {
        node: action.node,
        graph: action.graph,
        open: true,
      };
    default:
      return state;
  }
};

export default nodeEditor;
