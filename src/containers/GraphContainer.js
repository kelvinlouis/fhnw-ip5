import { connect } from 'react-redux';
import Graph from '../components/Graph/Graph';

const mapStateToProps = state => {
  return {
    data: state.selectedGraph,
  }
};

const GraphContainer = connect(mapStateToProps)(Graph);

export default GraphContainer;
