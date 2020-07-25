import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
//makeMiddleware, that catch game actions and make req to server;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const randomMiddleware = store => next => action => {
  console.log("STORE:", store);
  console.log("ACTION:", action);
  console.log("NEXT:",next);
  action.random = Math.random();
  next(action)
}

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, randomMiddleware)))

export default store