import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import { AboutusFailure, AboutusSuccess, HomelistFailure, HomelistSuccess } from '../Reducers/GuestReducer';
import { getPublicIP } from '../../Utils/Helpers/IPServer';


let getItem = state => state.AuthReducer;
export function* HomelistSaga(action) {
  console.log('hi');
  const ipAddress = getPublicIP();
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    IPADDRESS: ipAddress ? ipAddress : '',
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

export function* AboutusSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'LandingPages/aboutus', action.payload, header);
    if (response?.status == 200) {
      yield put(AboutusSuccess(response?.data));
    } else {
      yield put(AboutusFailure(response?.data));
    }
  } catch (error) {
    yield put(AboutusFailure(error));
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Guest/HomelistRequest', HomelistSaga);
  })(),
  (function* () {
    yield takeLatest('Guest/AboutusRequest', AboutusSaga);
  })(),
];

export default watchFunction;
