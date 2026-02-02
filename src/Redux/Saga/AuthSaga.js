import { takeLatest, select, put, call } from 'redux-saga/effects';
import {
  signupSuccess,
  signupFailure,
  loginSuccess,
  loginFailure,
  tokenSuccess,
  tokenFailure,
  professionSuccess,
  professionFailure,
  specializationSuccess,
  specializationFailure,
  stateSuccess,
  stateFailure,
  emailexistSuccess,
  emailexistFailure,
  verifyemailSuccess,
  verifyemailFailure,
  resendemailotpSuccess,
  resendemailotpFailure,
  verifymobileSuccess,
  verifymobileFailure,
  resendmobileotpSuccess,
  resendmobileotpFailure,
  changeemailSuccess,
  changeemailFailure,
  changephoneSuccess,
  changephoneFailure,
  forgotSuccess,
  forgotFailure,
  resetSuccess,
  resetFailure,
  loginsiginSuccess,
  loginsiginFailure,
  againloginsiginSuccess,
  againloginsiginFailure,
  chooseStatecardSuccess,
  chooseStatecardFailure,
  cityWiseSuccess,
  cityWiseFailure,
  stateInformSaveFailure,
  stateInformSaveSuccess,
  logoutSuccess,
  logoutFailure,
  verifySuccess,
  verifyFailure,
  phoneotpTokenSuccess,
  phoneotpTokenFailure,
  countrySuccess,
  countryFailure,
  citySuccess,
  cityFailure,
  staticdataSuccess,
  staticdataFailure,
  licesensSuccess,
  licesensFailure,
  urldataSuccess,
  urldataFailure,
  checkstateSuccess,
  checkstateFailure,
  allreducerFailure,
  allreducerSuccess,
  primeTrailSuccess,
  primeTrailFailure,
} from '../Reducers/AuthReducer';
import { postApi, getApi } from '../../Utils/Helpers/ApiRequest';
let getItem = state => state.AuthReducer;
import showErrorAlert from '../../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { dashboardSuccess, dashMbSuccess, mainprofileSuccess, stateDashboardSuccess } from '../Reducers/DashboardReducer';
import { PrimeCheckSuccess } from '../Reducers/WebcastReducer';
import { getPublicIP } from '../../Utils/Helpers/IPServer';


///token

