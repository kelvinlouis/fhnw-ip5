import { connect } from 'react-redux';
import { getSelectedGraph } from '../reducers/graph';
import Graph from '../components/Graph/Graph';
import { selectNode } from '../actions';

const mapStateToProps = state => ({
  data: getSelectedGraph(state),
  nodeShowFullLabel: state.nodeShowFullLabel,
  filters: {
    nodeSize: state.nodeSizeFilter,
    nodeColor: state.nodeColorFilter,
    nodeEpoch: state.nodeEpoch,
    linkWidth: state.linkWidthFilter,
    linkColor: state.linkColorFilter,
  },
});

const mapDispatchToProps = dispatch => ({
  onNodeDoubleClick: (node, graph) => dispatch(selectNode(node, graph)),
});

const GraphContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Graph);

export default GraphContainer;
