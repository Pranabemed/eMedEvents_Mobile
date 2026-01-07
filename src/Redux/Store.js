import createSagaMiddleware from 'redux-saga'
import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import AuthReducer from './Reducers/AuthReducer'
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

let sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware, logger]
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
})
sagaMiddleware.run(RootSaga);