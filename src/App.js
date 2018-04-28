import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CssBaseline from 'material-ui/CssBaseline';
import Grid from 'material-ui/Grid';
import './App.css';
import { addGraph, selectGraph } from './actions';
import GraphLoader from './components/GraphLoader/GraphLoader';
import SettingsPanel from './components/SettingsPanel';
import GraphContainer from './containers/GraphContainer';
import FilterContainer from './containers/FilterContainer';

/**
 * Path where all the graphs are exported by Jupyter
 * @type {string}
 */
const GRAPH_DATA_PATH = `${process.env.PUBLIC_URL}/graph_data`;

/**
 * Local Storage key where currently selected graph is stored
 * @type {string}
 */
const LOCAL_STORAGE_SELECTED_GRAPH = 'selectedGraphId';

const mapStateToProps = state => ({
  selectedGraphId: state.selectedGraphId,
});

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    // Look for previous selected graph, by checking local storage
    const id = localStorage.getItem(LOCAL_STORAGE_SELECTED_GRAPH);

    if (id) {
      await this.getGraphData(id);
      this.selectGraph(id);
    }
  }

  constructor(props) {
    super(props);
  }

  onSelected = async (id) => {
    localStorage.setItem(LOCAL_STORAGE_SELECTED_GRAPH, id);
    await this.getGraphData(id);
    this.selectGraph(id);
  };

  selectGraph(id) {
    const { dispatch } = this.props;
    dispatch(selectGraph(id));
  }

  /**
   * Fetches the JSON and sets it as its state.
   *
   * @returns {Promise<void>}
   */
  async getGraphData(id) {
    const { dispatch } = this.props;

    if (!id) {
      console.warn('No Graph ID was passed');
      return;
    }

    try {
      const response = await fetch(`${GRAPH_DATA_PATH}/${id}`, {
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

        dispatch(addGraph(id, json));
      } else {
        console.error('Graph not found');
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
    const { selectedGraphId } = this.props;

    return (
      <div className="App">
        <CssBaseline />
        <Grid container spacing={16}>
          <Grid item xs={9}>
            <GraphContainer />
          </Grid>
          <Grid item xs={3}>
            <FilterContainer />
            {/*<SettingsPanel />*/}
          </Grid>
        </Grid>
        {!selectedGraphId && <GraphLoader onSelected={this.onSelected} />}
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
