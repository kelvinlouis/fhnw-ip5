import React, { Component } from 'react';
import CssBaseline from 'material-ui/CssBaseline';
import Grid from 'material-ui/Grid';
import './App.css';
import Graph from './Graph/Graph';
import FilterControls from "./FilterControls/FilterControls";

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
    };
  }

  componentDidMount() {
    this.getGraphData();
  }

  onFilterChange(value) {
    console.log(value);
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
          graph: json,
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
            {graph && <FilterControls onFilterChange={(change) => this.onFilterChange(change)}/> }
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
