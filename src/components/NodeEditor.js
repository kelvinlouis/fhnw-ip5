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
import { LinkPropTypes, NodePropTypes } from './propTypes';

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
  },
  notRemoved: {},
};

class NodeEditor extends React.Component {
  static propTypes = {
    node: NodePropTypes,
    links: PropTypes.arrayOf(LinkPropTypes),
    targets: PropTypes.arrayOf(NodePropTypes),
    open: PropTypes.bool,
    selectedGraphId: PropTypes.string,

    onClose: PropTypes.func,
    onSave: PropTypes.func,
  };

  static defaultProps = {
    node: null,
    targets: null,
    links: null,
    open: false,
    onClose: () => {},
    onSave: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      links: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const state = {
      ...prevState,
    };

    // Ensures no references in the store are manipulated
    if (nextProps.links) {
      state.links = nextProps.links.map(l => Object.assign({}, l));
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
    const { selectedGraphId, onSave } = this.props;
    const { links } = this.state;
    onSave(selectedGraphId, links.filter(l => l.changed || l.removed));
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
    const { classes, open, node, targets } = this.props;
    const { links } = this.state;
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
          <DialogTitle id="form-dialog-title">Knoten editieren</DialogTitle>
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
