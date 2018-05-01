import { connect } from 'react-redux';
import {
  setNodeSizeFilter,
  setNodeColorFilter,
  setLinkWidthFilter,
  setLinkColorFilter, clearSelectedGraph,
} from '../actions';
import GraphPanel from '../components/GraphPanel';
import { getSelectedGraph } from '../reducers/graph';

const mapStateToProps = state => ({
  // A list of all filters Array<String>
  nodeSizeList: state.nodeSizeFilterList,
  nodeColorList: state.nodeColorFilterList,
  linkWidthList: state.linkWidthFilterList,
  linkColorList: state.linkColorFilterList,

  // Selected filter
  nodeSize: state.nodeSizeFilter,
  nodeColor: state.nodeColorFilter,
  linkWidth: state.linkWidthFilter,
  linkColor: state.linkColorFilter,

  // Selected graph
  selectedGraph: getSelectedGraph(state),
});

const mapDispatchToProps = dispatch => ({
  onNodeSizeChange: (value, graphId) => dispatch(setNodeSizeFilter(value, graphId)),
  onNodeColorChange: (value, graphId) => dispatch(setNodeColorFilter(value, graphId)),
  onLinkWidthChange: (value, graphId) => dispatch(setLinkWidthFilter(value, graphId)),
  onLinkColorChange: (value, graphId) => dispatch(setLinkColorFilter(value, graphId)),
  onLoad: () => dispatch(clearSelectedGraph()),
});

const GraphPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphPanel);

export default GraphPanelContainer;
