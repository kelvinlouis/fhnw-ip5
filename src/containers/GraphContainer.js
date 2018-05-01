import { connect } from 'react-redux';
import { getSelectedGraph } from '../reducers/graph';
import Graph from '../components/Graph/Graph';
import { selectNode } from '../actions';

const mapStateToProps = state => ({
  data: getSelectedGraph(state),
  filters: {
    nodeSize: state.nodeSizeFilter,
    nodeColor: state.nodeColorFilter,
    edgeWidth: state.edgeWidthFilter,
    edgeColor: state.edgeColorFilter,
  },
});

const mapDispatchToProps = dispatch => ({
  onNodeDoubleClick: (node, links, targets) => dispatch(selectNode(node, links, targets)),
});

const GraphContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Graph);

export default GraphContainer;
