import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  createEdgeColorEvent,
  createEdgeWidthEvent,
  createNodeColorEvent,
  createNodeeCycleEvent,
  createNodeSizeEvent
} from './FilterEvent';

const nodeSizeAttributes = [
  'degree_weight',
  'in_degree_weight',
  'out_degree_weight',
  'degree_weight_absolute',
  'in_degree_weight_absolute',
  'out_degree_weight_absolute',
  'degree_strengthen',
  'in_degree_strengthen',
  'out_degree_strengthen',
  'degree_weaken',
  'in_degree_weaken',
  'out_degree_weaken',
  'degree',
  'in_degree',
  'out_degree',
];

const nodeSizeColors = [
  'influence',
  'actionSystem',
];

const edgeWidths = [
  'weight',
  'weight_absolute',
  'strengthen',
  'weaken',
];

const edgeColors = [
  'sign',
];

const styles = {
  controlContainer: {
    'flex-flow': 'wrap',
  },
  formControl: {
    'width': '100%',
    'margin-bottom': '1em',
  },
};

class FilterControls extends Component {
  static propTypes = {
    onFilterChange: PropTypes.func,
  };

  static defaultProps = {
    onFilterChange: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      nodeSize: '',
      nodeColor: '',
      nodeCycle: '',
      edgeWidth: '',
      edgeColor: '',
    };
  }

  changeNodeSize = event => {
    const { onFilterChange } = this.props;
    const newValue = event.target.value;
    onFilterChange(createNodeSizeEvent(newValue));
    this.setState({ nodeSize: newValue });
  };

  changeNodeColor = event => {
    const { onFilterChange } = this.props;
    const newValue = event.target.value;
    onFilterChange(createNodeColorEvent(newValue));
    this.setState({ nodeColor: newValue });
  };

  changeNodeCycle = event => {
    const { onFilterChange } = this.props;
    const newValue = event.target.value;
    onFilterChange(createNodeeCycleEvent(newValue));
    this.setState({ nodeCycle: newValue });
  };

  changeEdgeWidth = event => {
    const { onFilterChange } = this.props;
    const newValue = event.target.value;
    onFilterChange(createEdgeWidthEvent(newValue));
    this.setState({ edgeWidth: newValue });
  };

  changeEdgeColor = event => {
    const { onFilterChange } = this.props;
    const newValue = event.target.value;
    onFilterChange(createEdgeColorEvent(newValue));
    this.setState({ edgeColor: newValue });
  };

  render() {
    const { props } = this;

    return (
      <div className="FilterControls">
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Knoten</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={props.classes.controlContainer}>
            <FormControl className={props.classes.formControl}>
              <InputLabel htmlFor="nodeSize">Grösse</InputLabel>
              <Select
                value={this.state.nodeSize}
                onChange={this.changeNodeSize}
                inputProps={{
                  name: 'nodeSize',
                  id: 'nodeSize',
                }}
              >
                <MenuItem value="">-</MenuItem>
                {nodeSizeAttributes.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl className={props.classes.formControl}>
              <InputLabel htmlFor="nodeColor">Farbe</InputLabel>
              <Select
                value={this.state.nodeColor}
                onChange={this.changeNodeColor}
                inputProps={{
                  name: 'nodeColor',
                  id: 'nodeColor',
                }}
              >
                <MenuItem value="">-</MenuItem>
                {nodeSizeColors.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl className={props.classes.formControl}>
              <InputLabel htmlFor="nodeCycle">Zyklen</InputLabel>
              <Select
                value={this.state.nodeCycle}
                onChange={this.changeNodeCycle}
                inputProps={{
                  name: 'nodeCycle',
                  id: 'nodeCycle',
                }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Kanten</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={props.classes.controlContainer}>
            <FormControl className={props.classes.formControl}>
              <InputLabel htmlFor="edgeWidth">Stärke</InputLabel>
              <Select
                value={this.state.edgeWidth}
                onChange={this.changeEdgeWidth}
                inputProps={{
                  name: 'edgeWidth',
                  id: 'edgeWidth',
                }}
              >
                <MenuItem value="">-</MenuItem>
                {edgeWidths.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl className={props.classes.formControl}>
              <InputLabel htmlFor="edgeColor">Farbe</InputLabel>
              <Select
                value={this.state.edgeColor}
                onChange={this.changeEdgeColor}
                inputProps={{
                  name: 'edgeColor',
                  id: 'edgeColor',
                }}
              >
                <MenuItem value="">-</MenuItem>
                {edgeColors.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
              </Select>
            </FormControl>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(FilterControls);
