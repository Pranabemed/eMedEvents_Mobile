import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  token: null,
  isLoading: true,
  page: 1,
  signupResponse: {},
  verifyemailResponse:{},
  verifymobileResponse:{},
  resendemailotpResponse:{},
  resendmobileotpResponse:{},
  emailexistResponse:{},
  loginResponse: {},
  forgotResponse:{},
  resetResponse:{},
  professionResponse:{},
  specializationResponse:{},
  stateResponse:{},
  checkstateResponse:{},
  countryResponse:{},
  cityResponse:{},
  changeemailResponse:{},
  changephoneResponse:{},
  loginsiginResponse:{},
  againloginsiginResponse:{},
  chooseStatecardResponse:{},
  cityWiseResponse:{},
  stateInformSaveResponse:{},
  logoutResponse:{},
  verifyResponse:{},
  phoneotpTokenResponse:{},
  staticdataResponse:{},
  licesensResponse:{},
  urldataResponse:{},
  allreducerResponse:{},
  primeTrailResponse:{}
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    signupRequest(state, action) {
      state.status = action.type;
    },
    signupSuccess(state, action) {
      state.signupResponse = action.payload;
      state.status = action.type;
    },
    signupFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    forgotRequest(state, action) {
      state.status = action.type;
    },
    forgotSuccess(state, action) {
      state.forgotResponse = action.payload;
      state.status = action.type;
    },
    forgotFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    resetRequest(state, action) {
      state.status = action.type;
    },
    resetSuccess(state, action) {
      state.resetResponse = action.payload;
      state.status = action.type;
    },
    resetFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    emailexistRequest(state, action) {
      state.status = action.type;
    },
    emailexistSuccess(state, action) {
      state.emailexistResponse = action.payload;
      state.status = action.type;
    },
    emailexistFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    tokenRequest(state, action) {
      state.status = action.type;
    },
    tokenSuccess(state, action) {
      state.token = action.payload;
      state.status = action.type;
      state.isLoading = false;
    },
    tokenFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    loginRequest(state, action) {
      state.status = action.type;
    },
    loginSuccess(state, action) {
      state.loginResponse = action.payload;
      state.status = action.type;
    },
    loginFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    professionRequest(state, action) {
      state.status = action.type;
    },
    professionSuccess(state, action) {
      state.professionResponse = action.payload;
      state.status = action.type;
    },
    professionFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    specializationRequest(state, action) {
      state.status = action.type;
    },
    specializationSuccess(state, action) {
      state.specializationResponse = action.payload;
      state.status = action.type;
    },
    specializationFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    countryRequest(state, action) {
      state.status = action.type;
    },
    countrySuccess(state, action) {
      state.countryResponse = action.payload;
      state.status = action.type;
    },
    countryFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    stateRequest(state, action) {
      state.status = action.type;
    },
    stateSuccess(state, action) {
      state.stateResponse = action.payload;
      state.status = action.type;
    },
    stateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    checkstateRequest(state, action) {
      state.status = action.type;
    },
    checkstateSuccess(state, action) {
      state.checkstateResponse = action.payload;
      state.status = action.type;
    },
    checkstateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    licesensRequest(state, action) {
      state.status = action.type;
    },
    licesensSuccess(state, action) {
      state.licesensResponse = action.payload;
      state.status = action.type;
    },
    licesensFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cityRequest(state, action) {
      state.status = action.type;
    },
    citySuccess(state, action) {
      state.cityResponse = action.payload;
      state.status = action.type;
    },
    cityFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    verifyemailRequest(state, action) {
      state.status = action.type;
    },
    verifyemailSuccess(state, action) {
      state.verifyemailResponse = action.payload;
      state.status = action.type;
    },
    verifyemailFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    resendemailotpRequest(state, action) {
      state.status = action.type;
    },
    resendemailotpSuccess(state, action) {
      state.resendemailotpResponse = action.payload;
      state.status = action.type;
    },
    resendemailotpFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    verifymobileRequest(state, action) {
      state.status = action.type;
    },
    verifymobileSuccess(state, action) {
      state.verifymobileResponse = action.payload;
      state.status = action.type;
    },
    verifymobileFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    resendmobileotpRequest(state, action) {
      state.status = action.type;
    },
    resendmobileotpSuccess(state, action) {
      state.resendmobileotpResponse = action.payload;
      state.status = action.type;
    },
    resendmobileotpFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    changeemailRequest(state, action) {
      state.status = action.type;
    },
    changeemailSuccess(state, action) {
      state.changeemailResponse = action.payload;
      state.status = action.type;
    },
    changeemailFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    changephoneRequest(state, action) {
      state.status = action.type;
    },
    changephoneSuccess(state, action) {
      state.changephoneResponse = action.payload;
      state.status = action.type;
    },
    changephoneFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    loginsiginRequest(state, action) {
      state.status = action.type;
    },
    loginsiginSuccess(state, action) {
      state.loginsiginResponse = action.payload;
      state.status = action.type;
    },
    loginsiginFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    againloginsiginRequest(state, action) {
      state.status = action.type;
    },
    againloginsiginSuccess(state, action) {
      state.againloginsiginResponse = action.payload;
      state.status = action.type;
    },
    againloginsiginFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    chooseStatecardRequest(state, action) {
      state.status = action.type;
    },
    chooseStatecardSuccess(state, action) {
      state.chooseStatecardResponse = action.payload;
      state.status = action.type;
    },
    chooseStatecardFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cityWiseRequest(state, action) {
      state.status = action.type;
    },
    cityWiseSuccess(state, action) {
      state.cityWiseResponse = action.payload;
      state.status = action.type;
    },
    cityWiseFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    stateInformSaveRequest(state, action) {
      state.status = action.type;
    },
    stateInformSaveSuccess(state, action) {
      state.stateInformSaveResponse = action.payload;
      state.status = action.type;
    },
    stateInformSaveFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    logoutRequest(state, action) {
      state.status = action.type;
    },
    logoutSuccess(state, action) {
      state.logoutResponse = action.payload;
      state.status = action.type;
    },
    logoutFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    verifyRequest(state, action) {
      state.status = action.type;
    },
    verifySuccess(state, action) {
      state.verifyResponse = action.payload;
      state.status = action.type;
    },
    verifyFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    phoneotpTokenRequest(state, action) {
      state.status = action.type;
    },
    phoneotpTokenSuccess(state, action) {
      state.phoneotpTokenResponse = action.payload;
      state.status = action.type;
    },
    phoneotpTokenFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    staticdataRequest(state, action) {
      state.status = action.type;
    },
    staticdataSuccess(state, action) {
      state.staticdataResponse = action.payload;
      state.status = action.type;
    },
    staticdataFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    urldataRequest(state, action) {
      state.status = action.type;
    },
    urldataSuccess(state, action) {
      state.urldataResponse = action.payload;
      state.status = action.type;
    },
    urldataFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    allreducerRequest(state, action) {
      state.status = action.type;
    },
    allreducerSuccess(state, action) {
      state.allreducerResponse = action.payload;
      state.status = action.type;
    },
    allreducerFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
     primeTrailRequest(state, action) {
      state.status = action.type;
    },
    primeTrailSuccess(state, action) {
      state.primeTrailResponse = action.payload;
      state.status = action.type;
    },
    primeTrailFailure(state, action) {
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
  tokenRequest,
  tokenSuccess,
  tokenFailure,
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
  primeTrailSuccess
} = AuthSlice.actions;
export default AuthSlice.reducer;