export function* gettokenSaga(action) {
  try {
    const response = yield call(AsyncStorage.getItem, constants.TOKEN);
    if (action?.payload?.token) {
      yield put(tokenSuccess(action?.payload?.token));
    } else if (response != null) {
      yield put(tokenSuccess(response));
    } else {
      yield put(tokenSuccess(null));
    }
  } catch (error) {
    yield put(tokenFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* allreducerFalse(action) {
  try {
    if (action) {
      yield put(allreducerSuccess(null));
      yield put(tokenSuccess(null));
      yield put(signupSuccess({}));
      yield put(loginSuccess({}));
      yield put(loginsiginSuccess({}));
      yield put(mainprofileSuccess({}))
      yield put(PrimeCheckSuccess({}))
      yield put(againloginsiginSuccess(null))
    }
  } catch (error) {
    yield put(allreducerFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
////////signup

export function* signupSaga(action) {
  const ipAddress = getPublicIP();
  // let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    IPADDRESS:ipAddress ? ipAddress :""
    // authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/signup', action.payload, header);
    if (response?.data?.success == true) {
      yield put(tokenSuccess(response?.data?.token));
      yield put(signupSuccess(response?.data));
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      showErrorAlert(response?.data?.msg);
    } else {
      yield put(signupFailure(response.data));
      showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(signupFailure(error));
    showErrorAlert(error?.response?.data?.message);
    showErrorAlert("!Oops something went wrong ");
  }
}

export function* forgotSaga(action) {
  // let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    // authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/forgotPasswordPhone', action.payload, header);
    if (response?.data?.success == true) {
      yield put(forgotSuccess(response?.data));
      // showErrorAlert(response?.data?.msg);
    } else {
      yield put(forgotFailure(response.data));
      // showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(forgotFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* resetPassSaga(action) {
  // let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    // authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/resetPassword', action.payload, header);
    if (response?.data?.success == true) {
      yield put(resetSuccess(response?.data));
      // showErrorAlert(response?.data?.msg);
    } else {
      yield put(resetFailure(response.data));
      // showErrorAlert(response?.data?.msg);
    }
  } catch (error) {
    yield put(resetFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* existEmailSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, action?.payload?.phone ? 'User/userPhoneExists' : 'user/userExists', action.payload, header);
    if (response?.status == 200) {
      yield put(emailexistSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(emailexistFailure(response.data));
      // showErrorAlert(response.data);
    }
  } catch (error) {
    yield put(emailexistFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* verifyEmalOTPSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token,
  };
  try {
    let response = yield call(postApi, 'user/verifyOTP', action.payload, header);
    if (response?.status == 200) {
      yield put(verifyemailSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(verifyemailFailure(response.data));
      // showErrorAlert(response.data);
    }
  } catch (error) {
    yield put(verifyemailFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* resendEmalOTPSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token,
  };
  try {
    let response = yield call(postApi, 'user/resendOTP', action.payload, header);
    if (response?.status == 200) {
      yield put(resendemailotpSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.EMAILOTP, response?.data?.email_otp);
      showErrorAlert(response.data.msg);
    } else {
      yield put(resendemailotpFailure(response.data));
      // showErrorAlert(response.data);
    }
  } catch (error) {
    yield put(resendemailotpFailure(error));
    showErrorAlert(error?.response?.data?.msg);
  }
}
const storeVerifyStateData = async (data) => {
  try {
    if (data == undefined || data == null) {
      console.warn('Cannot store undefined/null in AsyncStorage');
      return; // Exit early
    }
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem('VERIFYSTATEDATA', jsonData);
    console.log('Data successfully saved.');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
export function* verifyMobileOTPSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token,
  };
  try {
    let response = yield call(postApi, 'user/verifyOTP', action.payload, header);
    if (response?.data?.success == true) {
      storeVerifyStateData(response?.data?.user)
      yield put(verifymobileSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(verifymobileFailure(response.data));
      // showErrorAlert(response.data);
    }
  } catch (error) {
    yield put(verifymobileFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* resendMobileOTPSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token,
  };
  try {
    let response = yield call(postApi, 'user/resendOTP', action.payload, header);
    if (response?.status == 200) {
      yield put(resendmobileotpSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.PHONEOTP, response?.data?.phone_otp);
      showErrorAlert(response.data.msg);
    } else {
      yield put(resendmobileotpFailure(response.data));
      // showErrorAlert(response.data);
    }
  } catch (error) {
    yield put(resendmobileotpFailure(error));
    showErrorAlert(error?.response?.data?.msg);
  }
}

export function* changeEmailSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token,
  };
  try {
    let response = yield call(postApi, 'user/modifyEmailorPhone', action.payload, header);
    if (response?.data?.success == true) {
      yield put(changeemailSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.EMAILOTP, response?.data?.email_otp);
      showErrorAlert(response.data.msg);
    } else {
      yield put(changeemailFailure(response.data));
      showErrorAlert(response.data.msg);
    }
  } catch (error) {
    yield put(changeemailFailure(error));
    showErrorAlert(error?.response?.data?.msg);
  }
}

export function* chnageMobilenoSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token,
  };
  try {
    let response = yield call(postApi, 'user/modifyEmailorPhone', action.payload, header);
    if (response?.data?.success == true) {
      yield put(changephoneSuccess(response?.data));
      // yield call(AsyncStorage.setItem, constants.PHONEOTP, response?.data?.phone_otp);
      showErrorAlert(response.data.msg);
    } else {
      yield put(changephoneFailure(response.data));
      showErrorAlert(response.data.msg);
    }
  } catch (error) {
    yield put(changephoneFailure(error));
    showErrorAlert(error?.response?.data?.msg);
  }
}
/////////login

export function* login_Saga(action) {
  const ipAddress = getPublicIP();
  // let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    IPADDRESS:ipAddress ? ipAddress :""
    // authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/signin', action.payload, header);
    if (response?.data?.success == true) {
      const userData = JSON.stringify(response?.data?.user);
      yield call(AsyncStorage.setItem, constants.PROFESSION, userData);
      yield put(loginSuccess(response?.data));
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      yield put(tokenSuccess(response?.data?.token));
      // showErrorAlert(response?.data?.msg);
    } else if (response?.data?.success == false) {
      yield put(loginSuccess(response?.data));
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      yield call(AsyncStorage.setItem, constants.EMAIL, response?.data?.email);
      yield call(AsyncStorage.setItem, constants.PHONE, response?.data?.phone);
      yield put(tokenSuccess(response?.data?.token));
    } else {
      yield put(loginFailure(response?.data));
      showErrorAlert("Your email or password is incorrect.");
    }
  } catch (error) {
    yield put(loginFailure(error));
    // showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
//Profession 
export function* ProfessionSaga() {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(getApi, 'master/professionCredentials', header);
    if (response?.status == 200) {
      yield put(professionSuccess(response?.data));
    } else {
      yield put(professionFailure(response?.data));
    }
  } catch (error) {
    yield put(professionFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* SpeciallizedSaga(action) {
  const profession = action?.payload
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(getApi, action?.payload?.master == "" ? 'master/specialities' : `master/specialities?profession=${profession}`, header);
    if (response?.status == 200) {
      yield put(specializationSuccess(response?.data));
    } else {
      yield put(specializationFailure(response?.data));
    }
  } catch (error) {
    yield put(specializationFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}

export function* ParticingStateSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(getApi, `master/states?country_id=${action.payload}`, header);
    if (response?.status == 200) {
      yield put(stateSuccess(response?.data));
    } else {
      yield put(stateFailure(response?.data));
    }
  } catch (error) {
    yield put(stateFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* CheckLicStateSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(getApi, `master/states?country_id=${action.payload}`, header);
    if (response?.status == 200) {
      yield put(checkstateSuccess(response?.data));
    } else {
      yield put(checkstateFailure(response?.data));
    }
  } catch (error) {
    yield put(checkstateFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* countrySaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(getApi, 'master/countries', header);
    if (response?.data?.success == true) {
      yield put(countrySuccess(response?.data));
    } else {
      yield put(countryFailure(response?.data));
    }
  } catch (error) {
    yield put(countryFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* citySaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(getApi, `master/cities?state_id=${action.payload}`, header);
    if (response?.data?.success == true) {
      yield put(citySuccess(response?.data));
    } else {
      yield put(cityFailure(response?.data));
    }
  } catch (error) {
    yield put(cityFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* mobileLoginSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'user/signinOTP', action.payload, header);
    if (response?.data?.success == true || response?.status == 200) {
      yield put(loginsiginSuccess(response?.data));
      yield put(tokenSuccess(response?.data?.token));
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
    } else if (response?.data?.success == false) {
      yield put(loginsiginSuccess(response?.data));
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      yield put(tokenSuccess(response?.data?.token));
    } else {
      yield put(loginsiginFailure(response?.data));
      showErrorAlert(response?.data?.msg)
    }
  } catch (error) {
    yield put(loginsiginFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* againmobileLoginSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, action.payload?.phone_otp ? 'user/signinOTP' : 'user/signinOTP', action.payload, header);
    if (response?.data?.success == true) {
      const userData = JSON.stringify(response?.data?.user);
      yield call(AsyncStorage.setItem, constants.PROFESSION, userData);
      yield put(againloginsiginSuccess(response?.data));
      yield put(tokenSuccess(response?.data?.token));
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
    } else if (response?.data?.success == false) {
      yield put(againloginsiginSuccess(null));
      yield put(tokenSuccess(null));
    } else {
      yield put(againloginsiginFailure(response?.data));
      showErrorAlert(response?.data?.msg)
    }
  } catch (error) {
    yield put(againloginsiginFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* stateLicsenseCardSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token || action?.payload?.token
  };
  try {
    let response = yield call(postApi, 'NpiLookup/search', action?.payload?.key ? action?.payload?.key : action?.payload, header);
    if (response?.data?.success == true) {
      yield put(chooseStatecardSuccess(response?.data));
      // showErrorAlert(response?.data?.msg);
    } else {
      yield put(chooseStatecardFailure(response?.data));
      // showErrorAlert("Your email or password is incorrect.");
    }
  } catch (error) {
    yield put(chooseStatecardFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* InformationCitySaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(getApi, `master/cities?state_id=${action.payload}`, header);
    if (response?.status == 200) {
      yield put(cityWiseSuccess(response?.data));
    } else {
      yield put(cityWiseFailure(response?.data));
    }
  } catch (error) {
    yield put(cityWiseFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* LicesensureSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(getApi, `master/licensureStates?profession=${encodeURIComponent(action.payload)}`, header);
    if (response?.status == 200) {
      yield put(licesensSuccess(response?.data));
    } else {
      yield put(licesensFailure(response?.data));
    }
  } catch (error) {
    yield put(licesensFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* stateLicsenseSaveSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'NpiLookup/save', action.payload, header);
    if (response?.data?.success == true) {
      yield put(stateInformSaveSuccess(response?.data));
      // showErrorAlert(response?.data?.msg);
    } else {
      yield put(stateInformSaveFailure(response?.data));
      // showErrorAlert("Your email or password is incorrect.");
    }
  } catch (error) {
    yield put(stateInformSaveFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* logoutSaga() {
  try {
    // yield call(AsyncStorage.removeItem, constants.CRED);
    yield call(AsyncStorage.removeItem, constants.VERIFYSTATEDATA);
    yield call(AsyncStorage.removeItem, constants.PROFESSION);
    yield call (AsyncStorage.removeItem, constants.EMAVER);
    yield call (AsyncStorage.removeItem, constants.MOBVER);
    yield call (AsyncStorage.removeItem,constants.WHOLEDATA);
    yield call (AsyncStorage.removeItem, constants.PRODATA);
    yield call(AsyncStorage.removeItem, constants.EMAIL);
    yield call(AsyncStorage.removeItem, constants.PHONE);
    yield call(AsyncStorage.removeItem, constants.TOKEN);
    yield put(tokenSuccess(null));
    yield put(dashboardSuccess(null));
    yield put(dashMbSuccess(null))
    yield put(stateDashboardSuccess(null))
    yield put(logoutSuccess('logout'));
    showErrorAlert('Logged out Successfully');
  } catch (error) {
    yield put(logoutFailure(error));
    showErrorAlert('Error to logout');
  }
}
const emailVerf = async (data) => {
  try {
    if (data == undefined || data == null) {
      console.warn('Cannot store undefined/null in AsyncStorage');
      return; // Exit early
    }
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem('EMAVER', jsonData);
    console.log('Data successfully saved.');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
const mobileVer = async (data) => {
  try {
    if (data == undefined || data == null) {
      console.warn('Cannot store undefined/null in AsyncStorage');
      return; // Exit early
    }
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem('MOBVER', jsonData);
    console.log('Data successfully saved.');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
export function* verifyTokenSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token || action?.payload?.token,
  };
  try {
    let response = yield call(postApi, 'user/verifyToken', action?.payload?.key ? action?.payload?.key : action?.payload, header);
    if (response?.data?.success == true) {
      emailVerf(response?.data?.is_verified);
      mobileVer(response?.data?.phone_verified);
      yield put(verifySuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(verifyFailure(response.data));
      // showErrorAlert(response.data);
    }
  } catch (error) {
    yield put(verifyFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}
export function* PhoneOTPTokenSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token,
  };
  try {
    let response = yield call(postApi, 'user/verifyToken', action.payload, header);
    if (response?.data?.success == true) {
      yield put(phoneotpTokenSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(phoneotpTokenFailure(response.data));
      // showErrorAlert(response.data);
    }
  } catch (error) {
    yield put(phoneotpTokenFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}

export function* userPrimeCheck(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items?.token,
  };
  try {
    let response = yield call(postApi, 'User/saveUserPrimeTrial', action.payload, header);
    if (response?.data?.success == true) {
      yield put(primeTrailSuccess(response?.data));
      // showErrorAlert(response.data.message);
    } else {
      yield put(primeTrailFailure(response.data));
      // showErrorAlert(response.data);
    }
  } catch (error) {
    yield put(primeTrailFailure(error));
    showErrorAlert("!Oops something went wrong ");
    // showErrorAlert(error?.response?.data?.message);
  }
}

export function* staticSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    if (action?.payload) {
      yield put(staticdataSuccess(action?.payload));
    } else {
      yield put(staticdataFailure(action?.payload));
    }
  } catch (error) {
    yield put(staticdataFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
export function* urlneedSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    if (action?.payload) {
      yield put(urldataSuccess(action?.payload));
    } else {
      yield put(urldataFailure(action?.payload));
    }
  } catch (error) {
    yield put(urldataFailure(error));
    showErrorAlert("!Oops something went wrong ");
  }
}
const watchFunction = [
  (function* () {
    yield takeLatest('Auth/signupRequest', signupSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/forgotRequest', forgotSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/resetRequest', resetPassSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/emailexistRequest', existEmailSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/verifyemailRequest', verifyEmalOTPSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/resendemailotpRequest', resendEmalOTPSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/verifymobileRequest', verifyMobileOTPSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/resendmobileotpRequest', resendMobileOTPSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/loginRequest', login_Saga);
  })(),
  (function* () {
    yield takeLatest('Auth/tokenRequest', gettokenSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/professionRequest', ProfessionSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/specializationRequest', SpeciallizedSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/stateRequest', ParticingStateSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/checkstateRequest', CheckLicStateSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/countryRequest', countrySaga);
  })(),
  (function* () {
    yield takeLatest('Auth/cityRequest', citySaga);
  })(),
  (function* () {
    yield takeLatest('Auth/changeemailRequest', changeEmailSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/changephoneRequest', chnageMobilenoSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/loginsiginRequest', mobileLoginSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/againloginsiginRequest', againmobileLoginSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/chooseStatecardRequest', stateLicsenseCardSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/cityWiseRequest', InformationCitySaga);
  })(),
  (function* () {
    yield takeLatest('Auth/licesensRequest', LicesensureSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/stateInformSaveRequest', stateLicsenseSaveSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/logoutRequest', logoutSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/verifyRequest', verifyTokenSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/phoneotpTokenRequest', PhoneOTPTokenSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/staticdataRequest', staticSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/urldataRequest', urlneedSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/allreducerRequest', allreducerFalse);
  })(),
   (function* () {
    yield takeLatest('Auth/primeTrailRequest', userPrimeCheck);
  })()
];

export default watchFunction;
