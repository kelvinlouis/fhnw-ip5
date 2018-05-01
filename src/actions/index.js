export const SET_NODE_SIZE_FILTER = 'SET_NODE_SIZE_FILTER';
export const SET_NODE_COLOR_FILTER = 'SET_NODE_COLOR_FILTER';
export const SET_LINK_WIDTH_FILTER = 'SET_LINK_WIDTH_FILTER';
export const SET_LINK_COLOR_FILTER = 'SET_LINK_COLOR_FILTER';

export const SET_NODE_SIZE_FILTER_LIST = 'SET_NODE_SIZE_FILTER_LIST';
export const SET_NODE_COLOR_FILTER_LIST = 'SET_NODE_COLOR_FILTER_LIST';
export const SET_LINK_WIDTH_FILTER_LIST = 'SET_LINK_WIDTH_FILTER_LIST';
export const SET_LINK_COLOR_FILTER_LIST = 'SET_LINK_COLOR_FILTER_LIST';

export const ADD_GRAPH = 'ADD_GRAPH';
export const SELECT_GRAPH = 'SELECT_GRAPH';
export const CLEAR_SELECTED_GRAPH = 'CLEAR_SELECTED_GRAPH';

export const SELECT_NODE = 'SELECT_NODE';
export const CLOSE_NODE_EDITOR = 'CLOSE_NODE_EDITOR';
export const CHANGE_NODE_LINKS = 'CHANGE_NODE_LINKS';

const setFilter = (type, filter, graphId) => ({ type, filter, graphId });
const setFilterList = (type, list) => ({ type, list, });

export const setNodeSizeFilter = (filter, graphId) => setFilter(SET_NODE_SIZE_FILTER, filter, graphId);
export const setNodeColorFilter = (filter, graphId) => setFilter(SET_NODE_COLOR_FILTER, filter, graphId);
export const setLinkWidthFilter = (filter, graphId) => setFilter(SET_LINK_WIDTH_FILTER, filter, graphId);
export const setLinkColorFilter = (filter, graphId) => setFilter(SET_LINK_COLOR_FILTER, filter, graphId);

export const setNodeSizeFilterList = list => setFilterList(SET_NODE_SIZE_FILTER_LIST, list);
export const setNodeColorFilterList = list => setFilterList(SET_NODE_COLOR_FILTER_LIST, list);
export const setLinkWidthFilterList = list => setFilterList(SET_LINK_WIDTH_FILTER_LIST, list);
export const setLinkColorFilterList = list => setFilterList(SET_LINK_COLOR_FILTER_LIST, list);

export const addGraph = (id, data) => ({ type: ADD_GRAPH, id, data });
export const selectGraph = id => ({ type: SELECT_GRAPH, id });
export const clearSelectedGraph = () => ({ type: CLEAR_SELECTED_GRAPH });
export const selectNode = (node, links, targets) => ({ type: SELECT_NODE, node, links, targets });
export const closeNodeEditor = () => ({ type: CLOSE_NODE_EDITOR });
export const changeNodeLinks = (graphId, links) => ({ type: CHANGE_NODE_LINKS, links, graphId, });
