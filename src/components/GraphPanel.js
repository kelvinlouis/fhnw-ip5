import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import FilterSelect from '../components/FilterSelect';

const styles = {
  controlContainer: {
    'flex-flow': 'wrap',
  },
  button: {
    'margin': '0 0.25em',
  },
};

class GraphPanel extends Component {
  static propTypes = {
    nodeSizeList: PropTypes.arrayOf(PropTypes.string).isRequired,
    nodeColorList: PropTypes.arrayOf(PropTypes.string).isRequired,
    linkWidthList: PropTypes.arrayOf(PropTypes.string).isRequired,
    linkColorList: PropTypes.arrayOf(PropTypes.string).isRequired,

    nodeSize: PropTypes.string.isRequired,
    nodeColor: PropTypes.string.isRequired,
    nodeShowFullLabel: PropTypes.bool.isRequired,
    linkWidth: PropTypes.string.isRequired,
    linkColor: PropTypes.string.isRequired,

    onNodeSizeChange: PropTypes.func.isRequired,
    onNodeColorChange: PropTypes.func.isRequired,
    onNodeShowFullLabelChange: PropTypes.func.isRequired,
    onLinkWidthChange: PropTypes.func.isRequired,
    onLinkColorChange: PropTypes.func.isRequired,

    onLoad: PropTypes.func.isRequired,

    selectedGraph: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);

    if (props.selectedGraph) {
      this.state = {
        name: props.selectedGraph.name,
      }
    } else {
      this.state = {
        name: '',
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedGraph) {
      return {
        name: nextProps.selectedGraph.name,
      };
    }

    return prevState;
  }

  onNameChange = event => {
    this.setState({ name: event.target.value });
  };

  save = event => {
    const { onSave, selectedGraph, nodeSize, nodeColor, linkWidth, linkColor } = this.props;
    const { name } = this.state;
    const newGraph = {
      ...selectedGraph,
      name,
    };

    // Remove ID
    delete newGraph.id;

    onSave(newGraph, {
      nodeSize,
      nodeColor,
      linkWidth,
      linkColor,
    });
  };

  load = event => {
    const { onLoad } = this.props;
    onLoad();
  };

  handleSwitchLabelChange = event => {
    const { onNodeShowFullLabelChange } = this.props;

    onNodeShowFullLabelChange(event.target.checked);
  };

  render() {
    const {
      classes,
      nodeSizeList,
      nodeColorList,
      linkWidthList,
      linkColorList,

      nodeSize,
      nodeColor,
      nodeShowFullLabel,
      linkWidth,
      linkColor,

      onNodeSizeChange,
      onNodeColorChange,
      onLinkWidthChange,
      onLinkColorChange,

      selectedGraph,
    } = this.props;

    const { name } = this.state;

    return (
      <div className="GraphPanel">
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
              onChange={(value) => onNodeSizeChange(value, selectedGraph.id)}
            />
            <FilterSelect
              id="nodeColor"
              label="Farbe"
              list={nodeColorList}
              value={nodeColor}
              onChange={(value) => onNodeColorChange(value, selectedGraph.id)}
            />
            {/*<FilterSelect id="nodeCycle" label="Zyklen" list={nodeSizeColors} value={} onChange={} />*/}
            <FormControlLabel
              control={
                <Switch
                  checked={nodeShowFullLabel}
                  onChange={this.handleSwitchLabelChange}
                  color="primary"
                />
              }
              label="Ganze Beschriftung anzeigen"
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Kanten</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.controlContainer}>
            <FilterSelect
              id="linkWidth"
              label="Stärke"
              list={linkWidthList}
              value={linkWidth}
              onChange={(value) => onLinkWidthChange(value, selectedGraph.id)}
            />
            <FilterSelect
              id="linkColor"
              label="Farbe"
              list={linkColorList}
              value={linkColor}
              onChange={(value) => onLinkColorChange(value, selectedGraph.id)}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {selectedGraph && <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Graph</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.controlContainer}>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="id"
                label="ID"
                fullWidth
                value={selectedGraph.id}
                disabled
                margin="normal"
              />
              <TextField
                id="name"
                label="Name"
                fullWidth
                value={name}
                onChange={this.onNameChange}
                margin="normal"
              />
              <Button
                variant="raised"
                color="primary"
                className={classes.button}
                onClick={this.save}>
                Speichern
              </Button>
              <Button
                variant="raised"
                color="primary"
                className={classes.button}
                onClick={this.load}>
                Laden...
              </Button>
            </form>
          </ExpansionPanelDetails>
        </ExpansionPanel>}
      </div>
    );
  }
}

export default withStyles(styles)(GraphPanel);
