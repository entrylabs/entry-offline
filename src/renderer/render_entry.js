// render workspace

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import Index from './components/Index.jsx';

const store = configureStore();

ReactDom.render(
    (
        <Provider store={store}>
            <Index/>
        </Provider>
    ),
    document.getElementById('__next'),
);
