import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './Graph.css';
import { GraphPropTypes } from '../propTypes';
import { max, min } from 'underscore';

const defaultColorScale = d3.scaleOrdinal(d3.schemeCategory20b);
const nodeColorInfluence = d3.scaleLinear()
  .domain([-1, 0, 1])
  .range(['red', 'grey', 'green']);

const nodeColorCycle = d3.scaleLinear()
  .domain([0, 1])
  .range(['grey', 'blue']);

const linkColors = d3.scaleLinear()
  .domain([-1, 0, 1])
  .range(['red', 'grey', 'green']);

const colorRangeMap = {};
colorRangeMap[linkColors(-1)] = 'red';
colorRangeMap[linkColors(0)] = 'grey';
colorRangeMap[linkColors(1)] = 'green';
colorRangeMap[defaultColorScale(0)] = 'default';

const allLinkColors = [
  linkColors(-1),
  linkColors(0),
  linkColors(1),
  defaultColorScale(0),
];

function positionLink(d) {
  let x1 = d.source.x;
  let y1 = d.source.y;
  let x2 = d.target.x;
  let y2 = d.target.y;

  const theta = Math.atan((x2 - x1) / (y2 - y1));
  const phi = Math.atan((y2 - y1) / (x2 - x1));

  const sinTheta = d.source.size * Math.sin(theta);
  const cosTheta = d.source.size * Math.cos(theta);
  const sinPhi = d.target.size * Math.sin(phi);
  const cosPhi = d.target.size * Math.cos(phi);

  // Set the position of the link's end point at the source node
  // such that it is on the link closest to the target node
  if (d.target.y > d.source.y) {
    x1 = x1 + sinTheta;
    y1 = y1 + cosTheta;
  }
  else {
    x1 = x1 - sinTheta;
    y1 = y1 - cosTheta;
  }

  // Set the position of the link's end point at the target node
  // such that it is on the link closest to the source node
  if (d.source.x > d.target.x) {
    x2 = x2 + cosPhi;
    y2 = y2 + sinPhi;
  }
  else {
    x2 = x2 - cosPhi;
    y2 = y2 - sinPhi;
  }

  // Draw an arc between the two calculated points
  const dx = x2 - x1,
    dy = y2 - y1,
    dr = Math.sqrt(dx * dx + dy * dy);

  return `M${x1},${y1}A${dr},${dr} 0 0,1 ${x2},${y2}`;
}


function transform(d) {
  return `translate(${d.x},${d.y})`;
}

function updateNodes(prevNodes, nextNodes) {
  prevNodes.map((prev) => {
    const next = nextNodes.find(next => next.id === prev.id);

    return Object.assign(prev, next);
  });
}

function updateLinks(prevLinks, nextLinks) {
  let len = prevLinks.length;

  for (let i = 0; i<len; i++) {
    const prev = prevLinks[i];
    const next = nextLinks.find(next => next.source === prev.source.id && next.target === prev.target.id);

    if (next) {
      Object.assign(prev, {
        ...next,
        target: prev.target,
        source: prev.source,
      });
    } else {
      // Remove link from the list
      prevLinks.splice(i, 1);
      i--;
      len--;
    }
  }
}

function applyNodeFilters(nodes, filters) {
  const sizeAttr = filters.nodeSize;
  const colorAttr = filters.nodeColor;

  const minValue = min(nodes, n => n[sizeAttr])[sizeAttr];
  const maxValue = max(nodes, n => n[sizeAttr])[sizeAttr];

  const rscale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([6, 30]);

  let nodeColorScale;
  let selectedCycle;

  if (colorAttr === 'influence') {
    nodeColorScale = nodeColorInfluence;
  } else if (colorAttr.indexOf('cycle') > -1) {
    nodeColorScale = nodeColorCycle;
    selectedCycle = +colorAttr.split('_')[1];
  } else {
    nodeColorScale = defaultColorScale;
  }

  nodes.forEach((n) => {
    n.size = rscale(n[sizeAttr]) || 10;

    if (selectedCycle !== undefined) {
      n.color = nodeColorScale(n.cycles.indexOf(selectedCycle) > -1)
    } else {
      n.color = nodeColorScale(n[colorAttr]);
    }
  });
}

function applyLinkFilters(links, filters) {
  const widthAttr = filters.linkWidth;
  const colorAttr = filters.linkColor;

  const minValue = min(links, l => l[widthAttr])[widthAttr];
  const maxValue = max(links, l => l[widthAttr])[widthAttr];
  const rscale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([1, 3]);

  links.forEach((l) => {
    l.width = rscale(l[widthAttr]) || 1;
    l.color = colorAttr ? linkColors(l[colorAttr]) : defaultColorScale(0);
  });
}

function applyFilters(filters, nodes, links) {
  applyNodeFilters(nodes, filters);
  applyLinkFilters(links, filters);
}

function shortenLabel(label, len=15) {
  const cutOfAt = len - 3;
  if (label.length > cutOfAt) {
    return `${label.substr(0, cutOfAt)}...`;
  } else {
    return label;
  }
}

class Graph extends Component {
  static propTypes = {
    data: GraphPropTypes,
    nodeShowFullLabel: PropTypes.bool,
    filters: PropTypes.shape({
      nodeSize: PropTypes.string,
      nodeColor: PropTypes.string,
      nodeEpoch: PropTypes.number,
      linkWidth: PropTypes.string,
      linkColor: PropTypes.string,
    }),
    onNodeDoubleClick: PropTypes.func,
  };

