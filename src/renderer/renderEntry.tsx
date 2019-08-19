// render workspace

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store';
import Index from './components/Index';

import IpcRendererHelper from './helper/ipcRendererHelper';

const { store, persistor } = configureStore();

IpcRendererHelper.onPageLoaded(() => {
    ReactDom.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Index />
            </PersistGate>
        </Provider>,
        document.getElementById('__next')
    );
});
