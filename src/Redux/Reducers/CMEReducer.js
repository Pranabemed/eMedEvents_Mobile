/**
 * Cmereducer Redux slice module. Manages application state and exposes action creators for cmereducer. Exported members: initialState, CMESlice.
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * CME slice state shape.
 *
 * @typedef {Object} CMEState
 * @property {string} status
 * @property {string|null} token
 * @property {boolean} isLoading
 * @property {Record<string, unknown>} cmeCourseResponse
 * @property {Record<string, unknown>} cmereviewResponse
 * @property {Record<string, unknown>} cmeactivityResponse
 * @property {Record<string, unknown>} cmenextactionResponse
 * @property {Record<string, unknown>} cmedulicateResponse
 * @property {Record<string, unknown>} activityfulfilmentResponse
 * @property {Record<string, unknown>} startTestResponse
 * @property {Record<string, unknown>} actvityBreakupResponse
 * @property {Record<string, unknown>} evaulateexamResponse
 * @property {Record<string, unknown>} evaulatecalculateResponse
 * @property {Record<string, unknown>} certificatewiseexamResponse
 * @property {Record<string, unknown>} nextactionagainResponse
 * @property {Record<string, unknown>} CMEPlannerResponse
 * @property {Record<string, unknown>} CMEPlannerEditResponse
 * @property {Record<string, unknown>} CMEPlannerDelResponse
 * @property {Record<string, unknown>} ConfActResponse
 * @property {string|undefined} error
 */
/**
 * Initial state constant.
 *
 * @type {CMEState}
 */
const initialState = {
  status: '',
  token: null,
  isLoading: true,
  cmeCourseResponse: {},
  cmereviewResponse: {},
  cmeactivityResponse: {},
  cmenextactionResponse: {},
  cmedulicateResponse: {},
  activityfulfilmentResponse: {},
  startTestResponse: {},
  actvityBreakupResponse: {},
  evaulateexamResponse: {},
  evaulatecalculateResponse: {},
  certificatewiseexamResponse: {},
  nextactionagainResponse: {},
  CMEPlannerResponse: {},
  CMEPlannerEditResponse: {},
  CMEPlannerDelResponse: {},
  ConfActResponse:{}
};

/**
 * Cmeslice value.
 *
 * @type {import('@reduxjs/toolkit').Slice<CMEState>}
 */
const CMESlice = createSlice({
  name: 'CME',
  initialState,
  reducers: {
        /**
 * Reducer logic for cme course request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmeCourseRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cme course success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmeCourseSuccess(state, action) {
      state.cmeCourseResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cme course failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmeCourseFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for clear cme course data state.
 * @param {*} state - Input value.
 * @returns {void}
 */
clearCmeCourseData(state) {
      state.cmeCourseResponse = {};
      state.status = '';
    },
        /**
 * Reducer logic for cmereview request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmereviewRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cmereview success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmereviewSuccess(state, action) {
      state.cmereviewResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cmereview failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmereviewFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },

        /**
 * Reducer logic for cmeactivity request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmeactivityRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cmeactivity success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmeactivitySuccess(state, action) {
      state.cmeactivityResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cmeactivity failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmeactivityFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for cmenextaction request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmenextactionRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cmenextaction success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmenextactionSuccess(state, action) {
      state.cmenextactionResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cmenextaction failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmenextactionFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for cmedulicate request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmedulicateRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cmedulicate success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmedulicateSuccess(state, action) {
      state.cmedulicateResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cmedulicate failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cmedulicateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for activityfulfilment request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
activityfulfilmentRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for activityfulfilment success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
activityfulfilmentSuccess(state, action) {
      state.activityfulfilmentResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for activityfulfilment failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
activityfulfilmentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for start test request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
startTestRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for start test success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
startTestSuccess(state, action) {
      state.startTestResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for start test failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
startTestFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for actvity breakup request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
actvityBreakupRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for actvity breakup success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
actvityBreakupSuccess(state, action) {
      state.actvityBreakupResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for actvity breakup failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
actvityBreakupFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for evaulateexam request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
evaulateexamRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for evaulateexam success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
evaulateexamSuccess(state, action) {
      state.evaulateexamResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for evaulateexam failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
evaulateexamFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for evaulatecalculate request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
evaulatecalculateRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for evaulatecalculate success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
evaulatecalculateSuccess(state, action) {
      state.evaulatecalculateResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for evaulatecalculate failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
evaulatecalculateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for certificatewiseexam request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
certificatewiseexamRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for certificatewiseexam success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
certificatewiseexamSuccess(state, action) {
      state.certificatewiseexamResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for certificatewiseexam failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
certificatewiseexamFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for nextactionagain request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
nextactionagainRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for nextactionagain success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
nextactionagainSuccess(state, action) {
      state.nextactionagainResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for nextactionagain failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
nextactionagainFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Cmeplanner request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEPlannerRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Cmeplanner success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEPlannerSuccess(state, action) {
      state.CMEPlannerResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Cmeplanner failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEPlannerFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Cmeplanner edit request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEPlannerEditRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Cmeplanner edit success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEPlannerEditSuccess(state, action) {
      state.CMEPlannerEditResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Cmeplanner edit failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEPlannerEditFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Cmeplanner del request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEPlannerDelRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Cmeplanner del success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEPlannerDelSuccess(state, action) {
      state.CMEPlannerDelResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Cmeplanner del failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEPlannerDelFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Conf act request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
ConfActRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Conf act success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
ConfActSuccess(state, action) {
      state.ConfActResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Conf act failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
ConfActFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
  },
});

export const {
  cmeCourseRequest,
  cmeCourseSuccess,
  cmeCourseFailure,
  clearCmeCourseData,
  cmereviewRequest,
  cmereviewSuccess,
  cmereviewFailure,
  cmeactivityRequest,
  cmeactivitySuccess,
  cmeactivityFailure,
  cmenextactionRequest,
  cmenextactionSuccess,
  cmenextactionFailure,
  cmedulicateFailure,
  cmedulicateRequest,
  cmedulicateSuccess,
  activityfulfilmentRequest,
  activityfulfilmentSuccess,
  activityfulfilmentFailure,
  startTestRequest,
  startTestSuccess,
  startTestFailure,
  actvityBreakupFailure,
  actvityBreakupSuccess,
  actvityBreakupRequest,
  evaulateexamFailure,
  evaulateexamRequest,
  evaulateexamSuccess,
  evaulatecalculateFailure,
  evaulatecalculateRequest,
  evaulatecalculateSuccess,
  certificatewiseexamFailure,
  certificatewiseexamSuccess,
  certificatewiseexamRequest,
  nextactionagainFailure,
  nextactionagainSuccess,
  nextactionagainRequest,
  CMEPlannerRequest,
  CMEPlannerFailure,
  CMEPlannerSuccess,
  CMEPlannerEditFailure,
  CMEPlannerEditSuccess,
  CMEPlannerEditRequest,
  CMEPlannerDelFailure,
  CMEPlannerDelSuccess,
  CMEPlannerDelRequest,
  ConfActFailure,
  ConfActRequest,
  ConfActSuccess
} = CMESlice.actions;
/**
 * Cmereducer default export.
 *
 * @returns {*}
 */
export default CMESlice.reducer;
