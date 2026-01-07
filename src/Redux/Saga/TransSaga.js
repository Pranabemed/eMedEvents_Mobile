import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import { contactusSpeakerFailure, contactusSpeakerSuccess, HCPSubFailure, HCPSubSuccess, organizerProfileFailure, organizerProfileSuccess, registPaymentFailure, registPaymentSuccess, searchOrganizerFailure, searchOrganizerSuccess, searchSpeakerFailure, searchSpeakerSuccess, speakerProfileFailure, speakerProfileSuccess, subPaymentcardFailure, subPaymentcardSuccess, subRenewalFailure, subRenewalSuccess, subscribeTransFailure, subscribeTransSuccess, userSubFailure, userSubSuccess, walletsgetFailure, walletsgetSuccess, walletsTransFailure, walletsTransSuccess } from '../Reducers/TransReducer';


let getItem = state => state.AuthReducer;
export function* TransPayemntSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Payment/paymentsReport', action.payload, header);
    console.log('registry response: ', response);
    if (response?.status == 200) {
      yield put(registPaymentSuccess(response?.data));
    } else {
      yield put(registPaymentFailure(response?.data));
    }
  } catch (error) {
    console.log('registry  error:', error);
    yield put(registPaymentFailure(error));
  }
}
export function* TransSubscribeSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'UserSubscription/transactions', action.payload, header);
    console.log('Subscription response: ', response);
    if (response?.status == 200) {
      yield put(subscribeTransSuccess(response?.data));
    } else {
      yield put(subscribeTransFailure(response?.data));
    }
  } catch (error) {
    console.log('Subscription  error:', error);
    yield put(subscribeTransFailure(error));
  }
}
export function* TranswalletsSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Payment/walletReport', action.payload, header);
    console.log('Subscription response: ', response);
    if (response?.status == 200) {
      yield put(walletsTransSuccess(response?.data));
    } else {
      yield put(walletsTransFailure(response?.data));
    }
  } catch (error) {
    console.log('Subscription  error:', error);
    yield put(walletsTransFailure(error));
  }
}
export function* getwalletsSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Payment/walletReport', action.payload, header);
    console.log('Subscription response: ', response);
    if (response?.status == 200) {
      yield put(walletsgetSuccess(response?.data));
    } else {
      yield put(walletsgetFailure(response?.data));
    }
  } catch (error) {
    console.log('Subscription  error:', error);
    yield put(walletsgetFailure(error));
  }
}
export function* userSubSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'UserSubscription/subscriptions', action.payload, header);
    console.log('Subscription response: ', response);
    if (response?.status == 200) {
      yield put(userSubSuccess(response?.data));
    } else {
      yield put(userSubFailure(response?.data));
    }
  } catch (error) {
    console.log('Subscription  error:', error);
    yield put(userSubFailure(error));
  }
}
export function* HcpSubSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'HcpSubscription/subscriptions', action.payload, header);
    console.log('Subscription response: ', response);
    if (response?.status == 200) {
      yield put(HCPSubSuccess(response?.data));
    } else {
      yield put(HCPSubFailure(response?.data));
    }
  } catch (error) {
    console.log('Subscription  error:', error);
    yield put(HCPSubFailure(error));
  }
}
export function* subRenewalSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'UserSubscription/cancelSubscription', action.payload, header);
    console.log('Subscription renewal response: ', response);
    if (response?.status == 200) {
      yield put(subRenewalSuccess(response?.data));
    } else {
      yield put(subRenewalFailure(response?.data));
    }
  } catch (error) {
    console.log('Subscription renewal error:', error);
    yield put(subRenewalFailure(error));
  }
}
export function* subPaymentSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'UserSubscription/updateSubscription', action.payload, header);
    console.log('Subscription response: ', response);
    if (response?.status == 200) {
      yield put(subPaymentcardSuccess(response?.data));
    } else {
      yield put(subPaymentcardFailure(response?.data));
    }
  } catch (error) {
    console.log('Subscription  error:', error);
    yield put(subPaymentcardFailure(error));
  }
}
export function* searchSpeakerSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  console.log(action,"action---------")
  try {
    let response = yield call(postApi, action?.payload?.speaker == '' ? 'Speaker/SearchSpeaker':'Organizer/SearchOrganizer', action.payload, header);
    console.log('Speaker/SearchSpeaker: ', response);
    if (response?.status == 200) {
      yield put(searchSpeakerSuccess(response?.data));
    } else {
      yield put(searchSpeakerFailure(response?.data));
    }
  } catch (error) {
    console.log('Speaker/SearchSpeaker  error:', error);
    yield put(searchSpeakerFailure(error));
  }
}
export function* profileSpeakerSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, action?.payload?.speak == '' ? 'Speaker/profile':'Organizer/profile', action.payload, header);
    console.log('Speaker/profile: ', response);
    if (response?.status == 200) {
      yield put(speakerProfileSuccess(response?.data));
    } else {
      yield put(speakerProfileFailure(response?.data));
    }
  } catch (error) {
    console.log('Speaker/profile  error:', error);
    yield put(speakerProfileFailure(error));
  }
}
export function* contactSpeakerSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Contact/speakerEnquiry', action.payload, header);
    console.log('Speaker/profile: ', response);
    if (response?.status == 200) {
      yield put(contactusSpeakerSuccess(response?.data));
    } else {
      yield put(contactusSpeakerFailure(response?.data));
    }
  } catch (error) {
    console.log('Speaker/profile  error:', error);
    yield put(contactusSpeakerFailure(error));
  }
}
const watchFunction = [
  (function* () {
    yield takeLatest('Transaction/registPaymentRequest', TransPayemntSaga);
  })(),
  (function* () {
    yield takeLatest('Transaction/subscribeTransRequest', TransSubscribeSaga);
  })(),
  (function* () {
    yield takeLatest('Transaction/walletsTransRequest', TranswalletsSaga);
  })(),
  (function* () {
    yield takeLatest('Transaction/walletsgetRequest', getwalletsSaga);
  })(),
  (function* () {
    yield takeLatest('Transaction/userSubRequest', userSubSaga);
  })(),
  (function* () {
    yield takeLatest('Transaction/HCPSubRequest', HcpSubSaga);
  })(),
  (function* () {
    yield takeLatest('Transaction/subRenewalRequest', subRenewalSaga);
  })(),
  (function* () {
    yield takeLatest('Transaction/subPaymentcardRequest', subPaymentSaga);
  })(),
  (function* () {
    yield takeLatest('Transaction/searchSpeakerRequest', searchSpeakerSaga);
  })(),
  (function* () {
    yield takeLatest('Transaction/speakerProfileRequest', profileSpeakerSaga);
  })(),
  (function* () {
    yield takeLatest('Transaction/contactusSpeakerRequest', contactSpeakerSaga);
  })()
];

export default watchFunction;
