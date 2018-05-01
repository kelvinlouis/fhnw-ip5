import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CssBaseline from 'material-ui/CssBaseline';
import './App.css';
import {
  addGraph,
  selectGraph,
  setLinkColorFilterList,
  setLinkWidthFilterList,
  setNodeColorFilterList,
  setNodeSizeFilterList,
  setNodeSizeFilter,
  setNodeColorFilter,
  setLinkColorFilter,
  setLinkWidthFilter,
} from './actions';
import GraphLoader from './components/GraphLoader/GraphLoader';
import GraphContainer from './containers/GraphContainer';
import GraphPanelContainer from './containers/GraphPanelContainer';
import NodeEditorContainer from './containers/NodeEditorContainer';
import { getGraph, getGraphFilters } from './ApiService';

const mapStateToProps = state => ({
  selectedGraphId: state.selectedGraphId,
});

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { selectedGraphId } = this.props;

    if (selectedGraphId) {
      await this.getGraphData(selectedGraphId);
      await this.getGraphFilters(selectedGraphId);
    }
  }

  onSelected = async (id) => {
    await this.getGraphData(id);
    await this.getGraphFilters(id);
    this.selectGraph(id);
  };

  selectGraph(id) {
    const { dispatch } = this.props;
    dispatch(selectGraph(id));
  }

  async getGraphFilters(id) {
    const { dispatch } = this.props;
    const filters = await getGraphFilters(id);

    if (filters) {
      dispatch(setNodeSizeFilterList(filters.nodeSizeOptions));
      dispatch(setNodeColorFilterList(filters.nodeColorOptions));
      dispatch(setLinkWidthFilterList(filters.linkWidthOptions));
      dispatch(setLinkColorFilterList(filters.linkColorOptions));

      dispatch(setNodeSizeFilter(filters.nodeSize));
      dispatch(setNodeColorFilter(filters.nodeColor));
      dispatch(setLinkWidthFilter(filters.linkWidth));
      dispatch(setLinkColorFilter(filters.linkColor));
    }
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
      const graph = await getGraph(id);

      if (graph) {
        dispatch(addGraph(id, graph));
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
        <GraphContainer />
        <GraphPanelContainer />
        {!selectedGraphId && <GraphLoader onSelected={this.onSelected} />}
        <NodeEditorContainer />
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
