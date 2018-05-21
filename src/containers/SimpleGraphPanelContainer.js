import { connect } from 'react-redux';
import {
  setNodeSizeFilter,
  setNodeColorFilter,
  setLinkWidthFilter,
  setLinkColorFilter,
  clearSelectedGraph,
  addGraph,
  selectGraph,
  setNodeShowFullLabel,
  setNodeEpoch,
} from '../actions';
import SimpleGraphPanel from '../components/SimpleGraphPanel';
import { getSelectedGraph } from '../reducers/graph';
import { createGraph, saveGraphFilters } from '../ApiService';

const mapStateToProps = state => ({
  // A list of all filters Array<String>
  nodeSizeList: [
    {
      value: 'out_degree_weight_absolute',
      label: 'Beeinflusst Ereignisse',
    },
    {
      value: 'in_degree_weight_absolute',
      label: 'Von Ereignissen beeinflusst',
    }
  ],
  nodeColorList: state.nodeColorFilterList,
  nodeShowFullLabel: state.nodeShowFullLabel,

  // Selected filter
  nodeSize: state.nodeSizeFilter,
  nodeColor: state.nodeColorFilter,

  nodeEpoch: state.nodeEpoch,
  nodeEpochs: state.nodeEpochs,

  // Selected graph
  selectedGraph: getSelectedGraph(state),
});

const mapDispatchToProps = dispatch => ({
  onNodeSizeChange: (value, graphId) => dispatch(setNodeSizeFilter(value, graphId)),
  onNodeColorChange: (value, graphId) => dispatch(setNodeColorFilter(value, graphId)),
  onNodeShowFullLabelChange: (show) => dispatch(setNodeShowFullLabel(show)),
  onLinkWidthChange: (value, graphId) => dispatch(setLinkWidthFilter(value, graphId)),
  onLinkColorChange: (value, graphId) => dispatch(setLinkColorFilter(value, graphId)),
  onNodeEpochChange: (value, graphId) => dispatch(setNodeEpoch(value, graphId)),

  onLoad: () => dispatch(clearSelectedGraph()),
  onSave: async (graph, filters) => {
    const newGraph = await createGraph(graph);
    await saveGraphFilters(newGraph.id, filters);
    dispatch(addGraph(newGraph.id, newGraph));
    dispatch(selectGraph(newGraph.id));
  },
});

const SimpleGraphPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SimpleGraphPanel);

export default SimpleGraphPanelContainer;
