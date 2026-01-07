import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import { HomelistFailure, HomelistSuccess } from '../Reducers/GuestReducer';


let getItem = state => state.AuthReducer;
export function* HomelistSaga(action) {
  console.log('hi');
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'Home/list', action.payload, header);
    console.log('guest module response: ', response);
    if (response?.status == 200) {
      yield put(HomelistSuccess(response?.data));
    } else {
      yield put(HomelistFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(HomelistFailure(error));
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Guest/HomelistRequest', HomelistSaga);
  })(),
];

export default watchFunction;
