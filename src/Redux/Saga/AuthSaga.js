import { takeLatest, select, put, call } from 'redux-saga/effects';
import {
  signupSuccess,
  signupFailure,
  loginSuccess,
  loginFailure,
  tokenSuccess,
  tokenFailure,
  headerSuccess,
  headerFailure,
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
  refreshTokenFailure,
} from '../Reducers/AuthReducer';
import { postApi, getApi } from '../../Utils/Helpers/ApiRequest';
import axios from 'axios';
import { getBasicAuthorizationHeader } from '../../Utils/Helpers/BasicAuth';
import getUserAgentJSON from '../../Utils/Helpers/UserAgent';
let getItem = state => state.AuthReducer;
import showErrorAlert from '../../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { doRefreshToken } from '../../Utils/Helpers/TokenRefresh';
import { fetchAndStoreBasicAuthToken } from '../../Utils/Helpers/BasicAuth';
import { dashboardSuccess, dashMbSuccess, dashPerSuccess, mainprofileSuccess, stateDashboardSuccess } from '../Reducers/DashboardReducer';
import { PrimeCheckSuccess } from '../Reducers/WebcastReducer';
import { getPublicIP } from '../../Utils/Helpers/IPServer';
import {
  isNonUsaAccount,
  writeNonUsaFlowState,
  clearNonUsaFlowState,
  NON_USA_PROFESSION_UPDATE_REQUIRED_KEY,
  NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY,
} from '../../Utils/Helpers/nonUsaFlow';


///token

