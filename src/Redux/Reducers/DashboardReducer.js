/**
 * Dashboard reducer Redux slice module. Manages application state and exposes action creators for dashboard. Exported members: initialState, DashboardSlice.
 */

import {createSlice} from '@reduxjs/toolkit';

/**
 * Dashboard slice state shape.
 *
 * @typedef {Object} DashboardState
 * @property {string} status
 * @property {string|null} token
 * @property {boolean} isLoading
 * @property {Record<string, unknown>} dashboardResponse
 * @property {Record<string, unknown>} stateDashboardResponse
 * @property {Record<string, unknown>} stateCourseResponse
 * @property {Record<string, unknown>} addCreditsResponse
 * @property {Record<string, unknown>} addCreditVaultResponse
 * @property {Record<string, unknown>} stateMandatoryResponse
 * @property {Record<string, unknown>} stateLicesenseResponse
 * @property {Record<string, unknown>} stateReportingResponse
 * @property {Record<string, unknown>} boardSpecialityResponse
 * @property {Record<string, unknown>} boardcertificateResponse
 * @property {Record<string, unknown>} countResponse
 * @property {Record<string, unknown>} boardcountResponse
 * @property {Record<string, unknown>} OCRCertificateResponse
 * @property {Record<string, unknown>} mainprofileResponse
 * @property {Record<string, unknown>} specailtyResponse
 * @property {Record<string, unknown>} dashMbResponse
 * @property {Record<string, unknown>} dashPerResponse
 * @property {Record<string, unknown>} changePasswordResponse
 * @property {string|undefined} error
 */
/**
 * Initial state constant.
 *
 * @type {DashboardState}
 */
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

/**
 * Dashboard slice value.
 *
 * @type {import('@reduxjs/toolkit').Slice<DashboardState>}
 */
const DashboardSlice = createSlice({
  name: 'Dashboard',
  initialState,
  reducers: {
        /**
 * Reducer logic for dashboard request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
dashboardRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for dashboard success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
dashboardSuccess(state, action) {
      state.dashboardResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for dashboard failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
dashboardFailure(state, action) {
      state.dashboardResponse = action.payload;
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for state dashboard request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateDashboardRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for state dashboard success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateDashboardSuccess(state, action) {
      state.stateDashboardResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for state dashboard failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateDashboardFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },  
        /**
 * Reducer logic for state course request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateCourseRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for state course success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateCourseSuccess(state, action) {
      state.stateCourseResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for state course failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateCourseFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },   
        /**
 * Reducer logic for add credits request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
addCreditsRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for add credits success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
addCreditsSuccess(state, action) {
      state.addCreditsResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for add credits failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
addCreditsFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for add credit vault request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
addCreditVaultRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for add credit vault success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
addCreditVaultSuccess(state, action) {
      state.addCreditVaultResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for add credit vault failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
addCreditVaultFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for state mandatory request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateMandatoryRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for state mandatory success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateMandatorySuccess(state, action) {
      state.stateMandatoryResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for state mandatory failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateMandatoryFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for state licesense request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateLicesenseRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for state licesense success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateLicesenseSuccess(state, action) {
      state.stateLicesenseResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for state licesense failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateLicesenseFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for state reporting request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateReportingRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for state reporting success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateReportingSuccess(state, action) {
      state.stateReportingResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for state reporting failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateReportingFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for board speciality request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardSpecialityRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for board speciality success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardSpecialitySuccess(state, action) {
      state.boardSpecialityResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for board speciality failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardSpecialityFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for boardcertificate request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardcertificateRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for boardcertificate success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardcertificateSuccess(state, action) {
      state.boardcertificateResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for boardcertificate failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardcertificateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for count request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
countRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for count success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
countSuccess(state, action) {
      state.countResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for count failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
countFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for boardcount request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardcountRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for boardcount success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardcountSuccess(state, action) {
      state.boardcountResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for boardcount failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardcountFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Ocrcertificate request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
OCRCertificateRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Ocrcertificate success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
OCRCertificateSuccess(state, action) {
      state.OCRCertificateResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Ocrcertificate failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
OCRCertificateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for mainprofile request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
mainprofileRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for mainprofile success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
mainprofileSuccess(state, action) {
      state.mainprofileResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for mainprofile failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
mainprofileFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for specailty request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
specailtyRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for specailty success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
specailtySuccess(state, action) {
      state.specailtyResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for specailty failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
specailtyFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for dash mb request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
dashMbRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for dash mb success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
dashMbSuccess(state, action) {
      state.dashMbResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for dash mb failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
dashMbFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for dash per request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
dashPerRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for dash per success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
dashPerSuccess(state, action) {
      state.dashPerResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for dash per failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
dashPerFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
          /**
 * Reducer logic for change password request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
changePasswordRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for change password success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
changePasswordSuccess(state, action) {
      state.changePasswordResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for change password failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
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
/**
 * Dashboard reducer default export.
 *
 * @returns {*}
 */
export default DashboardSlice.reducer;
