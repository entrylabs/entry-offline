import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
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

function configureStore() {
    const store = createStore(persistCombinedReducer);
    const persistor = persistStore(store);
    return { store, persistor };
}

export default configureStore;
