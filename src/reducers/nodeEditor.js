import { CHANGE_NODE_EDGES, CLOSE_NODE_EDITOR, SELECT_NODE } from '../actions';

const initialState = {
  selectedNode: null,
  links: null,
  targets: null,
  open: false,
};

export const nodeEditor = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NODE_EDGES:
    case CLOSE_NODE_EDITOR:
      return initialState;
    case SELECT_NODE:
      return {
        node: action.node,
        links: action.links,
        targets: action.targets,
        open: true,
      };
    default:
      return state;
  }
};

export default nodeEditor;
