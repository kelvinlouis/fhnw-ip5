export const NODE_FILTER_SIZE = 'nodeSize';
export const NODE_FILTER_COLOR = 'nodeColor';
export const NODE_FILTER_CYCLE = 'nodeCycle';

export const EDGE_FILTER_WIDTH = 'edgeWidth';
export const EDGE_FILTER_COLOR = 'edgeColor';

export const createNodeSizeEvent = (value) => new FilterEvent(NODE_FILTER_SIZE, value);
export const createNodeColorEvent = (value) => new FilterEvent(NODE_FILTER_COLOR, value);
export const createNodeeCycleEvent = (value) => new FilterEvent(NODE_FILTER_CYCLE, value);
export const createEdgeWidthEvent = (value) => new FilterEvent(EDGE_FILTER_WIDTH, value);
export const createEdgeColorEvent = (value) => new FilterEvent(EDGE_FILTER_COLOR, value);

export default class FilterEvent {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}
