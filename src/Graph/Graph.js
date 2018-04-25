import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './Graph.css';

const radius = d3.scaleSqrt().range([0, 6]);

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
  // such that it is on the edge closest to the target node
  if (d.target.y > d.source.y) {
    x1 = x1 + sinTheta;
    y1 = y1 + cosTheta;
  }
  else {
    x1 = x1 - sinTheta;
    y1 = y1 - cosTheta;
  }

  // Set the position of the link's end point at the target node
  // such that it is on the edge closest to the source node
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

class Graph extends Component {
  static propTypes = {
    data: PropTypes.shape({
      nodes: PropTypes.array,
      links: PropTypes.array,
    }).isRequired,
  };

  componentDidMount() {
    const { data } = this.props;

    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(150)/*.distance(d => radius(d.source.r / 2) + radius(d.target.r / 2))*/)
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const links = data.links;
    const nodes = data.nodes;

    svg.append('defs').selectAll('marker')
      .data(['default'])
      .enter().append('marker')
      .attr('id', d => d)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5');

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('class', d => 'link')
      .attr('marker-end', d => 'url(#default)')
      .style('stroke', 'black')
      .style('stroke-width', '1px');

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', d => d.size)
      .attr('fill', d => color(d.color))
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    const label = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('class','label')
      .attr('x', 10)
      .attr('y', '.35em')
      .text(d => d.label);

    simulation
      .nodes(data.nodes)
      .on('tick', ticked);

    simulation
      .force('link')
      .links(data.links);

    function ticked() {
      link.attr('d', positionLink);
      node.attr('transform', transform);
      node.attr('r', d => d.size);
      node.attr('fill', d => d.color);
      label.attr('transform', transform);
    }

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
      d.fx = null;
      d.fy = null;
    }
  }

  render() {
    return (
      <div className="Graph">
        <svg width="600" height="500"/>
      </div>
    );
  }
}

export default Graph;
