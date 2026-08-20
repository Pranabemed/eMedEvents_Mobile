/**
 * Auth reducer Redux slice module.
 *
 * Manages authentication state, cached token values, API responses, and the
 * action creators used by auth-related sagas and screens.
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Auth slice state shape.
 *
 * @typedef {Object} AuthState
 * @property {string} status
 * @property {string} headerStatus
 * @property {string|null} token
 * @property {string|null} basicAuthToken
 * @property {boolean} isLoading
 * @property {number} page
 * @property {Record<string, unknown>} signupResponse
 * @property {Record<string, unknown>} verifyemailResponse
 * @property {Record<string, unknown>} verifymobileResponse
 * @property {Record<string, unknown>} resendemailotpResponse
 * @property {Record<string, unknown>} resendmobileotpResponse
 * @property {Record<string, unknown>} emailexistResponse
 * @property {Record<string, unknown>} loginResponse
 * @property {Record<string, unknown>} forgotResponse
 * @property {Record<string, unknown>} resetResponse
 * @property {Record<string, unknown>} professionResponse
 * @property {Record<string, unknown>} specializationResponse
 * @property {Record<string, unknown>} stateResponse
 * @property {Record<string, unknown>} checkstateResponse
 * @property {Record<string, unknown>} countryResponse
 * @property {Record<string, unknown>} cityResponse
 * @property {Record<string, unknown>} changeemailResponse
 * @property {Record<string, unknown>} changephoneResponse
 * @property {Record<string, unknown>} loginsiginResponse
 * @property {Record<string, unknown>} againloginsiginResponse
 * @property {Record<string, unknown>} chooseStatecardResponse
 * @property {Record<string, unknown>} cityWiseResponse
 * @property {Record<string, unknown>} stateInformSaveResponse
 * @property {Record<string, unknown>} logoutResponse
 * @property {Record<string, unknown>} verifyResponse
 * @property {Record<string, unknown>} phoneotpTokenResponse
 * @property {Record<string, unknown>} staticdataResponse
 * @property {Record<string, unknown>} licesensResponse
 * @property {Record<string, unknown>} urldataResponse
 * @property {Record<string, unknown>} allreducerResponse
 * @property {Record<string, unknown>} primeTrailResponse
 * @property {Record<string, unknown>} refreshTokenResponse
 * @property {Record<string, unknown>} directloginResponse
 * @property {Record<string, unknown>} dircetloginResponse
 * @property {string|null} refreshToken
 * @property {string|null} headerError
 * @property {string|undefined} emailexistType
 * @property {string|undefined} error
 */

/**
 * Initial auth slice state.
 *
 * @type {AuthState}
 */
const initialState = {
  status: '',
  headerStatus: '',
  token: null,
  basicAuthToken: null,
  isLoading: true,
  page: 1,
  signupResponse: {},
  verifyemailResponse: {},
  verifymobileResponse: {},
  resendemailotpResponse: {},
  resendmobileotpResponse: {},
  emailexistResponse: {},
  loginResponse: {},
  forgotResponse: {},
  resetResponse: {},
  professionResponse: {},
  specializationResponse: {},
  stateResponse: {},
  checkstateResponse: {},
  countryResponse: {},
  cityResponse: {},
  changeemailResponse: {},
  changephoneResponse: {},
  loginsiginResponse: {},
  againloginsiginResponse: {},
  chooseStatecardResponse: {},
  cityWiseResponse: {},
  stateInformSaveResponse: {},
  logoutResponse: {},
  verifyResponse: {},
  phoneotpTokenResponse: {},
  staticdataResponse: {},
  licesensResponse: {},
  urldataResponse: {},
  allreducerResponse: {},
  primeTrailResponse: {},
  refreshTokenResponse: {},
  directloginResponse: {},
  dircetloginResponse: {},
  refreshToken: null,
  headerError: null
};

/**
 * Auth slice definition.
 *
 * @type {import('@reduxjs/toolkit').Slice<AuthState>}
 */
const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
        /**
 * Reducer logic for signup request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
signupRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for signup success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
signupSuccess(state, action) {
      state.signupResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for signup failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
signupFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for forgot request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
forgotRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for forgot success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
forgotSuccess(state, action) {
      state.forgotResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for forgot failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
forgotFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for reset request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
resetRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for reset success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
resetSuccess(state, action) {
      state.resetResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for reset failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
resetFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for emailexist request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
emailexistRequest(state, action) {
      state.status = action.type;
      state.emailexistType = action.payload?.phone ? 'phone' : 'email';
      state.emailexistResponse = {};
    },
        /**
 * Reducer logic for emailexist success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
emailexistSuccess(state, action) {
      state.emailexistResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for emailexist failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
emailexistFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for clear emailexist state state.
 * @param {*} state - Input value.
 * @returns {void}
 */
