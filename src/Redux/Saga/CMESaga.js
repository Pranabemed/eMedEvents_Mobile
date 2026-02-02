import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import { CMEPlannerDelFailure, CMEPlannerDelSuccess, CMEPlannerEditFailure, CMEPlannerEditSuccess, CMEPlannerFailure, CMEPlannerSuccess, ConfActFailure, ConfActSuccess, activityfulfilmentFailure, activityfulfilmentSuccess, actvityBreakupFailure, actvityBreakupSuccess, certificatewiseexamFailure, certificatewiseexamSuccess, cmeCourseFailure, cmeCourseSuccess, cmeactivityFailure, cmeactivitySuccess, cmedulicateFailure, cmedulicateSuccess, cmenextactionFailure, cmenextactionSuccess, cmereviewFailure, cmereviewSuccess, evaulatecalculateFailure, evaulatecalculateSuccess, evaulateexamFailure, evaulateexamSuccess, nextactionagainFailure, nextactionagainSuccess, startTestFailure, startTestSuccess } from '../Reducers/CMEReducer';
let getItem = state => state.AuthReducer;


export function* cmeCourseSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi,action?.payload?.search_speciality == "" ?'Conference/conferenceList' : action?.payload?.listby_type == "interstedconferences" ? 'Conference/conferenceList' : 'Conference/conferenceList?', action.payload, header);
    if (response?.status == 200) {
      yield put(cmeCourseSuccess(response?.data));
    } else {
      yield put(cmeCourseFailure(response?.data));
    }
  } catch (error) {
    yield put(cmeCourseFailure(error));
  }
}
export function* cmeReviewSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/reviewCourse', action.payload, header);
    if (response?.data?.success == true) {
      yield put(cmereviewSuccess(response?.data));
    } else {
      yield put(cmereviewFailure(response?.data));
    }
  } catch (error) {
    yield put(cmereviewFailure(error));
  }
}
export function* cmeActivitySaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/activitysession', action.payload, header);
    if (response?.status == 200) {
      yield put(cmeactivitySuccess(response?.data));
    } else {
      yield put(cmenextactionFailure(response?.data));
    }
  } catch (error) {
    yield put(cmenextactionFailure(error));
  }
}
export function* cmeNextactionSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/nextAction', action.payload, header);
    if (response?.status == 200) {
      yield put(cmenextactionSuccess(response?.data));
    } else {
      yield put(cmeactivityFailure(response?.data));
    }
  } catch (error) {
    yield put(cmeactivityFailure(error));
  }
}
export function* cmeDupicateSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/nextAction', action.payload, header);
    if (response?.status == 200) {
      yield put(cmedulicateSuccess(response?.data));
    } else {
      yield put(cmedulicateFailure(response?.data));
    }
  } catch (error) {
    yield put(cmedulicateFailure(error));
  }
}
export function* AgainNextactionSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/nextAction', action.payload, header);
    if (response?.status == 200) {
      yield put(nextactionagainSuccess(response?.data));
    } else {
      yield put(nextactionagainFailure(response?.data));
    }
  } catch (error) {
    yield put(nextactionagainFailure(error));
  }
}
export function* activityFulfilSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/introduction', action.payload, header);
    if (response?.data?.success == true) {
      yield put(activityfulfilmentSuccess(response?.data));
    } else {
      yield put(activityfulfilmentFailure(response?.data));
    }
  } catch (error) {
    yield put(activityfulfilmentFailure(error));
  }
}
export function* startTestSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/startTest', action.payload, header);
    if (response?.status == 200) {
      yield put(startTestSuccess(response?.data));
    } else {
      yield put(startTestFailure(response?.data));
    }
  } catch (error) {
    yield put(startTestFailure(error));
  }
}
export function* activityBreakupSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/activityBreakup', action.payload, header);
    if (response?.status == 200) {
      yield put(actvityBreakupSuccess(response?.data));
    } else {
      yield put(actvityBreakupFailure(response?.data));
    }
  } catch (error) {
    yield put(actvityBreakupFailure(error));
  }
}
export function* startEvaulateSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/startEvaluation', action.payload, header);
    if (response?.status == 200) {
      yield put(evaulateexamSuccess(response?.data));
    } else {
      yield put(evaulateexamFailure(response?.data));
    }
  } catch (error) {

    yield put(evaulateexamFailure(error));
  }
}
export function* resultEvaulateSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/evaluationResult', action.payload, header);
    if (response?.status == 200) {
      yield put(evaulatecalculateSuccess(response?.data));
    } else {
      yield put(evaulatecalculateFailure(response?.data));
    }
  } catch (error) {
    yield put(evaulatecalculateFailure(error));
  }
} 
export function* certificateExamSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'ActivityFulfillment/downloadCertificate', action.payload, header);
    if (response?.status == 200) {
      yield put(certificatewiseexamSuccess(response?.data));
    } else {
      yield put(certificatewiseexamFailure(response?.data));
    }
  } catch (error) {
    yield put(certificatewiseexamFailure(error));
  }
}
export function* CMEPlannerSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(getApi, 'calender/userConferences', header);
    if (response?.status == 200) {
      yield put(CMEPlannerSuccess(response?.data));
    } else {
      yield put(CMEPlannerFailure(response?.data));
    }
  } catch (error) {
    yield put(CMEPlannerFailure(error));
  }
}
export function* CMEPlannerAddSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'calender/saveCMEPlanner',action?.payload, header);
    if (response?.status == 200) {
      yield put(CMEPlannerEditSuccess(response?.data));
    } else {
      yield put(CMEPlannerEditFailure(response?.data));
    }
  } catch (error) {
    yield put(CMEPlannerEditFailure(error));
  }
}
export function* CMEPlannerDelSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(deleteApi, 'calender/deleteCMEPlanner',action?.payload, header);
    if (response?.status == 200) {
      yield put(CMEPlannerDelSuccess(response?.data));
    } else {
      yield put(CMEPlannerDelFailure(response?.data));
    }
  } catch (error) {
    yield put(CMEPlannerDelFailure(error));
  }
}
export function* ConfActSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Conference/conferenceAction',action?.payload, header);
    if (response?.status == 200) {
      yield put(ConfActSuccess(response?.data));
    } else {
      yield put(ConfActFailure(response?.data));
    }
  } catch (error) {
    yield put(ConfActFailure(error));
  }
}
const watchFunction = [
  (function* () {
    yield takeLatest('CME/cmeCourseRequest', cmeCourseSaga);
  })(),
  (function* () {
    yield takeLatest('CME/cmereviewRequest', cmeReviewSaga);
  })(),
  (function* () {
    yield takeLatest('CME/cmeactivityRequest', cmeActivitySaga);
  })(),
  (function* () {
    yield takeLatest('CME/cmenextactionRequest', cmeNextactionSaga);
  })(),
  (function* () {
    yield takeLatest('CME/cmedulicateRequest', cmeDupicateSaga);
  })(),
  (function* () {
    yield takeLatest('CME/nextactionagainRequest', AgainNextactionSaga);
  })(),
  (function* () {
    yield takeLatest('CME/activityfulfilmentRequest', activityFulfilSaga);
  })(),
  (function* () {
    yield takeLatest('CME/startTestRequest', startTestSaga);
  })(),
  (function* () {
    yield takeLatest('CME/actvityBreakupRequest', activityBreakupSaga);
  })(),
  (function* () {
    yield takeLatest('CME/evaulateexamRequest', startEvaulateSaga);
  })(),
  (function* () {
    yield takeLatest('CME/evaulatecalculateRequest', resultEvaulateSaga);
  })(),
  (function* () {
    yield takeLatest('CME/certificatewiseexamRequest', certificateExamSaga);
  })(),
  (function* () {
    yield takeLatest('CME/CMEPlannerRequest', CMEPlannerSaga);
  })(),
  (function* () {
    yield takeLatest('CME/CMEPlannerEditRequest', CMEPlannerAddSaga);
  })(),
  (function* () {
    yield takeLatest('CME/CMEPlannerDelRequest', CMEPlannerDelSaga);
  })(),(function* () {
    yield takeLatest('CME/ConfActRequest', ConfActSaga);
  })()
];

export default watchFunction;
