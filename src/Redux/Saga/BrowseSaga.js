/**
 * Browse saga Redux-Saga module. Coordinates side effects, API calls, and watcher registration for browse. Exported members: getItem, BrowseSpecialtySaga, watchFunction.
 */

import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import { BrowseSpecialtyFailure, BrowseSpecialtySuccess } from '../Reducers/BrowsReducer';


/**
 * Selects the AuthReducer slice for `BrowseSpecialtySaga`.
 *
 * @function getItem
 * @param {Object} state - Root Redux state.
 * @returns {Object} Auth slice state.
 */
let getItem = state => state.AuthReducer;
/**
 * Handles the `Browse/BrowseSpecialtyRequest` action.
 *
 * @function BrowseSpecialtySaga
 * @param {Object} action - Browse specialty request action.
 * @returns {Generator}
 */
export function* BrowseSpecialtySaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, `BrowseByCategory/${action?.payload?.apikey}`, action?.payload?.appurl, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(BrowseSpecialtySuccess(response?.data));
    } else {
      yield put(BrowseSpecialtyFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(BrowseSpecialtyFailure(error));
  }
}

/**
 * Registers the browse saga watcher list.
 *
 * @function watchFunction
 * @returns {Array<Generator>} Saga watcher instances.
 */
const watchFunction = [
  (function* () {
    yield takeLatest('Browse/BrowseSpecialtyRequest', BrowseSpecialtySaga);
  })(),
];

/**
 * Browse saga default export.
 *
 * @returns {*}
 */
export default watchFunction;
