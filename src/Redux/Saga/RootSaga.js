/**
 * Root saga Redux-Saga module. Coordinates side effects, API calls, and watcher registration for root. Exported members: combinedSaga.
 */

import { all } from 'redux-saga/effects';
import AuthSaga from './AuthSaga';
import DashboardSaga from './Dashboardsaga';
import CMESaga from './CMESaga';
import CreditVaultSaga from './CreditVaultSaga';
import WebcastSaga from './WebcastSaga';
import GuestSaga from './GuestSaga';
import CMECEExpensSaga from './CMECEExpensSaga';
import TransSaga from './TransSaga';
import ProfileSaga from './ProfileSaga';
import BrowseSaga from './BrowseSaga';
/**
 * Combined saga array.
 * @returns {Array}
 */
const combinedSaga = [...AuthSaga,...DashboardSaga,...CMESaga,...CreditVaultSaga,...WebcastSaga,...GuestSaga,...CMECEExpensSaga,...TransSaga,...ProfileSaga,...BrowseSaga];

/**
 * Root saga default export.
 *
 * @returns {*}
 */
export default function* RootSaga() {
  yield all(combinedSaga);
}