import {
  ADD_GRAPH,
  SELECT_GRAPH,
  CLEAR_SELECTED_GRAPH,
  UPDATE_GRAPH,
} from '../actions'
import { LOCAL_STORAGE_SELECTED_GRAPH } from '../constants';

function createGraph(origin) {
  // Copy nodes
  const nodes = origin.nodes.map(n => Object.assign({}, n));
  const links = origin.links.map(l => Object.assign({}, l));

  return {
    id: origin.id,
    name: origin.name,
    nodes,
    links,
  };
}

export const graphs = (state = {}, action) => {
  let graph;
  let newGraph;

  switch (action.type) {
    case ADD_GRAPH:
      // Pushes the received graph into a map for
      // internal storage
      graph = createGraph(action.data);
      state[action.id] = graph;
      return state;
    case UPDATE_GRAPH:
      newGraph = createGraph(action.graph);
      state[action.graphId] = newGraph;
      return state;
    default:
      return state;
  }
};

export const selectedGraphId = (state = null, action) => {
  switch (action.type) {
    case SELECT_GRAPH:
      // Save latest selected graph into local storage
      localStorage.setItem(LOCAL_STORAGE_SELECTED_GRAPH, action.id);
      state = action.id;
      return state;
    case CLEAR_SELECTED_GRAPH:
      return null;
    default:
      const storedId = localStorage.getItem(LOCAL_STORAGE_SELECTED_GRAPH);
      if (storedId) return storedId;

      return state;
  }
};

export const getGraph = (state, id) => state.graphs[id];
export const getSelectedGraph = state => getGraph(state, state.selectedGraphId);
