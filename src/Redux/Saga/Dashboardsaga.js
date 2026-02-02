import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi } from '../../Utils/Helpers/ApiRequest';
import showErrorAlert from '../../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'user/dashboard', action?.payload?.key ? action?.payload?.key: action?.payload, header);
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
    yield put(dashboardFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* dashMBSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'user/dashboard', action?.payload?.key ? action?.payload?.key: action?.payload, header);
    if (response?.data?.success == true) {
      yield put(dashMbSuccess(response));
    } else {
      yield put(dashMbFailure(response));
    }
  } catch (error) {
    yield put(dashMbFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* dashPersonSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'user/dashboard', action?.payload?.key ? action?.payload?.key: action?.payload, header);
    if (response?.data?.success == true) {
      yield put(dashPerSuccess(response));
    } else {
      yield put(dashPerFailure(response));
    }
  } catch (error) {
    yield put(dashPerFailure(error));
    // showErrorAlert("!Oops something went wrong ");
  }
}
export function* stateDashboardSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, action?.payload?.board_id ?'user/boardDashboard' :'user/stateDashboard', action.payload, header);
    if (response?.data?.success == true) {
      yield put(stateDashboardSuccess(response));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateDashboardFailure(response));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(stateDashboardFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* stateCourseSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'creditVault/complianceList', action.payload, header);
    if (response?.data?.success == true) {
      yield put(stateCourseSuccess(response));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateCourseFailure(response));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(stateCourseFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* creditTypeSaga(action) {
  // let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    // authorization: items.token,
  };
  try {
    let response = yield call(getApi, `master/creditTypes?profession=${action.payload}`, header);
    if (response?.data?.success == true) {
      yield put(addCreditsSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(addCreditsFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(addCreditsFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* AddCreditVaultSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'creditVault/addEdit',action.payload, header);
    if (response?.data?.success == true) {
      yield put(addCreditVaultSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(addCreditVaultFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(addCreditVaultFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}

export function* addLicesenseSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/licensureInformation',action.payload, header);
    if (response?.data?.success == true) {
      yield put(stateLicesenseSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateLicesenseFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(stateLicesenseFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* stateMandatorySaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'creditVault/list',action.payload, header);
    if (response?.data?.success == true) {
      yield put(stateMandatorySuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateMandatoryFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(stateMandatoryFailure(error));
     showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* stateReportingSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'creditVault/stateReporting',action.payload, header);
    if (response?.data?.success == true) {
      yield put(stateReportingSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateReportingFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(stateReportingFailure(error));
      showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* boardSpecialitySaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    // authorization: items.token,
  };
  try {
    let response = yield call(getApi, `master/certificationBoards?profession=${action?.payload?.profession}&speclities=${action?.payload?.specilityid}`, header);
    if (response?.data?.success == true) {
      yield put(boardSpecialitySuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(boardSpecialityFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(boardSpecialityFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* addboardcertificateSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/certificationInformation',action.payload, header);
    if (response?.data?.success == true) {
      yield put(boardcertificateSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(boardcertificateFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(boardcertificateFailure(error));
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* OCRCertificateSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/certificateOCR',action.payload, header);
    if (response?.data?.success == true) {
      yield put(OCRCertificateSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(OCRCertificateFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
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
    yield put(boardcountFailure(error));
  }
}
export function* mainProfileSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'user/profile',action?.payload?.key ? action?.payload?.key: action?.payload, header);
    if (response?.data?.success == true) {
      yield put(mainprofileSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(mainprofileFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(mainprofileFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* mainSpecialtySaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    ontenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/specialtyCourses',action.payload, header);
    if (response?.data?.success == true) {
      yield put(specailtySuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(specailtyFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(specailtyFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* changePassSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    ontenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/changePassword',action.payload, header);
    if (response?.data?.success == true) {
      yield put(changePasswordSuccess(response?.data));
    //   showErrorAlert(response?.data?.msg);
    } else {
      yield put(changePasswordFailure(response?.data));
    //   showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(changePasswordFailure(error));
    showErrorAlert("!Oops something went wrong ");
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
