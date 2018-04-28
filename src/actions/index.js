export const SET_NODE_SIZE_FILTER = 'SET_NODE_SIZE_FILTER';
export const SET_NODE_COLOR_FILTER = 'SET_NODE_COLOR_FILTER';
export const SET_EDGE_WIDTH_FILTER = 'SET_EDGE_WIDTH_FILTER';
export const SET_EDGE_COLOR_FILTER = 'SET_EDGE_COLOR_FILTER';

export const SET_NODE_SIZE_FILTER_LIST = 'SET_NODE_SIZE_FILTER_LIST';
export const SET_NODE_COLOR_FILTER_LIST = 'SET_NODE_COLOR_FILTER_LIST';
export const SET_EDGE_WIDTH_FILTER_LIST = 'SET_EDGE_WIDTH_FILTER_LIST';
export const SET_EDGE_COLOR_FILTER_LIST = 'SET_EDGE_COLOR_FILTER_LIST';

export const ADD_GRAPH = 'ADD_GRAPH';
export const SELECT_GRAPH = 'SELECT_GRAPH';

const setFilter = (type, filter, graphId) => ({ type, filter, graphId });
const setFilterList = (type, list) => ({ type, list, });

export const setNodeSizeFilter = (filter, graphId) => setFilter(SET_NODE_SIZE_FILTER, filter, graphId);
export const setNodeColorFilter = (filter, graphId) => setFilter(SET_NODE_COLOR_FILTER, filter, graphId);
export const setEdgeWidthFilter = (filter, graphId) => setFilter(SET_EDGE_WIDTH_FILTER, filter, graphId);
export const setEdgeColorFilter = (filter, graphId) => setFilter(SET_EDGE_COLOR_FILTER, filter, graphId);

export const setNodeSizeFilterList = list => setFilterList(SET_NODE_SIZE_FILTER_LIST, list);
export const setNodeColorFilterList = list => setFilterList(SET_NODE_COLOR_FILTER_LIST, list);
export const setEdgeWidthFilterList = list => setFilterList(SET_EDGE_WIDTH_FILTER_LIST, list);
export const setEdgeColorFilterList = list => setFilterList(SET_EDGE_COLOR_FILTER_LIST, list);

export const addGraph = (id, data) => ({ type: ADD_GRAPH, id, data });
export const selectGraph = id => ({ type: SELECT_GRAPH, id });
