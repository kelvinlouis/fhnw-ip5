import { connect } from 'react-redux';
import NodeEditor from '../components/NodeEditor';
import { changeNodeLinks, closeNodeEditor } from '../actions';

const mapStateToProps = state => ({
  node: state.nodeEditor.node,
  links: state.nodeEditor.links,
  targets: state.nodeEditor.targets,
  open: state.nodeEditor.open,
  selectedGraphId: state.selectedGraphId
});

const mapDispatchToProps = dispatch => ({
  onSave: (graphId, links) => dispatch(changeNodeLinks(graphId, links)),
  onClose: () => dispatch(closeNodeEditor()),
});

const NodeEditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeEditor);

export default NodeEditorContainer;
