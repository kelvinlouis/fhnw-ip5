export const SET_NODE_SIZE_FILTER = 'SET_NODE_SIZE_FILTER';
export const SET_NODE_COLOR_FILTER = 'SET_NODE_COLOR_FILTER';
export const SET_NODE_SHOW_FULL_LABEL = 'SET_NODE_SHOW_FULL_LABEL';
export const SET_LINK_WIDTH_FILTER = 'SET_LINK_WIDTH_FILTER';
export const SET_LINK_COLOR_FILTER = 'SET_LINK_COLOR_FILTER';

export const SET_NODE_SIZE_FILTER_LIST = 'SET_NODE_SIZE_FILTER_LIST';
export const SET_NODE_COLOR_FILTER_LIST = 'SET_NODE_COLOR_FILTER_LIST';
export const SET_LINK_WIDTH_FILTER_LIST = 'SET_LINK_WIDTH_FILTER_LIST';
export const SET_LINK_COLOR_FILTER_LIST = 'SET_LINK_COLOR_FILTER_LIST';

export const SET_NODE_EPOCH = 'SET_NODE_EPOCH';
export const SET_NODE_EPOCHS = 'SET_NODE_EPOCHS';

export const ADD_GRAPH = 'ADD_GRAPH';
export const SELECT_GRAPH = 'SELECT_GRAPH';
export const CLEAR_SELECTED_GRAPH = 'CLEAR_SELECTED_GRAPH';
export const UPDATE_GRAPH = 'UPDATE_GRAPH';

export const SELECT_NODE = 'SELECT_NODE';
export const CLOSE_NODE_EDITOR = 'CLOSE_NODE_EDITOR';
export const SET_NODE_POSITION = 'SET_NODE_POSITION';

const setFilter = (type, filter, graphId) => ({ type, filter, graphId });
const setFilterList = (type, list) => ({ type, list, });

export const setNodeSizeFilter = (filter, graphId) => setFilter(SET_NODE_SIZE_FILTER, filter, graphId);
export const setNodeColorFilter = (filter, graphId) => setFilter(SET_NODE_COLOR_FILTER, filter, graphId);
export const setNodeShowFullLabel = show => ({ type: SET_NODE_SHOW_FULL_LABEL, show });
export const setLinkWidthFilter = (filter, graphId) => setFilter(SET_LINK_WIDTH_FILTER, filter, graphId);
export const setLinkColorFilter = (filter, graphId) => setFilter(SET_LINK_COLOR_FILTER, filter, graphId);

export const setNodeSizeFilterList = list => setFilterList(SET_NODE_SIZE_FILTER_LIST, list);
export const setNodeColorFilterList = list => setFilterList(SET_NODE_COLOR_FILTER_LIST, list);
export const setLinkWidthFilterList = list => setFilterList(SET_LINK_WIDTH_FILTER_LIST, list);
export const setLinkColorFilterList = list => setFilterList(SET_LINK_COLOR_FILTER_LIST, list);

export const setNodeEpoch = (value, graphId) => ({ type: SET_NODE_EPOCH, value, graphId });
export const setNodeEpochs = value => ({ type: SET_NODE_EPOCHS, value });

export const addGraph = (id, data) => ({ type: ADD_GRAPH, id, data });
export const selectGraph = id => ({ type: SELECT_GRAPH, id });
export const clearSelectedGraph = () => ({ type: CLEAR_SELECTED_GRAPH });
export const updateGraph = (graphId, graph) => ({ type: UPDATE_GRAPH, graphId, graph, });
export const closeNodeEditor = () => ({ type: CLOSE_NODE_EDITOR });

export const selectNode = (node, graph) => ({ type: SELECT_NODE, node, graph, });
export const setNodePosition = (nodeId, position, graphId) => ({ type: SET_NODE_POSITION, nodeId, position, graphId });
