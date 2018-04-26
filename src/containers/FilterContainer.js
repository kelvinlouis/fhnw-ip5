import { connect } from 'react-redux';
import {
  setNodeSizeFilter,
  setNodeColorFilter,
  setEdgeWidthFilter,
  setEdgeColorFilter,
} from '../actions';
import FilterPanel from '../components/FilterPanel';

const mapStateToProps = state => {
  return {
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
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onNodeSizeChange: value => dispatch(setNodeSizeFilter(value)),
    onNodeColorChange: value => dispatch(setNodeColorFilter(value)),
    onEdgeWidthChange: value => dispatch(setEdgeWidthFilter(value)),
    onEdgeColorChange: value => dispatch(setEdgeColorFilter(value)),
  }
};

const FilterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterPanel);

export default FilterContainer;
