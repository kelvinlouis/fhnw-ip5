import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './index.css';
import App from './App';
import rootReducer from './reducers';
import registerServiceWorker from './registerServiceWorker';

import {
  setNodeSizeFilterList,
  setNodeColorFilterList,
  setLinkWidthFilterList,
  setLinkColorFilterList,
} from './actions';

const store = createStore(rootReducer);

store.dispatch(setNodeSizeFilterList([
  'degree_weight',
  'in_degree_weight',
  'out_degree_weight',
  'degree_weight_absolute',
  'in_degree_weight_absolute',
  'out_degree_weight_absolute',
  'degree_strengthen',
  'in_degree_strengthen',
  'out_degree_strengthen',
  'degree_weaken',
  'in_degree_weaken',
  'out_degree_weaken',
  'degree',
  'in_degree',
  'out_degree',
]));

store.dispatch(setNodeColorFilterList([
  'influence',
  'actionSystem',
]));

store.dispatch(setLinkWidthFilterList([
  'weight',
  'weight_absolute',
  'strengthen',
  'weaken',
]));

store.dispatch(setLinkColorFilterList(['sign']));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();