clearEmailexistState(state) {
      state.emailexistResponse = {};
      state.emailexistType = undefined;
      if (
        state.status === 'Auth/emailexistRequest' ||
        state.status === 'Auth/emailexistSuccess' ||
        state.status === 'Auth/emailexistFailure'
      ) {
        state.status = '';
      }
    },
        /**
 * Reducer logic for token request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
tokenRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for token success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
tokenSuccess(state, action) {
      state.token = action.payload;
      state.status = action.type;
      state.isLoading = false;
    },
        /**
 * Reducer logic for token failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
tokenFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for header request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
headerRequest(state, action) {
      state.headerStatus = action.type;
      state.headerError = null;
    },
        /**
 * Reducer logic for header success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
headerSuccess(state, action) {
      state.basicAuthToken = action.payload;
      state.headerStatus = action.type;
      state.headerError = null;
    },
        /**
 * Reducer logic for header failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
headerFailure(state, action) {
      state.headerStatus = action.type;
      state.headerError = action.error || action.payload;
    },
        /**
 * Reducer logic for login request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
loginRequest(state, action) {
      state.status = action.type;
    },
    directloginRequest(state, action) {
      state.directloginResponse = null;
      state.dircetloginResponse = null;
      state.status = action.type;
    },
    dircetloginRequest(state, action) {
      state.directloginResponse = null;
      state.dircetloginResponse = null;
      state.status = action.type;
    },
    directloginSuccess(state, action) {
      state.directloginResponse = action.payload;
      state.dircetloginResponse = action.payload;
      state.status = action.type;
    },
    dircetloginSuccess(state, action) {
      state.directloginResponse = action.payload;
      state.dircetloginResponse = action.payload;
      state.status = action.type;
    },
    directloginFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    dircetloginFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for login success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
loginSuccess(state, action) {
      state.loginResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for login failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
loginFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for profession request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for profession success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionSuccess(state, action) {
      state.professionResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for profession failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for specialization request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
specializationRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for specialization success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
specializationSuccess(state, action) {
      state.specializationResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for specialization failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
specializationFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for country request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
countryRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for country success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
countrySuccess(state, action) {
      state.countryResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for country failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
countryFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for state request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for state success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateSuccess(state, action) {
      state.stateResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for state failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for checkstate request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
checkstateRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for checkstate success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
checkstateSuccess(state, action) {
      state.checkstateResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for checkstate failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
checkstateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for licesens request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
licesensRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for licesens success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
licesensSuccess(state, action) {
      state.licesensResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for licesens failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
licesensFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for city request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cityRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for city success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
citySuccess(state, action) {
      state.cityResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for city failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cityFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for verifyemail request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
verifyemailRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for verifyemail success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
verifyemailSuccess(state, action) {
      state.verifyemailResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for verifyemail failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
verifyemailFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for resendemailotp request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
resendemailotpRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for resendemailotp success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
resendemailotpSuccess(state, action) {
      state.resendemailotpResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for resendemailotp failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
resendemailotpFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for verifymobile request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
verifymobileRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for verifymobile success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
verifymobileSuccess(state, action) {
      state.verifymobileResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for verifymobile failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
verifymobileFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for resendmobileotp request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
resendmobileotpRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for resendmobileotp success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
resendmobileotpSuccess(state, action) {
      state.resendmobileotpResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for resendmobileotp failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
resendmobileotpFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for changeemail request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
changeemailRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for changeemail success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
changeemailSuccess(state, action) {
      state.changeemailResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for changeemail failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
changeemailFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for changephone request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
changephoneRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for changephone success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
changephoneSuccess(state, action) {
      state.changephoneResponse = action.payload;
      const newPh = action.payload?.phone || action.payload?.mobile || action.payload?.phone_number;
      if (newPh) {
        if (state.loginResponse?.user) state.loginResponse.user.phone = newPh;
        if (state.verifymobileResponse?.user) state.verifymobileResponse.user.phone = newPh;
        if (state.againloginsiginResponse?.user) state.againloginsiginResponse.user.phone = newPh;
        if (state.signupResponse?.user) state.signupResponse.user.phone = newPh;
      }
      state.status = action.type;
    },
        /**
 * Reducer logic for changephone failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
changephoneFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for loginsigin request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
loginsiginRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for loginsigin success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
loginsiginSuccess(state, action) {
      state.loginsiginResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for loginsigin failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
loginsiginFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for againloginsigin request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
againloginsiginRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for againloginsigin success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
againloginsiginSuccess(state, action) {
      state.againloginsiginResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for againloginsigin failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
againloginsiginFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for choose statecard request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
chooseStatecardRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for choose statecard success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
chooseStatecardSuccess(state, action) {
      state.chooseStatecardResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for choose statecard failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
chooseStatecardFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for city wise request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cityWiseRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for city wise success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cityWiseSuccess(state, action) {
      state.cityWiseResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for city wise failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cityWiseFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for state inform save request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateInformSaveRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for state inform save success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateInformSaveSuccess(state, action) {
      state.stateInformSaveResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for state inform save failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateInformSaveFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for logout request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
logoutRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for logout success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
logoutSuccess(state, action) {
      state.logoutResponse = action.payload;
      state.dircetloginResponse = null;
      state.directloginResponse = null;
      state.loginResponse = null;
      state.againloginsiginResponse = null;
      state.verifymobileResponse = null;
      state.signupResponse = null;
      state.tokenResponse = null;
      state.status = action.type;
    },
        /**
 * Reducer logic for logout failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
logoutFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
        /**
 * Reducer logic for verify request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
verifyRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for verify success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
verifySuccess(state, action) {
      state.verifyResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for verify failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
verifyFailure(state, action) {
      state.verifyResponse = action.payload;
      state.error = action.error;
      state.status = action.type;
    },
        /**
 * Reducer logic for phoneotp token request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
phoneotpTokenRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for phoneotp token success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
phoneotpTokenSuccess(state, action) {
      state.phoneotpTokenResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for phoneotp token failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
phoneotpTokenFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
        /**
 * Reducer logic for staticdata request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
staticdataRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for staticdata success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
staticdataSuccess(state, action) {
      state.staticdataResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for staticdata failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
staticdataFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
        /**
 * Reducer logic for urldata request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
urldataRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for urldata success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
urldataSuccess(state, action) {
      state.urldataResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for urldata failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
urldataFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
        /**
 * Reducer logic for allreducer request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
allreducerRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for allreducer success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
allreducerSuccess(state, action) {
      state.allreducerResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for allreducer failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
allreducerFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
        /**
 * Reducer logic for prime trail request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
primeTrailRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for prime trail success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
primeTrailSuccess(state, action) {
      state.primeTrailResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for prime trail failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
primeTrailFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
        /**
 * Reducer logic for refresh token request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
refreshTokenRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for refresh token success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
refreshTokenSuccess(state, action) {
      state.refreshTokenResponse = action.payload;
      state.refreshToken = action.payload?.token || null;
      state.token = action.payload?.token || state.token;
      state.status = action.type;
    },
        /**
 * Reducer logic for refresh token failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
refreshTokenFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
  },
});

export const {
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  forgotRequest,
  forgotSuccess,
  forgotFailure,
  resetRequest,
  resetSuccess,
  resetFailure,
  emailexistRequest,
  emailexistSuccess,
  emailexistFailure,
  clearEmailexistState,
  tokenRequest,
  tokenSuccess,
  tokenFailure,
  headerRequest,
  headerSuccess,
  headerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  professionRequest,
  professionSuccess,
  professionFailure,
  specializationRequest,
  specializationSuccess,
  specializationFailure,
  countryFailure,
  countryRequest,
  countrySuccess,
  stateRequest,
  stateSuccess,
  stateFailure,
  checkstateRequest,
  checkstateSuccess,
  checkstateFailure,
  cityRequest,
  cityFailure,
  citySuccess,
  verifyemailRequest,
  verifyemailSuccess,
  verifyemailFailure,
  resendemailotpRequest,
  resendemailotpSuccess,
  resendemailotpFailure,
  verifymobileRequest,
  verifymobileSuccess,
  verifymobileFailure,
  resendmobileotpRequest,
  resendmobileotpSuccess,
  resendmobileotpFailure,
  changeemailRequest,
  changeemailSuccess,
  changeemailFailure,
  changephoneRequest,
  changephoneSuccess,
  changephoneFailure,
  loginsiginRequest,
  loginsiginSuccess,
  loginsiginFailure,
  againloginsiginRequest,
  againloginsiginSuccess,
  againloginsiginFailure,
  chooseStatecardSuccess,
  chooseStatecardFailure,
  chooseStatecardRequest,
  cityWiseSuccess,
  cityWiseFailure,
  cityWiseRequest,
  stateInformSaveSuccess,
  stateInformSaveFailure,
  stateInformSaveRequest,
  verifyRequest,
  verifySuccess,
  verifyFailure,
  phoneotpTokenFailure,
  phoneotpTokenSuccess,
  phoneotpTokenRequest,
  staticdataFailure,
  staticdataRequest,
  staticdataSuccess,
  licesensFailure,
  licesensRequest,
  licesensSuccess,
  urldataFailure,
  urldataRequest,
  urldataSuccess,
  allreducerFailure,
  allreducerRequest,
  allreducerSuccess,
  primeTrailFailure,
  primeTrailRequest,
  primeTrailSuccess,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  directloginRequest,
  directloginSuccess,
  directloginFailure,
  dircetloginRequest,
  dircetloginSuccess,
  dircetloginFailure,
} = AuthSlice.actions;
/**
 * Auth reducer default export.
 *
 * @returns {*}
 */
export default AuthSlice.reducer;
