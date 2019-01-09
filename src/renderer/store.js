import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

function configureStore() {
    const store = createStore(reducer, {});
    return store;
}

export default configureStore;
