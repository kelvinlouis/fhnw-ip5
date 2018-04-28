import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import GraphLoaderSelect from './GraphLoaderSelect';

const styles = {
  container: {
    'width': '100%',
    'height': '100%',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'background': 'rgba(0, 0, 0, 0.1)',
  },
  card: {
    'width': '650px',
    'overflow': 'visible',
  },
  title: {
    'margin-bottom': '1.25em',
  },
  content: {
    'height': '120px',
    'overflow': 'visible',
  },
  actions: {
    'justify-content': 'space-between',
  },
};

const graphs = [
  { value: 'kelvin-test.json', label: 'kelvin-test.json' },
  { value: 'lukas-test.json', label: 'lukas-test.json' },
  { value: 'melanie-test.json', label: 'melanie-test.json' },
  { value: 'graph.json', label: 'graph.json' },
];

/**
 * Allows the user to select from a list of stored
 * graphs. Once selected, the graph will be loaded and displayed.
 */
class GraphLoader extends Component {
  static propTypes = {
    onSelected: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    // Stores the selected option from the
    // list.
    this.state = {
      selected: null,
    }
  }

  /**
   * Triggered on value selection of select box.
   * @param value
   */
  onSelected = value => {
    this.setState({ selected: value });
  };

  load = () => {
    const { onSelected } = this.props;
    onSelected(this.state.selected);
  };

  render() {
    const {
      classes,
    } = this.props;

    return (
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Typography variant="title" className={classes.title}>
              Graph Laden
            </Typography>
            <GraphLoaderSelect
              id="graph-loader-select"
              options={graphs}
              onSelected={this.onSelected}
            />
          </CardContent>
          <CardActions className={classes.actions}>
            <span />
            <Button color="primary" disabled={!this.state.selected} onClick={this.load}>Laden</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(GraphLoader);
