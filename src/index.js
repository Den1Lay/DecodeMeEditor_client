import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';

import store from '@/store'

import { Base } from '@/pages';

import '@/styles/index.scss';

ReactDOM.render(
<Provider store={store}>
  <Base />
</Provider>, 
document.querySelector('#root'));
serviceWorker.unregister();