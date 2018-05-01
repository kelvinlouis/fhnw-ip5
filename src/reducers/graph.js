import {
  ADD_GRAPH,
  SELECT_GRAPH,
  CLEAR_SELECTED_GRAPH,
  CHANGE_NODE_LINKS,
} from '../actions'

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

function changeLinks(graph, changedLinks) {
  const { links } = graph;
  const newLinks = [];

  links.forEach((existingLink) => {
    const changedLink = changedLinks.find(l =>
      l.source === existingLink.source && l.target === existingLink.target);

    if (!changedLink) {
      // Existing link wasn't changed
      newLinks.push(existingLink);
    } else {
      if (changedLink.changed) {
        Object.assign(existingLink, {
          weight: changedLink.weight,
          absolute_weight: changedLink.absolute_weight,
          strengthen: changedLink.strengthen,
          weaken: changedLink.weaken,
        });
      }
    }
  });

  return {
    ...graph,
    links: newLinks,
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
    case CHANGE_NODE_LINKS:
      graph = state[action.graphId];
      newGraph = changeLinks(graph, action.links);
      state[action.graphId] = newGraph;
      return state;
    default:
      return state;
  }
};

export const selectedGraphId = (state = null, action) => {
  switch (action.type) {
    case SELECT_GRAPH:
      state = action.id;
      return state;
    case CLEAR_SELECTED_GRAPH:
      return null;
    default:
      return state;
  }
};

export const getGraph = (state, id) => state.graphs[id];
export const getSelectedGraph = state => getGraph(state, state.selectedGraphId);
