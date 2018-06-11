import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import DeleteIcon from '@material-ui/icons/Delete';
import { GraphPropTypes, NodePropTypes } from './propTypes';

const styles = {
  dialog: {
    'width': '650px',
  },
  subheader: {
    'margin': '1em 0 0.5em',
  },
  weight: {
    'min-width': '100px',
  },
  removed: {
    'text-decoration': 'line-through',
    'width': ' 70%',
  },
  notRemoved: {
    'width': ' 70%',
  },
};

function changeLinks(graph, changedLinks) {
  const { links } = graph;
  const newLinks = [];

  links.forEach((existingLink) => {
    const changedLink = changedLinks.find(l =>
      l.source === existingLink.source && l.target === existingLink.target);

    if (!changedLink) {
      // Existing link wasn't changed
      newLinks.push(existingLink);
    } else {
      if (changedLink.changed) {
        Object.assign(existingLink, {
          weight: changedLink.weight,
          absolute_weight: changedLink.absolute_weight,
          strengthen: changedLink.strengthen,
          weaken: changedLink.weaken,
        });
      }
    }
  });

  return {
    ...graph,
    links: newLinks,
  };
}

class NodeEditor extends React.Component {
  static propTypes = {
    node: NodePropTypes,
    graph: GraphPropTypes,
    open: PropTypes.bool,

    onClose: PropTypes.func,
    onSave: PropTypes.func,
  };

  static defaultProps = {
    node: null,
    graph: null,
    open: false,
    onClose: () => {},
    onSave: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      links: null,
      targets: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const state = {
      ...prevState,
    };

    // Ensures no references in the store are manipulated
    if (nextProps.graph && nextProps.node) {
      const { node, graph: { links, nodes } } = nextProps;

      // Looks for outgoing links and targets of the node
      const outgoingLinks = links.filter(l => l.source === node.id);
      state.links = outgoingLinks;
      state.targets = outgoingLinks.map(l => {
        return nodes.find(n => n.id === l.target);
      });
    }

    return state;
  };

  close = () => {
    const { onClose } = this.props;
    onClose();
  };

  /**
   * Only save links that were indeed modified (changed/removed).
   */
  save = () => {
    const { graph, onSave, onClose } = this.props;
    const { links } = this.state;
    const changedLinks = links.filter(l => l.changed || l.removed);

    if (changedLinks.length) {
      onSave(changeLinks(graph, changedLinks));
    } else {
      onClose();
    }
  };

  /**
   * Update the state (forces re-render)
   * @param link
   */
  markAsRemoved(link) {
    link.removed = !link.removed;

    this.setState({
      links: this.state.links,
    });
  }

  changeWeight(newWeight, link) {
    link.weight = +newWeight;
    link.weight_absolute = Math.abs(newWeight);
    link.changed = true;

    if (link.sign === 1) {
      link.strengthen = Math.abs(newWeight);
    } else {
      link.weaken = Math.abs(newWeight);
    }

    this.setState({
      links: this.state.links,
    });
  }

  render() {
    const { classes, open, node } = this.props;
    const { links, targets } = this.state;
    if (!open || !node || !links) return <div />;

    function getTargetLabel(id) {
      const target = targets.find(t => t.id === id);

      if (target) {
        return target.label;
      }

      return '';
    }

    return (
      <div>
        <Dialog
          open={open}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <DialogTitle id="form-dialog-title">Lebensereigniss editieren</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="label"
              label="Label"
              type="text"
              value={node.label}
              fullWidth
              disabled
            />
            <Typography className={classes.subheader} variant="subheading">Kanten zu</Typography>
            <List>
              {links.map(link => (
                <ListItem
                  key={link.target}
                  className={link.removed ? classes.removed : classes.notRemoved }
                >
                  <ListItemText>{getTargetLabel(link.target)}</ListItemText>
                  <ListItemSecondaryAction>
                    <TextField
                      id="weight"
                      value={link.weight}
                      type="number"
                      // label="Gewichtung"
                      className={classes.weight}
                      onChange={(event) => this.changeWeight(event.target.value, link)}
                      inputProps={{
                        min: link.sign === 1 ? 1 : -2,
                        max: link.sign === 1 ? 2 : -1,
                      }}
                    />
                    <IconButton onClick={() => this.markAsRemoved(link)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} color="primary">
              Schliessen
            </Button>
            <Button onClick={this.save} color="primary">
              Speichern
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(NodeEditor);
