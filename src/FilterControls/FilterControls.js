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

const styles = {
  controlContainer: {
    'flex-flow': 'wrap'
  },
  formControl: {
    'width': '100%',
  },
};

class FilterControls extends Component {
  static propTypes = {
    onFilterChange: PropTypes.fn,
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
      edgeWeight: '',
      edgeColor: '',
    };
  }

  changeNodeSize = event => {
    console.log('changeNodeSize', event);
  };

  changeNodeColor = event => {
    console.log('changeNodeColor', event);
  };

  changeNodeCycle = event => {
    console.log('changeNodeCycle', event);
  };

  changeEdgeWeight = event => {
    console.log('changeEdgeWeight', event);
  };

  changeEdgeColor = event => {
    console.log('changeEdgeColor', event);
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
                <MenuItem value="">None</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
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
                <MenuItem value="">None</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
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
              <InputLabel htmlFor="edgeWeight">Stärke</InputLabel>
              <Select
                value={this.state.edgeWeight}
                onChange={this.changeEdgeWeight}
                inputProps={{
                  name: 'edgeWeight',
                  id: 'edgeWeight',
                }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
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
                <MenuItem value="">None</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(FilterControls);
