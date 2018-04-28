import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilterSelect from '../components/FilterSelect';

const styles = {
  controlContainer: {
    'flex-flow': 'wrap',
  },
};

class FilterPanel extends Component {
  static propTypes = {
    nodeSizeList: PropTypes.arrayOf(PropTypes.string).isRequired,
    nodeColorList: PropTypes.arrayOf(PropTypes.string).isRequired,
    edgeWidthList: PropTypes.arrayOf(PropTypes.string).isRequired,
    edgeColorList: PropTypes.arrayOf(PropTypes.string).isRequired,

    nodeSize: PropTypes.string.isRequired,
    nodeColor: PropTypes.string.isRequired,
    edgeWidth: PropTypes.string.isRequired,
    edgeColor: PropTypes.string.isRequired,

    onNodeSizeChange: PropTypes.func.isRequired,
    onNodeColorChange: PropTypes.func.isRequired,
    onEdgeWidthChange: PropTypes.func.isRequired,
    onEdgeColorChange: PropTypes.func.isRequired,

    selectedGraphId: PropTypes.string,
  };

  render() {
    const {
      classes,
      nodeSizeList,
      nodeColorList,
      edgeWidthList,
      edgeColorList,

      nodeSize,
      nodeColor,
      edgeWidth,
      edgeColor,

      onNodeSizeChange,
      onNodeColorChange,
      onEdgeWidthChange,
      onEdgeColorChange,

      selectedGraphId,
    } = this.props;

    return (
      <div className="FilterPanel">
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Knoten</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.controlContainer}>
            <FilterSelect
              id="nodeSize"
              label="Grösse"
              list={nodeSizeList}
              value={nodeSize}
              onChange={(value) => onNodeSizeChange(value, selectedGraphId)}
            />
            <FilterSelect
              id="nodeColor"
              label="Farbe"
              list={nodeColorList}
              value={nodeColor}
              onChange={(value) => onNodeColorChange(value, selectedGraphId)}
            />
            {/*<FilterSelect id="nodeCycle" label="Zyklen" list={nodeSizeColors} value={} onChange={} />*/}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Kanten</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.controlContainer}>
            <FilterSelect
              id="edgeWidth"
              label="Stärke"
              list={edgeWidthList}
              value={edgeWidth}
              onChange={(value) => onEdgeWidthChange(value, selectedGraphId)}
            />
            <FilterSelect
              id="edgeColor"
              label="Farbe"
              list={edgeColorList}
              value={edgeColor}
              onChange={(value) => onEdgeColorChange(value, selectedGraphId)}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(FilterPanel);