  static defaultProps = {
    onNodeDoubleClick: () => {},
    nodeShowFullLabel: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      id: null,
      nodes: null,
      links: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const state = {
      ...prevState,
    };

    if (nextProps.data) {
      if (prevState.id !== nextProps.data.id) {
        // Complete new graph has to be set
        state.id = nextProps.data.id;
        state.nodes = nextProps.data.nodes.map(n => Object.assign({}, n));
        state.links = nextProps.data.links.map(l => Object.assign({}, l));

        applyFilters(nextProps.filters, state.nodes, state.links);
        return state;
      }

      if (nextProps.data.nodes && prevState.nodes) {
        // Update references
        updateNodes(prevState.nodes, nextProps.data.nodes);
      }

      if (nextProps.data.links && prevState.links) {
        // Update references
        updateLinks(prevState.links, nextProps.data.links);
      }

      applyFilters(nextProps.filters, prevState.nodes, prevState.links);
    }

    return state;
  }

  /**
   * Shouldn't rerender a graph that was rendered before.
   * Already rendered graphs will be updated via the tick function.
   *
   * Rerender if no graph was selected yet, or a different graph was
   * loaded.
   * @param nextProps
   * @param nextState
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { data, nodeShowFullLabel } = this.props;

    if (!data) {
      // No graph rendered yet
      return true;
    }

    if (nextProps.data) {
      if (data.id !== nextProps.data.id) {
        // Different graph was selected
        return true;
      }

      console.log(nextProps.filters.nodeEpoch);

      if (nodeShowFullLabel !== nextProps.nodeShowFullLabel) {
        this.changeLabel();
        return false;
      }

      if (nextProps.data.nodes || nextProps.data.links) {
        this.tick && this.tick();
        return false;
      }
    }

    return true;
  }

  componentDidUpdate() {
    const { nodes, links } = this.state;

    if (!nodes || !links) return;

    const svg = d3.select('svg');

    // Make sure svg is cleared
    svg.selectAll("*").remove();

    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(200)/*.distance(d => radius(d.source.r / 2) + radius(d.target.r / 2))*/)
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    svg.append('defs').selectAll('marker')
      .data(allLinkColors)
      .enter()
      .append('marker')
        .attr('id', d => `marker_${colorRangeMap[d]}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 10)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
      .append('path')
        .attr('fill', d => d)
        .attr('d', 'M0,-5L10,0L0,5');

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
        .attr('class', d => 'link')
        .attr('marker-end', d => `url(#marker_${colorRangeMap[d.color]})`)
        .style('stroke', d => d.color)
        .style('stroke-width', d => `${d.width}px`);

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
        .attr('class', 'node')
        .attr('r', d => d.size)
        .attr('fill', d => d.color)
        .on('mouseover', d => this.onNodeHover(d))
        .on('mouseout', d => this.onNodeHoverOut(d))
        .on('dblclick', d => this.onNodeDoubleClick(d))
        .on('contextmenu', function(d) {
          d3.event.preventDefault();
          d.fx = null;
          d.fy = null;
          d3.select(this).classed('fixed', false);
        })
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

    const label = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
        .attr('id', d => `label_${d.id}`)
        .attr('data-text', d => d.label)
        .attr('class', 'label')
        .attr('x', 10)
        .attr('y', '.35em')
        .text(d => this.showLabel(d));

    simulation
      .nodes(nodes)
      .on('tick', tick);

    simulation
      .force('link')
      .links(links);

    resize();
    d3.select(window).on('resize', resize);

    function tick() {
      link
        .attr('d', positionLink)
        .attr('marker-end', d => `url(#marker_${colorRangeMap[d.color]})`)
        .style('stroke', d => d.color)
        .style('stroke-width', d => `${d.width}px`);

      // Make sure links are removed if the list
      // links has changed
      link
        .data(links)
        .exit()
        .remove();

      node
        .attr('transform', transform)
        .attr('r', d => d.size)
        .attr('fill', d => d.color);

      label
        .attr('transform', transform);
    }

    this.tick = tick;
    this.changeLabel = () => label.text(d => this.showLabel(d));

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      // d.fx = null;
      // d.fy = null;
      d3.select(this).classed('fixed', true);
    }

    function resize() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      svg.attr('width', windowWidth).attr('height', windowHeight);
      // force.size([windowWidth, windowHeight]).resume();
    }
  }

  showLabel(d) {
    const { nodeShowFullLabel } = this.props;

    if (!nodeShowFullLabel) {
      return shortenLabel(d.label)
    }
    return d.label;
  }

  onNodeHover(d) {
    const { nodeShowFullLabel } = this.props;

    if (!nodeShowFullLabel) {
      const id = `label_${d.id}`;
      const el = document.getElementById(id);
      el.innerHTML = el.dataset.text;
    }
  }

  onNodeHoverOut(d) {
    const { nodeShowFullLabel } = this.props;

    if (!nodeShowFullLabel) {
      const id = `label_${d.id}`;
      const el = document.getElementById(id);
      el.innerHTML = shortenLabel(d.label);
    }
  }

  onNodeDoubleClick(clickedNode) {
    const { data: { id, name, links, nodes }, onNodeDoubleClick } = this.props;
    const node = nodes.find(n => n.id === clickedNode.id);

    onNodeDoubleClick(node, {
      id,
      name,
      links,
      nodes,
    });
  }

  render() {
    const { nodes, links } = this.state;

    if (!nodes || !links) return <div />;

    return (
      <div className="Graph">
        <svg width="800" height="700"/>
      </div>
    );
  }
}

export default Graph;
