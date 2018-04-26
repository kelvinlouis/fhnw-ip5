import {
  SET_GRAPH,
  SET_NODE_SIZE_FILTER,
  SET_NODE_COLOR_FILTER,
  SET_EDGE_WIDTH_FILTER,
  SET_EDGE_COLOR_FILTER
} from '../actions'
import * as d3 from 'd3';
import { min, max } from 'underscore';

function createGraph(origin) {
  const color = d3.scaleOrdinal(d3.schemeCategory20);

  // Copy nodes
  const nodes = origin.nodes.map(n => {
    return Object.assign({
      size: 10,
      color: color(1)
    }, n);
  });

  // Copy links
  const links = origin.links.map(l => {
    return Object.assign({
      width: 1,
      color: color(1),
    }, l);
  });

  return { nodes, links };
}

function changeNodeSize(graph, attr) {
  const { nodes } = graph;
  const minValue = min(nodes, n => n[attr])[attr];
  const maxValue = max(nodes, n => n[attr])[attr];
  const rscale = d3.scaleLinear().domain([minValue, maxValue]).range([6, 30]);

  nodes.map(n => {
    n.size = rscale(n[attr])
  });
}

function changeNodeColor(graph, attr) {
  const { nodes } = graph;

  const color = d3.scaleLinear()
    .domain([-1, 0, 1])
    .range(['red', 'white', 'green']);

  nodes.map(n => {
    n.color = color(n[attr])
  });
}

function changeEdgeWidth(graph, attr) {
  const { links } = graph;
  const minValue = min(links, l => l[attr])[attr];
  const maxValue = max(links, l => l[attr])[attr];
  const rscale = d3.scaleLinear().domain([minValue, maxValue]).range([1, 5]);

  links.map(l => {
    l.width = rscale(l[attr])
  });
}

function changeEdgeColor(graph, attr) {
  const { links } = graph;

  const color = d3.scaleLinear()
    .domain([-1, 0, 1])
    .range(['red', 'black', 'green']);

  links.map(l => {
    l.color = color(l[attr])
  });
}

export const selectedGraph = (state = null, action) => {
  switch (action.type) {
    case SET_GRAPH:
      return createGraph(action.data);
    case SET_NODE_SIZE_FILTER:
      changeNodeSize(state, action.filter);
      return state;
    case SET_NODE_COLOR_FILTER:
      changeNodeColor(state, action.filter);
      return state;
    case SET_EDGE_WIDTH_FILTER:
      changeEdgeWidth(state, action.filter);
      return state;
    case SET_EDGE_COLOR_FILTER:
      changeEdgeColor(state, action.filter);
      return state;
    default:
      return state;
  }
};
