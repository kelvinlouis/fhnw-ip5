import { connect } from 'react-redux';
import NodeEditor from '../components/NodeEditor';
import { updateGraph, closeNodeEditor } from '../actions';
import { createGraphSnapshot } from '../ApiService';

const mapStateToProps = state => ({
  node: state.nodeEditor.node,
  graph: state.nodeEditor.graph,
  open: state.nodeEditor.open,
});

const mapDispatchToProps = dispatch => ({
  onSave: async (graph) => {
    const snapshot = await createGraphSnapshot(graph.id, graph);
    dispatch(updateGraph(snapshot.id, snapshot));
    dispatch(closeNodeEditor());
  },
  onClose: () => dispatch(closeNodeEditor()),
});

const NodeEditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeEditor);

export default NodeEditorContainer;
