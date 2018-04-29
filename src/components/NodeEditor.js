import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import { LinkPropTypes, NodePropTypes } from './propTypes';

const styles = {
  dialog: {
    width: '650px',
  },
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

    if (nextProps.links) {
      state.links = nextProps.links.map(l => Object.assign({}, l));
    }

    return state;
  };

  close = () => {
    const { onClose } = this.props;
    onClose();
  };

  save = () => {
    const { selectedGraphId, onSave } = this.props;
    const { links } = this.state;
    onSave(selectedGraphId, links);
  };

  render() {
    const { classes, open, node, targets } = this.props;
    const { links } = this.state;
    console.log(open, node, targets, links);
    if (!open || !node || !links) return <div />;

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
            <Typography variant="subheading">Kanten zu</Typography>
            <List>
              {links.map(link => (
                <ListItem
                  key={link.target}
                  role={undefined}
                  dense
                  button
                >
                  1
                  {/*<ListItemText primary={`Line item ${value + 1}`} />*/}
                  {/*<ListItemSecondaryAction>*/}
                    {/*<IconButton aria-label="Comments">*/}
                      {/*<CommentIcon />*/}
                    {/*</IconButton>*/}
                  {/*</ListItemSecondaryAction>*/}
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
