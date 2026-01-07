import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi } from '../../Utils/Helpers/ApiRequest';
import showErrorAlert from '../../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { OCRCertificateFailure, OCRCertificateSuccess, addCreditVaultFailure, addCreditVaultSuccess, addCreditsFailure, addCreditsSuccess, boardSpecialityFailure, boardSpecialitySuccess, boardcertificateFailure, boardcertificateSuccess, boardcountFailure, boardcountSuccess, changePasswordFailure, changePasswordSuccess, countFailure, countSuccess, dashMbFailure, dashMbSuccess, dashPerFailure, dashPerSuccess, dashboardFailure, dashboardSuccess, mainprofileFailure, mainprofileSuccess, specailtyFailure, specailtySuccess, stateCourseFailure, stateCourseSuccess, stateDashboardFailure, stateDashboardSuccess, stateLicesenseFailure, stateLicesenseSuccess, stateMandatoryFailure, stateMandatorySuccess, stateReportingFailure, stateReportingSuccess } from '../Reducers/DashboardReducer';
let getItem = state => state.AuthReducer;



////////Dashboard
const wholeDatHo = async (data) => {
  try {
    if (data == undefined || data == null) {
      console.warn('Cannot store undefined/null in AsyncStorage');
      return; // Exit early
    }
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem('WHOLEDATA', jsonData);
    console.log('Data successfully saved.');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
const profDatHo = async (data) => {
  try {
    if (data == undefined || data == null) {
      console.warn('Cannot store undefined/null in AsyncStorage');
      return; // Exit early
    }
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem('PRODATA', jsonData);
    console.log('Data successfully saved.');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
export function* dashboardSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'user/dashboard', action?.payload?.key ? action?.payload?.key: action?.payload, header);
    console.log('dashboardRequest response: ', response);
    if (response?.data?.success == true) {
      wholeDatHo(response?.data?.licensures?.[0]);
      profDatHo(response?.data?.user_information);
      yield put(dashboardSuccess(response));
      yield put(countSuccess(response?.data?.licensures?.length));
      yield put(boardcountSuccess(response?.data?.board_certifications?.length));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(dashboardFailure(response));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(dashboardFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* dashMBSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'user/dashboard', action?.payload?.key ? action?.payload?.key: action?.payload, header);
    console.log('dashboardRequest response: ', response);
    if (response?.data?.success == true) {
      yield put(dashMbSuccess(response));
    } else {
      yield put(dashMbFailure(response));
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(dashMbFailure(error));
  }
}
export function* dashPersonSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'user/dashboard', action?.payload?.key ? action?.payload?.key: action?.payload, header);
    console.log('dashboardRequest response: ', response);
    if (response?.data?.success == true) {
      yield put(dashPerSuccess(response));
    } else {
      yield put(dashPerFailure(response));
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(dashPerFailure(error));
  }
}
export function* stateDashboardSaga(action) {
  console.log('hi state board',action.payload);
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, action?.payload?.board_id ?'user/boardDashboard' :'user/stateDashboard', action.payload, header);
    console.log('dashboardRequest response: ', response);
    if (response?.data?.success == true) {
      yield put(stateDashboardSuccess(response));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateDashboardFailure(response));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(stateDashboardFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* stateCourseSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'creditVault/complianceList', action.payload, header);
    console.log('dashboardRequest response:123', response);
    if (response?.data?.success == true) {
      yield put(stateCourseSuccess(response));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateCourseFailure(response));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(stateCourseFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* creditTypeSaga(action) {
  console.log('hi');
  // let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    // authorization: items.token,
  };
  try {
    let response = yield call(getApi, `master/creditTypes?profession=${action.payload}`, header);
    console.log('creditType response: ', response);
    if (response?.data?.success == true) {
      yield put(addCreditsSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(addCreditsFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(addCreditsFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* AddCreditVaultSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'creditVault/addEdit',action.payload, header);
    console.log('creditType response: ', response);
    if (response?.data?.success == true) {
      yield put(addCreditVaultSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(addCreditVaultFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(addCreditVaultFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}

export function* addLicesenseSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/licensureInformation',action.payload, header);
    console.log('licensure Information response: ', response);
    if (response?.data?.success == true) {
      yield put(stateLicesenseSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateLicesenseFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(stateLicesenseFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* stateMandatorySaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'creditVault/list',action.payload, header);
    console.log('creditType response: ', response);
    if (response?.data?.success == true) {
      yield put(stateMandatorySuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateMandatoryFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(stateMandatoryFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* stateReportingSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'creditVault/stateReporting',action.payload, header);
    console.log('creditType response: ', response);
    if (response?.data?.success == true) {
      yield put(stateReportingSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateReportingFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(stateReportingFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* boardSpecialitySaga(action) {
  // console.log('action?.payload?.specilityid========',action?.payload?.specilityid);
  // let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    // authorization: items.token,
  };
  try {
    let response = yield call(getApi, `master/certificationBoards?profession=${action?.payload?.profession}&speclities=${action?.payload?.specilityid}`, header);
    console.log('creditType response: ', response);
    if (response?.data?.success == true) {
      yield put(boardSpecialitySuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(boardSpecialityFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(boardSpecialityFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* addboardcertificateSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/certificationInformation',action.payload, header);
    console.log('licensure Information response: ', response);
    if (response?.data?.success == true) {
      yield put(boardcertificateSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(boardcertificateFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(boardcertificateFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* OCRCertificateSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/certificateOCR',action.payload, header);
    console.log('certificateOCR>>>>>>>> Information response: ', response);
    if (response?.data?.success == true) {
      yield put(OCRCertificateSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(OCRCertificateFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('signup error:', error);
    yield put(OCRCertificateFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* countStateBoardSaga(action) {
  try {
    if (action.payload) {
      yield put(countSuccess(action.payload));
    } else {
      yield put(countFailure({}));
    }
  } catch (error) {
    console.log(error,"errr")
    yield put(countFailure(error));
  }
}
export function* BoardcountSaga(action) {
  try {
    if (action.payload) {
      yield put(boardcountSuccess(action.payload));
    } else {
      yield put(boardcountFailure({}));
    }
  } catch (error) {
    console.log(error,"errr")
    yield put(boardcountFailure(error));
  }
}
export function* mainProfileSaga(action) {
  let items = yield select(getItem);
  console.log('himainprofile-------------',items,action);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'user/profile',action?.payload?.key ? action?.payload?.key: action?.payload, header);
    console.log('user/profile=== response: ', response);
    if (response?.data?.success == true) {
      yield put(mainprofileSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(mainprofileFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('profile main error:', error);
    yield put(mainprofileFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* mainSpecialtySaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    ontenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/specialtyCourses',action.payload, header);
    console.log('/user/specialtyCourses=== response: ', response);
    if (response?.data?.success == true) {
      yield put(specailtySuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(specailtyFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('profile main error:', error);
    yield put(specailtyFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* changePassSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    ontenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/changePassword',action.payload, header);
    console.log('/user/changePassword=== response: ', response);
    if (response?.data?.success == true) {
      yield put(changePasswordSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(changePasswordFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('profile main error:', error);
    yield put(changePasswordFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
const watchFunction = [
  (function* () {
    yield takeLatest('Dashboard/dashboardRequest', dashboardSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/dashMbRequest', dashMBSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/dashPerRequest', dashPersonSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/stateDashboardRequest', stateDashboardSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/stateCourseRequest', stateCourseSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/addCreditsRequest', creditTypeSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/addCreditVaultRequest', AddCreditVaultSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/stateMandatoryRequest', stateMandatorySaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/stateLicesenseRequest', addLicesenseSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/stateReportingRequest', stateReportingSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/boardSpecialityRequest', boardSpecialitySaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/boardcertificateRequest', addboardcertificateSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/boardcountRequest', BoardcountSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/countRequest', countStateBoardSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/OCRCertificateRequest', OCRCertificateSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/mainprofileRequest', mainProfileSaga);
  })(),
  (function* () {
    yield takeLatest('Dashboard/specailtyRequest', mainSpecialtySaga);
  })(),
   (function* () {
    yield takeLatest('Dashboard/changePasswordRequest', changePassSaga);
  })()
];

export default watchFunction;
