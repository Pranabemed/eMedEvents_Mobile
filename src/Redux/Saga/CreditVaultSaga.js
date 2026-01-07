import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import { boardvaultFailure, boardvaultSuccess, creditvaultFailure, creditvaultSuccess, deletevaultFailure, deletevaultSuccess, downloadTranscriptFailure, downloadTranscriptSuccess, professionvaultFailure, professionvaultSuccess } from '../Reducers/CreditVaultReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
let getItem = state => state.AuthReducer;


export function* creditvaultSaga(action) {
  console.log('hi',action?.payload?.state_id);
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi,action?.payload?.state_id ? 'creditVault/list_v1': 'creditVault/archiveList', action.payload, header);
    console.log('creditvault module response: ', response);
    if (response?.status == 200) {
      yield put(creditvaultSuccess(response?.data));
    } else {
      yield put(creditvaultFailure(response?.data));
    }
  } catch (error) {
    console.log('creditvault error:', error);
    yield put(creditvaultFailure(error));
  }
}
export function* boardvaultSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'creditVault/certificationBoardsList', action.payload, header);
    console.log('boardvaultSaga response: ', response);
    if (response?.data?.success == true) {
      yield put(boardvaultSuccess(response?.data));
    } else {
      yield put(boardvaultFailure(response?.data));
    }
  } catch (error) {
    console.log('creditvault error:', error);
    yield put(boardvaultFailure(error));
  }
}
export function* deletevaultSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(deleteApi, 'creditVault/delete ', action.payload, header);
    console.log('boardvaultSaga response: ', response);
    if (response?.data?.success == true) {
      yield put(deletevaultSuccess(response?.data));
      showErrorAlert(response?.data?.msg);
    } else {
      yield put(deletevaultFailure(response?.data));
    }
  } catch (error) {
    console.log('creditvault error:', error);
    yield put(deletevaultFailure(error));
  }
}
export function* professionvaultSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ProfessionLanding/professionMedicalResource', action.payload, header);
    console.log('boardvaultSaga response: ', response);
    if (response?.status == 200) {
      yield put(professionvaultSuccess(response?.data));
      // showErrorAlert(response?.data?.msg);
    } else {
      yield put(professionvaultFailure(response?.data));
    }
  } catch (error) {
    console.log('creditvault error:', error);
    yield put(professionvaultFailure(error));
  }
}
export function* downloadTransSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi,action?.payload?.statedown ? 'creditVault/downloadArchiveTranscript':'creditVault/downloadTranscript', action.payload, header);
    console.log('downloadTranscript response: ', response);
    if (response?.status == 200) {
      yield put(downloadTranscriptSuccess(response?.data));
      // showErrorAlert(response?.data?.msg);
    } else {
      yield put(downloadTranscriptFailure(response?.data));
    }
  } catch (error) {
    console.log('downloadTranscript error:', error);
    yield put(downloadTranscriptFailure(error));
  }
}
const watchFunction = [
  (function* () {
    yield takeLatest('CreditVault/creditvaultRequest', creditvaultSaga);
  })(),
  (function* () {
    yield takeLatest('CreditVault/boardvaultRequest', boardvaultSaga);
  })(),
  (function* () {
    yield takeLatest('CreditVault/deletevaultRequest', deletevaultSaga);
  })(),
  (function* () {
    yield takeLatest('CreditVault/professionvaultRequest', professionvaultSaga);
  })(),
  (function* () {
    yield takeLatest('CreditVault/downloadTranscriptRequest', downloadTransSaga);
  })()
];

export default watchFunction;
