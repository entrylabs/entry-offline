import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import createElectronStorage from 'redux-persist-electron-storage';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';

// persist store configure
const persistConfig = {
    key: 'storage',
    storage: createElectronStorage(),
    stateReconciler: hardSet,
};
const persistCombinedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

function configureStore() {
    const store = createStore(persistCombinedReducer);
    const persistor = persistStore(store);
    return { store, persistor };
}

export default configureStore;
