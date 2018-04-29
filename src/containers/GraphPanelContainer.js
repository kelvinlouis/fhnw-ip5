import { connect } from 'react-redux';
import {
  setNodeSizeFilter,
  setNodeColorFilter,
  setEdgeWidthFilter,
  setEdgeColorFilter, clearSelectedGraph,
} from '../actions';
import GraphPanel from '../components/GraphPanel';
import { getSelectedGraph } from '../reducers/graph';

const mapStateToProps = state => ({
  // A list of all filters Array<String>
  nodeSizeList: state.nodeSizeFilterList,
  nodeColorList: state.nodeColorFilterList,
  edgeWidthList: state.edgeWidthFilterList,
  edgeColorList: state.edgeColorFilterList,

  // Selected filter
  nodeSize: state.nodeSizeFilter,
  nodeColor: state.nodeColorFilter,
  edgeWidth: state.edgeWidthFilter,
  edgeColor: state.edgeColorFilter,

  // Selected graph
  selectedGraph: getSelectedGraph(state),
});

const mapDispatchToProps = dispatch => ({
  onNodeSizeChange: (value, graphId) => dispatch(setNodeSizeFilter(value, graphId)),
  onNodeColorChange: (value, graphId) => dispatch(setNodeColorFilter(value, graphId)),
  onEdgeWidthChange: (value, graphId) => dispatch(setEdgeWidthFilter(value, graphId)),
  onEdgeColorChange: (value, graphId) => dispatch(setEdgeColorFilter(value, graphId)),
  onLoad: () => dispatch(clearSelectedGraph()),
});

const GraphPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphPanel);

export default GraphPanelContainer;