function* fetchBasicAuthTokenSaga() {
  try {
    const basicAuthToken = yield call(fetchAndStoreBasicAuthToken);

    if (basicAuthToken) {
      yield put(headerSuccess(basicAuthToken));
      return basicAuthToken;
    }

    yield call(AsyncStorage.removeItem, constants.BASIC_AUTH_TOKEN);
    yield put(headerFailure('Unable to fetch basic auth token'));
    return null;
  } catch (error) {
    yield call(AsyncStorage.removeItem, constants.BASIC_AUTH_TOKEN);
    yield put(headerFailure(error));
    return null;
  }
}

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
    IPADDRESS: ipAddress ? ipAddress : ""
    // authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/signup', action.payload, header);
    if (response?.data?.success == true) {
      yield put(tokenSuccess(response?.data?.token));
      yield put(signupSuccess(response?.data));
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      if (response?.data?.refresh_token) {
        yield call(AsyncStorage.setItem, constants.REFRESH_TOKEN, response?.data?.refresh_token);
      }
      const userData = response?.data?.user || response?.data || {};
      yield call(AsyncStorage.setItem, constants.PROFESSION, JSON.stringify(userData));
      yield call(AsyncStorage.setItem, constants.AUTH_USER_DATA, JSON.stringify(response?.data));
      const isNonUsa = isNonUsaAccount({
        ...action?.payload,
        ...userData,
        countryCode: action?.payload?.countryCode || action?.payload?.country_code,
        callingCode: action?.payload?.countryCode || action?.payload?.country_code,
        usa_user: action?.payload?.signup_usa === false ? false : userData?.usa_user,
      });
      if (isNonUsa) {
        yield call(writeNonUsaFlowState, {
          userType: 'non_usa',
          isNonUsa: true,
          signupCompleted: true,
          professionCompleted: true,
          emailVerified: Boolean(userData?.is_verified === 1 || userData?.is_verified === '1' || userData?.email_verified === 1 || userData?.email_verified === '1'),
          email: userData?.email || action?.payload?.email || '',
          profession: action?.payload?.profession || userData?.profession || '',
          profession_type: action?.payload?.profession_type || userData?.profession_type || '',
          countryCode: action?.payload?.countryCode || action?.payload?.country_code || '',
        });
      }
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
      const userData = response?.data?.user || response?.data || {};
      const isNonUsa = isNonUsaAccount(userData);
      if (isNonUsa) {
        yield call(writeNonUsaFlowState, {
          userType: 'non_usa',
          isNonUsa: true,
          emailVerified: true,
          professionCompleted: true,
          signupCompleted: true,
          email: userData?.email || action?.payload?.email || '',
          profession: userData?.profession || '',
          profession_type: userData?.profession_type || '',
        });
      }
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
  // items.token may be null right after login (Redux hasn't propagated yet)
  // → fall back to reading the latest token directly from AsyncStorage
  const token = items?.token || (yield call(AsyncStorage.getItem, constants.TOKEN));
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: token,
  };
  try {
    let response = yield call(postApi, 'user/resendOTP', action.payload, header);
    if (response?.status == 200) {
      yield put(resendemailotpSuccess(response?.data));
      showErrorAlert(response.data.msg);
    } else {
      yield put(resendemailotpFailure(response.data));
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
      return;
    }
    const existing = await AsyncStorage.getItem(constants.VERIFYSTATEDATA);
    let finalUpdate = data;
    if (existing) {
      try {
        const oldData = JSON.parse(existing);
        if (typeof oldData === 'object' && typeof data === 'object') {
          finalUpdate = { ...oldData, ...data };
        }
      } catch (e) {
        console.error("Error parsing existing VERIFYSTATEDATA", e);
      }
    }
    const jsonData = JSON.stringify(finalUpdate);
    await AsyncStorage.setItem(constants.VERIFYSTATEDATA, jsonData);
    console.log('VERIFYSTATEDATA successfully saved.');
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
    IPADDRESS: ipAddress ? ipAddress : ""
    // authorization: items.token,
  };
  try {
    let response = yield call(postApi, 'user/signin', action.payload, header);
    if (response?.data?.success == true) {
      const existingProfessionRaw = yield call(AsyncStorage.getItem, constants.PROFESSION);
      let updatedUser = response?.data?.user;
      if (existingProfessionRaw && updatedUser) {
        try {
          const existingProfession = JSON.parse(existingProfessionRaw);
          if (existingProfession?.subscriptions && !updatedUser.subscriptions) {
            updatedUser = {
              ...updatedUser,
              subscriptions: existingProfession.subscriptions
            };
          }
        } catch (e) {
          console.log('Error parsing existing profession data:', e);
        }
      }
      const userData = JSON.stringify(updatedUser);
      yield call(AsyncStorage.setItem, constants.PROFESSION, userData);
      yield call(AsyncStorage.setItem, constants.AUTH_USER_DATA, JSON.stringify(response?.data));
      yield put(loginSuccess(response?.data));
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      yield put(tokenSuccess(response?.data?.token));
      if (response?.data?.refresh_token) {
        yield call(AsyncStorage.setItem, constants.REFRESH_TOKEN, response?.data?.refresh_token);
      }
    } else if (response?.data?.success == false) {
      yield put(loginSuccess(response?.data));
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      yield call(AsyncStorage.setItem, constants.EMAIL, response?.data?.email);
      yield call(AsyncStorage.setItem, constants.PHONE, response?.data?.phone);
      yield put(tokenSuccess(response?.data?.token));
      if (response?.data?.refresh_token) {
        yield call(AsyncStorage.setItem, constants.REFRESH_TOKEN, response?.data?.refresh_token);
      }
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
export function* ProfessionSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const isOtherCountry = action?.payload?.other_country == 1 || action?.payload?.other_country === 1;
    if (isOtherCountry) {
      let data = null;
      let success = false;
      const basicAuthToken = yield call(getBasicAuthorizationHeader);
      const userAgentHeader = getUserAgentJSON();
      const reqHeaders = {
        Accept: 'application/json',
        'Content-type': 'application/json',
        ...(basicAuthToken ? { Authorization: basicAuthToken } : {}),
        ...(userAgentHeader ? { userAgent: userAgentHeader } : {}),
      };
      try {
        console.log('Fetching professions from Primary API...');
        let response = yield call(axios.get, 'https://newdev.emedevents.com/master/professionCredentials?other_country=1', { headers: reqHeaders });
        if (response?.status == 200) {
          data = response.data;
          success = true;
        }
      } catch (err) {
        console.log('Primary API failed, trying Fallback API...', err);
      }

      if (!success) {
        let response = yield call(axios.get, 'https://v2api.emedevents.com/master/professionCredentials?other_country=1', { headers: reqHeaders });
        if (response?.status == 200) {
          data = response.data;
          success = true;
        }
      }

      if (success) {
        yield put(professionSuccess(data));
      } else {
        yield put(professionFailure({ message: 'Failed to fetch professions' }));
      }
    } else {
      const endpoint = 'master/professionCredentials';
      let response = yield call(getApi, endpoint, header);
      if (response?.status == 200) {
        yield put(professionSuccess(response?.data));
      } else {
        yield put(professionFailure(response?.data));
      }
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
    const apiData = response?.data || {};
    const nestedData = apiData?.data && typeof apiData.data === 'object' ? apiData.data : {};
    const normalizedData = { ...apiData, ...nestedData };
    const token = normalizedData?.token;
    const refreshToken = normalizedData?.refresh_token;
    if (normalizedData?.success == true) {
      const existingProfessionRaw = yield call(AsyncStorage.getItem, constants.PROFESSION);
      let updatedUser = normalizedData?.user;
      if (existingProfessionRaw && updatedUser) {
        try {
          const existingProfession = JSON.parse(existingProfessionRaw);
          if (existingProfession?.subscriptions && !updatedUser.subscriptions) {
            updatedUser = {
              ...updatedUser,
              subscriptions: existingProfession.subscriptions
            };
          }
        } catch (e) {
          console.log('Error parsing existing profession data:', e);
        }
      }
      yield call(AsyncStorage.setItem, constants.PROFESSION, JSON.stringify(updatedUser || normalizedData || {}));
      yield call(AsyncStorage.setItem, constants.AUTH_USER_DATA, JSON.stringify(normalizedData));
      yield put(loginsiginSuccess(normalizedData));
      yield put(tokenSuccess(token || null));
      if (token) {
        yield call(AsyncStorage.setItem, constants.TOKEN, token);
      } else {
        yield call(AsyncStorage.removeItem, constants.TOKEN);
      }
      if (refreshToken) {
        yield call(AsyncStorage.setItem, constants.REFRESH_TOKEN, refreshToken);
      } else {
        yield call(AsyncStorage.removeItem, constants.REFRESH_TOKEN);
      }
    } else if (normalizedData?.success == false) {
      yield put(loginsiginSuccess(normalizedData));
      yield put(tokenSuccess(token || null));
      if (token) {
        yield call(AsyncStorage.setItem, constants.TOKEN, token);
      } else {
        yield call(AsyncStorage.removeItem, constants.TOKEN);
      }
      if (refreshToken) {
        yield call(AsyncStorage.setItem, constants.REFRESH_TOKEN, refreshToken);
      } else {
        yield call(AsyncStorage.removeItem, constants.REFRESH_TOKEN);
      }
    } else {
      yield put(loginsiginFailure(normalizedData));
      showErrorAlert(normalizedData?.msg)
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
    const apiData = response?.data || {};
    const nestedData = apiData?.data && typeof apiData.data === 'object' ? apiData.data : {};
    const normalizedData = { ...apiData, ...nestedData };
    const token = normalizedData?.token;
    const refreshToken = normalizedData?.refresh_token;
    if (normalizedData?.success == true) {
      const existingProfessionRaw = yield call(AsyncStorage.getItem, constants.PROFESSION);
      let updatedUser = normalizedData?.user;
      if (existingProfessionRaw && updatedUser) {
        try {
          const existingProfession = JSON.parse(existingProfessionRaw);
          if (existingProfession?.subscriptions && !updatedUser.subscriptions) {
            updatedUser = {
              ...updatedUser,
              subscriptions: existingProfession.subscriptions
            };
          }
        } catch (e) {
          console.log('Error parsing existing profession data:', e);
        }
      }
      const userData = JSON.stringify(updatedUser || normalizedData || {});
      yield call(AsyncStorage.setItem, constants.PROFESSION, userData);
      yield call(AsyncStorage.setItem, constants.AUTH_USER_DATA, JSON.stringify(normalizedData));
      yield put(againloginsiginSuccess(normalizedData));
      yield put(tokenSuccess(token || null));
      if (token) {
        yield call(AsyncStorage.setItem, constants.TOKEN, token);
      } else {
        yield call(AsyncStorage.removeItem, constants.TOKEN);
      }
      if (refreshToken) {
        yield call(AsyncStorage.setItem, constants.REFRESH_TOKEN, refreshToken);
      } else {
        yield call(AsyncStorage.removeItem, constants.REFRESH_TOKEN);
      }
    } else if (normalizedData?.success == false) {
      yield put(againloginsiginSuccess(normalizedData));
      yield put(tokenSuccess(null));
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      yield call(AsyncStorage.removeItem, constants.REFRESH_TOKEN);
    } else {
      yield put(againloginsiginFailure(normalizedData));
      showErrorAlert(normalizedData?.msg)
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
    yield call(AsyncStorage.removeItem, constants.EMAVER);
    yield call(AsyncStorage.removeItem, constants.MOBVER);
    yield call(AsyncStorage.removeItem, constants.WHOLEDATA);
    yield call(AsyncStorage.removeItem, constants.DASHBOARD_CACHE);
    yield call(AsyncStorage.removeItem, constants.PRODATA);
    yield call(AsyncStorage.removeItem, constants.EMAIL);
    yield call(AsyncStorage.removeItem, constants.PHONE);
    yield call(AsyncStorage.removeItem, constants.TOKEN);
    yield call(AsyncStorage.removeItem, constants.REFRESH_TOKEN);
    yield call(AsyncStorage.removeItem, 'PLAYERSESSION');
    yield call(AsyncStorage.removeItem, 'PrimeMembershipSkipped');
    yield call(AsyncStorage.removeItem, 'SessionPrimeSkipped');
    yield call(AsyncStorage.removeItem, 'PrimeCardFlowComplete');
    yield call(AsyncStorage.removeItem, 'ExploreTrialClicked');
    yield call(AsyncStorage.removeItem, 'GuestPrimeVerifyPending');
    yield call(AsyncStorage.removeItem, 'CheckMembershipForceNewProfession');
    yield call(AsyncStorage.removeItem, 'activeProfile');
    yield call(clearNonUsaFlowState);
    yield call(AsyncStorage.removeItem, NON_USA_PROFESSION_UPDATE_REQUIRED_KEY);
    yield call(AsyncStorage.removeItem, NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY);
    yield put(tokenSuccess(null));
    yield put(dashboardSuccess(null));
    yield put(dashMbSuccess(null));
    yield put(dashPerSuccess(null));
    yield put(mainprofileSuccess(null));
    yield put(stateDashboardSuccess(null));
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
    const resData = response?.data;
    const isSuccess = response?.status == 200 || resData?.success == true || resData?.success == 1 || resData?.success == "true";
    console.log('verifyTokenSaga response:====', response, isSuccess);

    if (isSuccess) {
      const user = resData?.user || resData?.data || resData;
      const verified = user?.is_verified ?? user?.email_verified;
      const phoneVerified = user?.phone_verified;

      emailVerf(verified ?? "0");
      mobileVer(phoneVerified ?? "0");
      storeVerifyStateData(user); // Ensure VERIFYSTATEDATA is also updated!

      yield put(verifySuccess(resData));
    } else {
      yield put(verifyFailure(resData));
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

// ─── Refresh Token Saga ────────────────────────────────────────────────────

export function* refreshTokenSaga(action) {
  /**
   * ⚠️  Uses plain axios.post (NOT postApi / axiosInstance) so this call is
   *     completely outside the interceptor chain.
   *     If we used postApi here and verifyRefreshToken returned
   *     "Missing or Invalid Token", Interceptor B would try to refresh again,
   *     creating an infinite loop.
   */
  try {
    const newToken = yield call(doRefreshToken);
    if (newToken) {
      console.log('[refreshTokenSaga] ✅ Token refreshed successfully through shared TokenManager lock.');
    } else {
      yield put(refreshTokenFailure({ message: 'Refresh failed' }));
    }
  } catch (error) {
    console.error('[refreshTokenSaga] Network error:', error?.message || error);
    yield put(refreshTokenFailure({ message: error?.message || 'Refresh network error' }));
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
    yield takeLatest('Auth/headerRequest', fetchBasicAuthTokenSaga);
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
  })(),
  (function* () {
    yield takeLatest('Auth/refreshTokenRequest', refreshTokenSaga);
  })()
];

export default watchFunction;
