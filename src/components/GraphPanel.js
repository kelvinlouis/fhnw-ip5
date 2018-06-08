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
import IconButton from 'material-ui/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { FormControlLabel, FormLabel, FormControl } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import indigo from 'material-ui/colors/indigo';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

import FilterSelect from '../components/FilterSelect';

const styles = {
  controlContainer: {
    'flex-flow': 'wrap',
  },
  button: {
    'margin': '0 0.25em',
  },
  sliderFormControl: {
    'width': '100%',
    'margin': '0.25em 0',
  },
  sliderFormControlLabel: {
    'font-size': '0.8rem',
    'margin-bottom': '0.5em',
  },
  sliderContainer: {
    'display': 'inline-flex',
    'align-items': 'center',
  },
  playButton: {
    'height': '24px',
    'width': '24px',
    'font-size': '0.8rem',
    'margin':'0 0 0 1.5em',
  },
  sliderHandle: {
    'borderColor': indigo['500'],
  },
  sliderTrack: {
    'backgroundColor': indigo['300'],
  },
  dot: {
    'borderColor': indigo['300'],
  },
  activeDot: {
    'borderColor': indigo['300'],
  }
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

    nodeEpoch: PropTypes.number.isRequired,
    nodeEpochs: PropTypes.number.isRequired,

    onNodeSizeChange: PropTypes.func.isRequired,
    onNodeColorChange: PropTypes.func.isRequired,
    onNodeShowFullLabelChange: PropTypes.func.isRequired,
    onLinkWidthChange: PropTypes.func.isRequired,
    onLinkColorChange: PropTypes.func.isRequired,
    onNodeEpochChange: PropTypes.func.isRequired,

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

  onNameChange = event => {
    this.setState({ name: event.target.value });
  };

  onSliderEpochChange = value => {
    const { onNodeEpochChange, selectedGraph } = this.props;
    onNodeEpochChange(value, selectedGraph.id);
  };

  onPlayClick = () => {
    const {
      onNodeEpochChange,
      nodeEpoch,
      nodeEpochs,
      selectedGraph,
    } = this.props;

    let activeEpoch = nodeEpoch >= nodeEpochs ? -1 : nodeEpoch;

    const interval = setInterval(() => {
        onNodeEpochChange(++activeEpoch, selectedGraph.id);

        if (activeEpoch >= nodeEpochs) {
          clearInterval(interval);
        }
    }, 1000);
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

      nodeEpoch,
      nodeEpochs,

      selectedGraph,
    } = this.props;

    const { name } = this.state;

    return (
      <div className="GraphPanel">
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Lebensereignisse</Typography>
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
            {nodeColor === 'influence' && (
              <FormControl className={classes.sliderFormControl}>
                <FormLabel className={classes.sliderFormControlLabel}>Einfluss über Zeit</FormLabel>
                <div className={classes.sliderContainer}>
                  <Slider
                    onChange={this.onSliderEpochChange}
                    max={nodeEpochs}
                    value={nodeEpoch}
                    dots={true}
                    handleStyle={styles.sliderHandle}
                    trackStyle={styles.sliderTrack}
                    dotStyle={styles.dot}
                    activeDotStyle={styles.activeDot}
                  />
                  <IconButton className={classes.playButton} aria-label="Play" color="primary">
                    <PlayIcon onClick={this.onPlayClick} />
                  </IconButton>
                </div>
              </FormControl>
            )}

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
        {selectedGraph && <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Lebensführungssystem</Typography>
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
