import { takeLatest, select, put, call } from 'redux-saga/effects';
import { postApi, getApi, deleteApi } from '../../Utils/Helpers/ApiRequest';
import { FreeCartFailure, FreeCartSuccess, FreeTransFailure, FreeTransSuccess, PaymentCheckFailure, PaymentCheckSuccess, PrimeCheckFailure, PrimeCheckRequest, PrimeCheckSuccess, PrimePaymentFailure, PrimePaymentRequest, PrimePaymentSuccess, RegisterIntFailure, RegisterIntSuccess, StatusPaymentFailure, StatusPaymentSuccess, TransemailcheckFailure, TransemailcheckSuccess, addtoCartWebcastFailure, addtoCartWebcastSuccess, cancelcouponFailure, cancelcouponSuccess, cartCheckoutFailure, cartCheckoutSuccess, cartPaymentFailure, cartPaymentSuccess, cartcountWebcastFailure, cartcountWebcastSuccess, cartdeleteWebcastFailure, cartdeleteWebcastSuccess, cartdetailsWebcastFailure, cartdetailsWebcastSuccess, couponWebcastFailure, couponWebcastSuccess, saveRegistFailure, saveRegistSuccess, saveTicketFailure, saveTicketInpersonFailure, saveTicketInpersonSuccess, saveTicketSuccess, walletCheckFailure, walletCheckSuccess, webcastDeatilsFailure, webcastDeatilsSuccess, webcastPaymentFailure, webcastPaymentSuccess, webcastStateFailure, webcastStateSuccess, webcastsearchFailure, webcastsearchSuccess, webcastviewallFailure, webcastviewallSuccess } from '../Reducers/WebcastReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';

let getItem = state => state.AuthReducer;
export function* webcastSearchSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'GlobalSearch/headerSearch', action.payload, header);
    console.log('creditvault module response: ', response);
    if (response?.status == 200) {
      yield put(webcastsearchSuccess(response?.data));
    } else {
      yield put(webcastsearchFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(webcastsearchFailure(error));
  }
}

