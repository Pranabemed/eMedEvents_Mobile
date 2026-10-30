/**
 * Redux store configuration.
 *
 * Combines all reducers, sets up redux-saga middleware, and applies
 * redux-logger.
 *
 * @module Store
 */
import createSagaMiddleware from 'redux-saga';
import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import RootSaga from './Saga/RootSaga';
import rootReducer from './Reducers/RootReducer';

/**
 * Saga middleware instance used by the store.
 *
 * @type {import('redux-saga').SagaMiddleware}
 */
let sagaMiddleware = createSagaMiddleware();
/**
 * Default middleware stack for the store.
 *
 * @type {Array<import('redux').Middleware>}
 */
const middleware = [sagaMiddleware, logger];

/**
 * Main Redux store for the application.
 *
 * Contains the root reducer combining auth, dashboard, CME, credit vault,
 * webcast, guest, transaction, profile, and browse state.
 *
 * @type {import('@reduxjs/toolkit').EnhancedStore}
 */
export default configureStore({
    reducer: rootReducer,
    middleware
});
sagaMiddleware.run(RootSaga);
