import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import { boardListDeleteFailure, boardListDeleteSuccess, boardListProfileFailure, boardListProfileSuccess, contactInfoFailure, contactInfoSuccess, EmpAddProfileFailure, EmpAddProfileSuccess, personalInfoFailure, personalInfoSuccess, professionInfoFailure, professionInfoSuccess, profilepicFailure, profilepicSuccess, SearchHospFailure, SearchHospSuccess, stateLicenseDeleteFailure, stateLicenseDeleteSuccess, stateLicenseListFailure, stateLicenseListRequest, stateLicenseListSuccess } from '../Reducers/ProfileReducer';


let getItem = state => state.AuthReducer;
export function* profileContactSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/contactInformation', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(contactInfoSuccess(response?.data));
    } else {
      yield put(contactInfoFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(contactInfoFailure(error));
  }
}
export function* profilepersonalSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/personalInformation', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(personalInfoSuccess(response?.data));
    } else {
      yield put(personalInfoFailure(response?.data));
    }
  } catch (error) {
    console.log('contact  error:', error);
    yield put(personalInfoFailure(error));
  }
}
export function* profilePicSaga(action) {
    let items = yield select(getItem);
    let header = {
      Accept: 'application/json',
      contenttype: 'multipart/form-data',
      authorization: items.token,
    };
    try {
      let response = yield call(postApi, 'user/updateProfilePicture', action.payload, header);
      console.log('registry response: ', response);
      if (response?.status == 200) {
        yield put(profilepicSuccess(response?.data));
      } else {
        yield put(profilepicFailure(response?.data));
      }
    } catch (error) {
      console.log('contact  error:', error);
      yield put(profilepicFailure(error));
    }
  }
  export function* professionInfoSaga(action) {
    let items = yield select(getItem);
    let header = {
      Accept: 'application/json',
      contenttype: 'application/json',
      authorization: items.token,
    };
    try {
      let response = yield call(postApi, 'user/professionalInformation', action.payload, header);
      console.log('registry response: ', response);
      if (response?.status == 200) {
        yield put(professionInfoSuccess(response?.data));
      } else {
        yield put(professionInfoFailure(response?.data));
      }
    } catch (error) {
      console.log('contact  error:', error);
      yield put(professionInfoFailure(error));
    }
  }
  export function* stateLicListSaga(action) {
    let items = yield select(getItem);
    let header = {
      Accept: 'application/json',
      contenttype: 'application/json',
      authorization: items.token,
    };
    try {
      let response = yield call(postApi, 'user/licensureInformationList', action.payload, header);
      console.log('registry response: ', response);
      if (response?.status == 200) {
        yield put(stateLicenseListSuccess(response?.data));
      } else {
        yield put(stateLicenseListFailure(response?.data));
      }
    } catch (error) {
      console.log('contact  error:', error);
      yield put(stateLicenseListFailure(error));
    }
  }
  export function* deleteStateLicSaga(action) {
    let items = yield select(getItem);
    let header = {
      Accept: 'application/json',
      contenttype: 'application/json',
      authorization: items.token,
    };
    try {
      let response = yield call(deleteApi, 'user/licensureInformationDelete', action.payload, header);
      console.log('registry response: ', response);
      if (response?.status == 200) {
        yield put(stateLicenseDeleteSuccess(response?.data));
      } else {
        yield put(stateLicenseDeleteFailure(response?.data));
      }
    } catch (error) {
      console.log('contact  error:', error);
      yield put(stateLicenseDeleteFailure(error));
    }
  }
  export function* boardListSaga(action) {
    let items = yield select(getItem);
    let header = {
      Accept: 'application/json',
      contenttype: 'application/json',
      authorization: items.token,
    };
    try {
      let response = yield call(postApi, 'user/certificationInformationList', action.payload, header);
      console.log('registry response: ', response);
      if (response?.status == 200) {
        yield put(boardListProfileSuccess(response?.data));
      } else {
        yield put(boardListProfileFailure(response?.data));
      }
    } catch (error) {
      console.log('contact  error:', error);
      yield put(boardListProfileFailure(error));
    }
  }
  export function* deleteBoardSaga(action) {
    let items = yield select(getItem);
    let header = {
      Accept: 'application/json',
      contenttype: 'application/json',
      authorization: items.token,
    };
    try {
      let response = yield call(deleteApi, 'user/certificationInformationDelete', action.payload, header);
      console.log('registry response: ', response);
      if (response?.status == 200) {
        yield put(boardListDeleteSuccess(response?.data));
      } else {
        yield put(boardListDeleteFailure(response?.data));
      }
    } catch (error) {
      console.log('contact  error:', error);
      yield put(boardListDeleteFailure(error));
    }
  }
  export function* empAddProfSaga(action) {
    let items = yield select(getItem);
    let header = {
      Accept: 'application/json',
      contenttype: 'application/json',
      authorization: items.token,
    };
    try {
      let response = yield call(postApi, 'user/employmentInformation', action.payload, header);
      console.log('registry response: ', response);
      if (response?.status == 200) {
        yield put(EmpAddProfileSuccess(response?.data));
      } else {
        yield put(EmpAddProfileFailure(response?.data));
      }
    } catch (error) {
      console.log('contact  error:', error);
      yield put(EmpAddProfileFailure(error));
    }
  }
  export function* searchHospSaga(action) {
    let items = yield select(getItem);
    let header = {
      Accept: 'application/json',
      contenttype: 'application/json',
      authorization: items.token,
    };
    try {
      let response = yield call(getApi, `master/SearchHospital?cityid=${action?.payload?.cityid}&stateid=${action?.payload?.stateid}`, header);
      console.log('profession response: ', response);
      if (response?.status == 200) {
        yield put(SearchHospSuccess(response?.data));
      } else {
        yield put(SearchHospFailure(response?.data));
      }
    } catch (error) {
      console.log('profile error:', error);
      yield put(SearchHospFailure(error));
    }
  }
const watchFunction = [
  (function* () {
    yield takeLatest('Profile/contactInfoRequest', profileContactSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/profilepicRequest', profilePicSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/personalInfoRequest', profilepersonalSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/professionInfoRequest', professionInfoSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/stateLicenseListRequest', stateLicListSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/stateLicenseDeleteRequest', deleteStateLicSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/boardListProfileRequest', boardListSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/boardListDeleteRequest', deleteBoardSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/EmpAddProfileRequest', empAddProfSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/SearchHospRequest', searchHospSaga);
  })()
];

export default watchFunction;
