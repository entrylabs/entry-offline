import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import createElectronStorage from 'redux-persist-electron-storage';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

// persist store configure
const persistConfig = {
    key: 'storage', // identifier for persist
    storage,
    // stateReconciler: hardSet, // https://github.com/rt2zz/redux-persist#state-reconciler
    whitelist: ['common'], // only this reducer key will be persisted
};
const persistCombinedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

function configureStore() {
    const store = createStore(persistCombinedReducer);
    const persistor = persistStore(store);
    return { store, persistor };
}

export default configureStore;
