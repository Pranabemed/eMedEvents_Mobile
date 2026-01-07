import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import { BrowseSpecialtyFailure, BrowseSpecialtySuccess } from '../Reducers/BrowsReducer';


let getItem = state => state.AuthReducer;
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

const watchFunction = [
  (function* () {
    yield takeLatest('Browse/BrowseSpecialtyRequest', BrowseSpecialtySaga);
  })(),
];

export default watchFunction;
