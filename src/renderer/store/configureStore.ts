import modules from './modules';
import { createStore } from 'redux';

export default function configureStore() {
    return createStore(
        modules, /* preloadedState, */
    );
}