export function* webcastDetailsSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Conference/conferenceDetailPage', action.payload, header);
    console.log('creditvault module response: ', response);
    if (response?.data?.success == true) {
      yield put(webcastDeatilsSuccess(response?.data));
    } else {
      yield put(webcastDeatilsFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(webcastDeatilsFailure(error));
  }
}
export function* webcastAllSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'LandingPages/mandatoryLanding', action.payload, header);
    console.log('creditvault module response: ', response);
    if (response?.status == 200) {
      yield put(webcastviewallSuccess(response?.data));
    } else {
      yield put(webcastviewallFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(webcastviewallFailure(error));
  }
}
export function* webcastStateSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'LandingPages/mandatoryLandingStates', action.payload, header);
    console.log('Landing state response: ', response);
    if (response?.status == 200) {
      yield put(webcastStateSuccess(response?.data));
    } else {
      yield put(webcastStateFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(webcastStateFailure(error));
  }
}
export function* saveTicketSaga(action) {
  console.log('hi',action);
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'transaction/saveTickets', action.payload, header);
    console.log('save ticket response: ', response);
    if (response?.data?.success == true) {
      yield put(saveTicketSuccess(response?.data));
    } else {
      yield put(saveTicketFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(saveTicketFailure(error));
  }
}
export function* saveTicketInpersonSaga(action) {
  console.log('hi',action);
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'transaction/saveTickets', action.payload, header);
    console.log('save ticket response: ', response);
    if (response?.data?.success == true) {
      yield put(saveTicketInpersonSuccess(response?.data));
    } else {
      yield put(saveTicketInpersonFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(saveTicketInpersonFailure(error));
  }
}
export function* saveRegistSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'transaction/saveRegistration', action.payload, header);
    console.log('saveRegistration ticket response: ', response);
    if (response?.data?.success == true) {
      yield put(saveRegistSuccess(response?.data));
    } else {
      yield put(saveRegistFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(saveRegistFailure(error));
  }
}
export function* webcastPaymentSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Transaction/payment', action.payload, header);
    console.log('saveRegistration ticket response: ', response);
    if (response?.status == 200) {
      yield put(webcastPaymentSuccess(response?.data));
    } else {
      yield put(webcastPaymentFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(webcastPaymentFailure(error));
  }
}
export function* StatusPaymentSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'transaction/paymentStatus', action.payload, header);
    console.log('paymentStatus : ', response);
    if (response?.status == 200) {
      yield put(StatusPaymentSuccess(response?.data));
    } else {
      yield put(StatusPaymentFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(StatusPaymentFailure(error));
  }
}
export function* PaymentCheckSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'transaction/paymentStatus', action.payload, header);
    console.log('paymentStatus : ', response);
    if (response?.status == 200) {
      yield put(PaymentCheckSuccess(response?.data));
    } else {
      yield put(PaymentCheckFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(PaymentCheckFailure(error));
  }
}
export function* addtoCartWebcastSaga(action) {
  console.log('hi',action?.payload);
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, action?.payload?.bundle_conference_id ? 'transaction/addBundleToCart':'transaction/addToCart', action.payload, header);
    console.log('transactionaddBundleToCart response: ', response);
    if (response?.data?.success == true) {
      yield put(addtoCartWebcastSuccess(response?.data));
    } else {
      yield put(addtoCartWebcastFailure(response?.data));
      showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(addtoCartWebcastFailure(error));
  }
}
export function* cartCountWebcastSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'transaction/cartItemsCount', action.payload, header);
    console.log('transactionaddBundleToCart response: ', response);
    if (response?.data?.success == true) {
      yield put(cartcountWebcastSuccess(response?.data));
    } else {
      yield put(cartcountWebcastFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(cartcountWebcastFailure(error));
  }
}
export function* cartDetailsWebcastSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'transaction/cartDetails', action.payload, header);
    console.log('transactionaddBundleToCart response: ', response);
    if (response?.data?.success == true) {
      yield put(cartdetailsWebcastSuccess(response?.data));
    } else {
      yield put(cartdetailsWebcastFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(cartdetailsWebcastFailure(error));
  }
}
export function* cartdeleteWebcastSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'transaction/deleteCartItem', action.payload, header);
    console.log('transactionaddBundleToCart response: ', response);
    if (response?.data?.success == true) {
      yield put(cartdeleteWebcastSuccess(response?.data));
    } else {
      yield put(cartdeleteWebcastFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(cartdeleteWebcastFailure(error));
  }
}
export function* couponapplySaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Transaction/applyCouponcode', action.payload, header);
    console.log('transactionaddBundleToCart response: ', response);
    if (response?.status == 200) {
      yield put(couponWebcastSuccess(response?.data));
    } else {
      yield put(couponWebcastFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast cupon error:', error);
    yield put(couponWebcastFailure(error));
  }
}
export function* cancelcouponSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Transaction/removeCouponcode', action.payload, header);
    console.log('transactionaddBundleToCart response: ', response);
    if (response?.data?.status == true) {
      yield put(cancelcouponSuccess(response?.data));
    } else {
      yield put(cancelcouponFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(cancelcouponFailure(error));
  }
}
export function* cartCheckoutSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'transaction/cartCheckOut', action.payload, header);
    console.log('transaction/cartCheckOut response: ', response);
    if (response?.status == 200) {
      yield put(cartCheckoutSuccess(response?.data));
    } else {
      yield put(cartCheckoutFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(cartCheckoutFailure(error));
  }
}
export function* cartPaymentSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'transaction/cartRegistration', action.payload, header);
    console.log('transaction/cartRegistration response: ', response);
    if (response?.status == 200) {
      yield put(cartPaymentSuccess(response?.data));
    } else {
      yield put(cartPaymentFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(cartPaymentFailure(error));
  }
}
export function* TransEmailCheckSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Transaction/RegistrationStatus', action.payload, header);
    console.log('Transaction/RegistrationStatusn response: ', response);
    if (response?.status == 200) {
      yield put(TransemailcheckSuccess(response?.data));
    } else {
      yield put(TransemailcheckFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(TransemailcheckFailure(error));
  }
}
export function* walletCheckSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'User/walletBalance', action?.payload?.key ? action?.payload?.key : action?.payload, header);
    console.log('User/walletBalance response: ', response);
    if (response?.status == 200) {
      yield put(walletCheckSuccess(response?.data));
    } else {
      yield put(walletCheckFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(walletCheckFailure(error));
  }
}
export function* FreeCheckSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Transaction/freeRegister', action.payload, header);
    console.log('Transaction/freeRegister response: ', response);
    if (response?.status == 200) {
      yield put(FreeTransSuccess(response?.data));
    } else {
      yield put(FreeTransFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(FreeTransFailure(error));
  }
}
export function* FreeCartSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Transaction/cartFreeRegister', action.payload, header);
    console.log('Transaction/cartFreeRegister response: ', response);
    if (response?.status == 200) {
      yield put(FreeCartSuccess(response?.data));
    } else {
      yield put(FreeCartFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(FreeCartFailure(error));
  }
}
export function* PrimePayemntSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'UserSubscription/payment', action.payload, header);
    console.log('UserSubscription/payment response: ', response);
    if (response?.status == 200) {
      yield put(PrimePaymentSuccess(response?.data));
    } else {
      yield put(PrimePaymentFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(PrimePaymentFailure(error));
  }
}
export function* PrimeCheckSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'UserSubscription/details', action?.payload?.key ? action?.payload?.key : action?.payload, header);
    console.log('UserSubscription/details response: ', response);
    if (response?.status == 200) {
      yield put(PrimeCheckSuccess(response?.data));
    } else {
      yield put(PrimeCheckFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(PrimeCheckFailure(error));
  }
}
export function* RegisterIntPrSaga(action) {
  console.log('hi');
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'Transaction/interestConference', action.payload, header);
    console.log('Transaction/interestConference response: ', response);
    if (response?.status == 200) {
      yield put(RegisterIntSuccess(response?.data));
    } else {
      yield put(RegisterIntFailure(response?.data));
    }
  } catch (error) {
    console.log('webcast error:', error);
    yield put(RegisterIntFailure(error));
  }
}
const watchFunction = [
  (function* () {
    yield takeLatest('WebCast/webcastDeatilsRequest', webcastDetailsSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/webcastsearchRequest', webcastSearchSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/webcastviewallRequest', webcastAllSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/webcastStateRequest', webcastStateSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/saveTicketRequest', saveTicketSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/saveTicketInpersonRequest', saveTicketInpersonSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/saveRegistRequest', saveRegistSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/webcastPaymentRequest', webcastPaymentSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/addtoCartWebcastRequest', addtoCartWebcastSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/cartcountWebcastRequest', cartCountWebcastSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/cartdetailsWebcastRequest', cartDetailsWebcastSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/cartdeleteWebcastRequest', cartdeleteWebcastSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/couponWebcastRequest', couponapplySaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/cancelcouponRequest', cancelcouponSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/cartCheckoutRequest', cartCheckoutSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/cartPaymentRequest', cartPaymentSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/TransemailcheckRequest',TransEmailCheckSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/StatusPaymentRequest',StatusPaymentSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/PaymentCheckRequest',PaymentCheckSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/walletCheckRequest',walletCheckSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/FreeTransRequest',FreeCheckSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/FreeCartRequest',FreeCartSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/PrimePaymentRequest',PrimePayemntSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/PrimeCheckRequest',PrimeCheckSaga);
  })(),
  (function* () {
    yield takeLatest('WebCast/RegisterIntRequest',RegisterIntPrSaga);
  })()
];

export default watchFunction;
