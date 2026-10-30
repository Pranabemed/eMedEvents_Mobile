import { combineReducers } from '@reduxjs/toolkit';
import AuthReducer from './AuthReducer';
import DashboardReducer from './DashboardReducer';
import CMEReducer from './CMEReducer';
import CreditVaultReducer from './CreditVaultReducer';
import WebcastReducer from './WebcastReducer';
import GuestReducer from './GuestReducer';
import CMECEExpensReducer from './CMECEExpensReducer';
import TransReducer from './TransReducer';
import ProfileReducer from './ProfileReducer';
import BrowsReducer from './BrowsReducer';

const combinedReducer = combineReducers({
  AuthReducer, DashboardReducer, CMEReducer, CreditVaultReducer,
  WebcastReducer, GuestReducer, CMECEExpensReducer, TransReducer,
  ProfileReducer, BrowsReducer,
});

export default function rootReducer(state, action) {
  // Account data lives in every slice, not only Auth. Keep the logout action
  // so navigation can react after all slices have been reset together.
  return combinedReducer(action.type === 'Auth/logoutSuccess' ? undefined : state, action);
}
