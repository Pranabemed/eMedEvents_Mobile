import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  token: null,
  isLoading: true,
  dashboardResponse:{},
  stateDashboardResponse:{},
  stateCourseResponse:{},
  addCreditsResponse:{},
  addCreditVaultResponse:{},
  stateMandatoryResponse:{},
  stateLicesenseResponse:{},
  stateReportingResponse:{},
  boardSpecialityResponse:{},
  boardcertificateResponse:{},
  countResponse:{},
  boardcountResponse:{},
  OCRCertificateResponse:{},
  mainprofileResponse:{},
  specailtyResponse:{},
  dashMbResponse:{},
  dashPerResponse:{},
  changePasswordResponse:{}
};

const DashboardSlice = createSlice({
  name: 'Dashboard',
  initialState,
  reducers: {
    dashboardRequest(state, action) {
      state.status = action.type;
    },
    dashboardSuccess(state, action) {
      state.dashboardResponse = action.payload;
      state.status = action.type;
    },
    dashboardFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    stateDashboardRequest(state, action) {
      state.status = action.type;
    },
    stateDashboardSuccess(state, action) {
      state.stateDashboardResponse = action.payload;
      state.status = action.type;
    },
    stateDashboardFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },  
    stateCourseRequest(state, action) {
      state.status = action.type;
    },
    stateCourseSuccess(state, action) {
      state.stateCourseResponse = action.payload;
      state.status = action.type;
    },
    stateCourseFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },   
    addCreditsRequest(state, action) {
      state.status = action.type;
    },
    addCreditsSuccess(state, action) {
      state.addCreditsResponse = action.payload;
      state.status = action.type;
    },
    addCreditsFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    addCreditVaultRequest(state, action) {
      state.status = action.type;
    },
    addCreditVaultSuccess(state, action) {
      state.addCreditVaultResponse = action.payload;
      state.status = action.type;
    },
    addCreditVaultFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    stateMandatoryRequest(state, action) {
      state.status = action.type;
    },
    stateMandatorySuccess(state, action) {
      state.stateMandatoryResponse = action.payload;
      state.status = action.type;
    },
    stateMandatoryFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    stateLicesenseRequest(state, action) {
      state.status = action.type;
    },
    stateLicesenseSuccess(state, action) {
      state.stateLicesenseResponse = action.payload;
      state.status = action.type;
    },
    stateLicesenseFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    stateReportingRequest(state, action) {
      state.status = action.type;
    },
    stateReportingSuccess(state, action) {
      state.stateReportingResponse = action.payload;
      state.status = action.type;
    },
    stateReportingFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    boardSpecialityRequest(state, action) {
      state.status = action.type;
    },
    boardSpecialitySuccess(state, action) {
      state.boardSpecialityResponse = action.payload;
      state.status = action.type;
    },
    boardSpecialityFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    boardcertificateRequest(state, action) {
      state.status = action.type;
    },
    boardcertificateSuccess(state, action) {
      state.boardcertificateResponse = action.payload;
      state.status = action.type;
    },
    boardcertificateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    countRequest(state, action) {
      state.status = action.type;
    },
    countSuccess(state, action) {
      state.countResponse = action.payload;
      state.status = action.type;
    },
    countFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    boardcountRequest(state, action) {
      state.status = action.type;
    },
    boardcountSuccess(state, action) {
      state.boardcountResponse = action.payload;
      state.status = action.type;
    },
    boardcountFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    OCRCertificateRequest(state, action) {
      state.status = action.type;
    },
    OCRCertificateSuccess(state, action) {
      state.OCRCertificateResponse = action.payload;
      state.status = action.type;
    },
    OCRCertificateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    mainprofileRequest(state, action) {
      state.status = action.type;
    },
    mainprofileSuccess(state, action) {
      state.mainprofileResponse = action.payload;
      state.status = action.type;
    },
    mainprofileFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    specailtyRequest(state, action) {
      state.status = action.type;
    },
    specailtySuccess(state, action) {
      state.specailtyResponse = action.payload;
      state.status = action.type;
    },
    specailtyFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    dashMbRequest(state, action) {
      state.status = action.type;
    },
    dashMbSuccess(state, action) {
      state.dashMbResponse = action.payload;
      state.status = action.type;
    },
    dashMbFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    dashPerRequest(state, action) {
      state.status = action.type;
    },
    dashPerSuccess(state, action) {
      state.dashPerResponse = action.payload;
      state.status = action.type;
    },
    dashPerFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
     changePasswordRequest(state, action) {
      state.status = action.type;
    },
    changePasswordSuccess(state, action) {
      state.changePasswordResponse = action.payload;
      state.status = action.type;
    },
    changePasswordFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
  },
});

export const {
  dashboardRequest,
  dashboardSuccess,
  dashboardFailure,
  stateDashboardRequest,
  stateDashboardSuccess,
  stateDashboardFailure,
  stateCourseRequest,
  stateCourseSuccess,
  stateCourseFailure,
  addCreditsRequest,
  addCreditsSuccess,
  addCreditsFailure,
  addCreditVaultSuccess,
  addCreditVaultFailure,
  addCreditVaultRequest,
  stateMandatorySuccess,
  stateMandatoryFailure,
  stateMandatoryRequest,
  stateLicesenseSuccess,
  stateLicesenseRequest,
  stateLicesenseFailure,
  stateReportingSuccess,
  stateReportingFailure,
  stateReportingRequest,
  boardSpecialitySuccess,
  boardSpecialityFailure,
  boardSpecialityRequest,
  boardcertificateSuccess,
  boardcertificateFailure,
  boardcertificateRequest,
  countSuccess,
  countFailure,
  countRequest,
  boardcountSuccess,
  boardcountFailure,
  boardcountRequest,
  OCRCertificateFailure,
  OCRCertificateSuccess,
  OCRCertificateRequest,
  mainprofileFailure,
  mainprofileSuccess,
  mainprofileRequest,
  specailtyFailure,
  specailtyRequest,
  specailtySuccess,
  dashMbFailure,
  dashMbRequest,
  dashMbSuccess,
  dashPerFailure,
  dashPerRequest,
  dashPerSuccess,
  changePasswordFailure,
  changePasswordRequest,
  changePasswordSuccess
} = DashboardSlice.actions;
export default DashboardSlice.reducer;
