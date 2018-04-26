import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CssBaseline from 'material-ui/CssBaseline';
import Grid from 'material-ui/Grid';
import './App.css';
import { setGraph } from './actions';
import GraphContainer from './containers/GraphContainer';
import FilterContainer from './containers/FilterContainer';

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
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    this.getGraphData();
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
    const { dispatch } = this.props;
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
        dispatch(setGraph(json));
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
    return (
      <div className="App">
        <CssBaseline />
        <Grid container spacing={16}>
          <Grid item xs={8}>
            <GraphContainer />
          </Grid>
          <Grid item xs={4}>
            <FilterContainer />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connect()(App);
