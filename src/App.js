import React, { Component } from 'react';
import * as d3 from 'd3';
import { max, min } from 'underscore';
import CssBaseline from 'material-ui/CssBaseline';
import Grid from 'material-ui/Grid';
import './App.css';
import Graph from './Graph/Graph';
import FilterControls from './FilterControls/FilterControls';
import {
  EDGE_FILTER_COLOR,
  EDGE_FILTER_WIDTH,
  NODE_FILTER_COLOR,
  NODE_FILTER_SIZE
} from './FilterControls/FilterEvent';

/**
 * Path where all the graphs are exported by Jupyter
 * @type {string}
 */
const GRAPH_DATA_PATH = `${process.env.PUBLIC_URL}/graph_data`;

/**
 * Default graph file to interpret
 * @type {string}
 */
const GRAPH_DEFAULT_FILE = 'graph.json';

/**
 * Uses the value of this search param to eventually fetch the file.
 * @type {string}
 */
const URL_PARAM_FILE = 'file';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      jsonFile: null,
      graph: null,
      origin: null,
    };
  }

  async componentDidMount() {
    await this.getGraphData();
    this.createGraph();
  }

  onFilterChange(event) {
    if (event.type === NODE_FILTER_SIZE) {
      this.changeNodeSize(event.value);
    } else if (event.type === NODE_FILTER_COLOR) {
      this.changeNodeColor(event.value);
    } else if (event.type === EDGE_FILTER_WIDTH) {
      this.changeEdgeWidth(event.value);
    } else if (event.type === EDGE_FILTER_COLOR) {
      this.changeEdgeColor(event.value);
    }
  }

  changeNodeSize(attr) {
    const { graph: { nodes } } = this.state;
    const minValue = min(nodes, n => n[attr])[attr];
    const maxValue = max(nodes, n => n[attr])[attr];
    const rscale = d3.scaleLinear().domain([minValue, maxValue]).range([6, 30]);

    nodes.map(n => {
      n.size = rscale(n[attr])
    });
  }

  changeNodeColor(attr) {
    const { graph: { nodes } } = this.state;

    const color = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(['red', 'white', 'green']);

    nodes.map(n => {
      n.color = color(n[attr])
    });
  }

  changeEdgeWidth(attr) {
    const { graph: { links } } = this.state;
    const minValue = min(links, l => l[attr])[attr];
    const maxValue = max(links, l => l[attr])[attr];
    const rscale = d3.scaleLinear().domain([minValue, maxValue]).range([1, 5]);

    links.map(l => {
      l.width = rscale(l[attr])
    });
  }

  changeEdgeColor(attr) {
    const { graph: { links } } = this.state;

    const color = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(['red', 'black', 'green']);

    links.map(l => {
      l.color = color(l[attr])
    });
  }

  createGraph() {
    const { origin } = this.state;
    const color = d3.scaleOrdinal(d3.schemeCategory20);

    const nodes = origin.nodes.map(n => {
      return {
        id: n.id,
        label: n.label,
        size: 10,
        color: color(1),
        influence: n.influence,
        actionSystem: n.actionSystem,
        degree_weight: n.degree_weight,
        in_degree_weight: n.in_degree_weight,
        out_degree_weight: n.out_degree_weight,
        degree_weight_absolute: n.degree_weight_absolute,
        in_degree_weight_absolute: n.in_degree_weight_absolute,
        out_degree_weight_absolute: n.out_degree_weight_absolute,
        degree_strengthen: n.degree_strengthen,
        in_degree_strengthen: n.in_degree_strengthen,
        out_degree_strengthen: n.out_degree_strengthen,
        degree_weaken: n.degree_weaken,
        in_degree_weaken: n.in_degree_weaken,
        out_degree_weaken: n.out_degree_weaken,
        degree: n.degree,
        in_degree: n.in_degree,
        out_degree: n.out_degree,
      };
    });

    const links = origin.links.map(l => {
      return {
        id: l.id,
        source: l.source,
        target: l.target,
        width: 1,
        color: color(1),
        weight: l.weight,
        weight_absolute: l.weight_absolute,
        strengthen: l.strengthen,
        weaken: l.weaken,
        sign: l.sign,
      };
    });

    this.setState({
      graph: { nodes, links },
    });
  }

  /**
   * Returns the file name passed via the search param.
   * @returns {string | null}
   */
  extractFilenameFromUrl() {
    const params = new URLSearchParams(document.location.search);
    return params.get(URL_PARAM_FILE);
  }

  /**
   * Fetches the JSON and sets it as its state.
   *
   * @returns {Promise<void>}
   */
  async getGraphData() {
    let jsonFile = this.extractFilenameFromUrl();

    if (!jsonFile) {
      console.warn(`No file was passed. Use default: ${GRAPH_DEFAULT_FILE}`);
      jsonFile = GRAPH_DEFAULT_FILE;
    }

    try {
      const response = await fetch(`${GRAPH_DATA_PATH}/${jsonFile}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache': 'no-cache',
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Response was successful set data
        const json = await response.json();
        this.setState({
          origin: json,
          jsonFile,
        });
      } else {
        console.error('File not found');
      }
    } catch(err) {
      console.error(`Error occurred while fetching: ${err.message}`);
    }
  }

  /**
   * Only displays the graph and the filter,
   * if the necessary props exist for them.
   *
   * @returns {*}
   */
  render() {
    const { graph } = this.state;

    return (
      <div className="App">
        <CssBaseline />
        <Grid container spacing={16}>
          <Grid item xs={8}>
            {graph && <Graph data={graph} /> }
          </Grid>
          <Grid item xs={4}>
            {graph && <FilterControls onFilterChange={(event) => this.onFilterChange(event)}/> }
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
