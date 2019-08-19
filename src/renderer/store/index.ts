import { createStore, Dispatch } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers, { IStoreState } from './modules';

// persist store configure
const persistConfig = {
    key: 'storage', // identifier for persist
    storage,
    // stateReconciler: hardSet, // https://github.com/rt2zz/redux-persist#state-reconciler
    whitelist: ['persist'], // only 'persist' named reducer will be persisted
};
const persistCombinedReducer = persistReducer(persistConfig, reducers);

function configureStore() {
    const store = createStore(persistCombinedReducer);
    const persistor = persistStore(store);
    return { store, persistor };
}

export type IMapStateToProps<T> = (state : IStoreState) => T;
export type IMapDispatchToProps<T> = (dispatch: Dispatch) => T;
export default configureStore;
