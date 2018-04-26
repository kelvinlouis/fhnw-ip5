export const SET_NODE_SIZE_FILTER = 'SET_NODE_SIZE_FILTER';
export const SET_NODE_COLOR_FILTER = 'SET_NODE_COLOR_FILTER';
export const SET_EDGE_WIDTH_FILTER = 'SET_EDGE_WIDTH_FILTER';
export const SET_EDGE_COLOR_FILTER = 'SET_EDGE_COLOR_FILTER';

export const SET_NODE_SIZE_FILTER_LIST = 'SET_NODE_SIZE_FILTER_LIST';
export const SET_NODE_COLOR_FILTER_LIST = 'SET_NODE_COLOR_FILTER_LIST';
export const SET_EDGE_WIDTH_FILTER_LIST = 'SET_EDGE_WIDTH_FILTER_LIST';
export const SET_EDGE_COLOR_FILTER_LIST = 'SET_EDGE_COLOR_FILTER_LIST';

export const SET_GRAPH = 'SET_GRAPH';

const setFilter = (type, filter) => ({ type, filter, });
const setFilterList = (type, list) => ({ type, list, });

export const setNodeSizeFilter = filter => setFilter(SET_NODE_SIZE_FILTER, filter);
export const setNodeColorFilter = filter => setFilter(SET_NODE_COLOR_FILTER, filter);
export const setEdgeWidthFilter = filter => setFilter(SET_EDGE_WIDTH_FILTER, filter);
export const setEdgeColorFilter = filter => setFilter(SET_EDGE_COLOR_FILTER, filter);

export const setNodeSizeFilterList = list => setFilterList(SET_NODE_SIZE_FILTER_LIST, list);
export const setNodeColorFilterList = list => setFilterList(SET_NODE_COLOR_FILTER_LIST, list);
export const setEdgeWidthFilterList = list => setFilterList(SET_EDGE_WIDTH_FILTER_LIST, list);
export const setEdgeColorFilterList = list => setFilterList(SET_EDGE_COLOR_FILTER_LIST, list);

export const setGraph = data => ({ type: SET_GRAPH, data });
