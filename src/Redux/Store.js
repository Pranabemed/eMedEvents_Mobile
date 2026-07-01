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
import AuthReducer from './Reducers/AuthReducer';
import RootSaga from './Saga/RootSaga';
import DashboardReducer from './Reducers/DashboardReducer';
import CMEReducer from './Reducers/CMEReducer';
import CreditVaultReducer from './Reducers/CreditVaultReducer';
import WebcastReducer from './Reducers/WebcastReducer';
import GuestReducer from './Reducers/GuestReducer';
import CMECEExpensReducer from './Reducers/CMECEExpensReducer';
import TransReducer from './Reducers/TransReducer';
import ProfileReducer from './Reducers/ProfileReducer';
import BrowsReducer from './Reducers/BrowsReducer';

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
    reducer: {
        AuthReducer: AuthReducer,
        DashboardReducer:DashboardReducer,
        CMEReducer:CMEReducer,
        CreditVaultReducer:CreditVaultReducer,
        WebcastReducer: WebcastReducer,
        GuestReducer:GuestReducer,
        CMECEExpensReducer:CMECEExpensReducer,
        TransReducer:TransReducer,
        ProfileReducer:ProfileReducer,
        BrowsReducer:BrowsReducer
    },
    middleware
});
sagaMiddleware.run(RootSaga);
