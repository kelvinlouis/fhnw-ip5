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

    onLoad: PropTypes.func.isRequired,

    selectedGraph: PropTypes.shape({
      id: PropTypes.string,
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
    // fetch(`${process.env.BACKEND_URL}/graph`, {
    //   // body: JSON.stringify(data), // must match 'Content-Type' header
    //   cache: 'no-cache',
    //   credentials: 'same-origin',
    //   headers: {
    //     'content-type': 'application/json'
    //   },
    //   method: 'POST',
    //   mode: 'cors',
    // })
  };

  load = event => {
    const { onLoad } = this.props;
    onLoad();
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
              onChange={(value) => onEdgeWidthChange(value, selectedGraph.id)}
            />
            <FilterSelect
              id="edgeColor"
              label="Farbe"
              list={edgeColorList}
              value={edgeColor}
              onChange={(value) => onEdgeColorChange(value, selectedGraph.id)}
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
