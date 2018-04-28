import { connect } from 'react-redux';
import { getSelectedGraph } from '../reducers/graph';
import Graph from '../components/Graph/Graph';

const mapStateToProps = state => ({
  data: getSelectedGraph(state),
});

const GraphContainer = connect(mapStateToProps)(Graph);

export default GraphContainer;
