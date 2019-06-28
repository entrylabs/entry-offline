// render workspace

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store';
import Index from './components/Index.jsx';

import IpcRendererHelper from './helper/ipcRendererHelper';
import ThemeSelector from './helper/themeSelector';

const { store, persistor } = configureStore();

store.subscribe(() => {
    console.log('reduxStore Changed => ', store.getState());
});
IpcRendererHelper.onPageLoaded(async () => {
    await ThemeSelector.overrideTheme();
    ReactDom.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Index />
            </PersistGate>
        </Provider>,
        document.getElementById('__next')
    );
});
