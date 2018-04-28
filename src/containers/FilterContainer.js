import { connect } from 'react-redux';
import {
  setNodeSizeFilter,
  setNodeColorFilter,
  setEdgeWidthFilter,
  setEdgeColorFilter,
} from '../actions';
import FilterPanel from '../components/FilterPanel';

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

  // Selected graph (id)
  selectedGraphId: state.selectedGraphId,
});

const mapDispatchToProps = dispatch => ({
  onNodeSizeChange: (value, graphId) => dispatch(setNodeSizeFilter(value, graphId)),
  onNodeColorChange: (value, graphId) => dispatch(setNodeColorFilter(value, graphId)),
  onEdgeWidthChange: (value, graphId) => dispatch(setEdgeWidthFilter(value, graphId)),
  onEdgeColorChange: (value, graphId) => dispatch(setEdgeColorFilter(value, graphId)),
});

const FilterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterPanel);

export default FilterContainer;
