import { createSlice } from '@reduxjs/toolkit';

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

const CMESlice = createSlice({
  name: 'CME',
  initialState,
  reducers: {
    cmeCourseRequest(state, action) {
      state.status = action.type;
    },
    cmeCourseSuccess(state, action) {
      state.cmeCourseResponse = action.payload;
      state.status = action.type;
    },
    cmeCourseFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cmereviewRequest(state, action) {
      state.status = action.type;
    },
    cmereviewSuccess(state, action) {
      state.cmereviewResponse = action.payload;
      state.status = action.type;
    },
    cmereviewFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },

    cmeactivityRequest(state, action) {
      state.status = action.type;
    },
    cmeactivitySuccess(state, action) {
      state.cmeactivityResponse = action.payload;
      state.status = action.type;
    },
    cmeactivityFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cmenextactionRequest(state, action) {
      state.status = action.type;
    },
    cmenextactionSuccess(state, action) {
      state.cmenextactionResponse = action.payload;
      state.status = action.type;
    },
    cmenextactionFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cmedulicateRequest(state, action) {
      state.status = action.type;
    },
    cmedulicateSuccess(state, action) {
      state.cmedulicateResponse = action.payload;
      state.status = action.type;
    },
    cmedulicateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    activityfulfilmentRequest(state, action) {
      state.status = action.type;
    },
    activityfulfilmentSuccess(state, action) {
      state.activityfulfilmentResponse = action.payload;
      state.status = action.type;
    },
    activityfulfilmentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    startTestRequest(state, action) {
      state.status = action.type;
    },
    startTestSuccess(state, action) {
      state.startTestResponse = action.payload;
      state.status = action.type;
    },
    startTestFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    actvityBreakupRequest(state, action) {
      state.status = action.type;
    },
    actvityBreakupSuccess(state, action) {
      state.actvityBreakupResponse = action.payload;
      state.status = action.type;
    },
    actvityBreakupFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    evaulateexamRequest(state, action) {
      state.status = action.type;
    },
    evaulateexamSuccess(state, action) {
      state.evaulateexamResponse = action.payload;
      state.status = action.type;
    },
    evaulateexamFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    evaulatecalculateRequest(state, action) {
      state.status = action.type;
    },
    evaulatecalculateSuccess(state, action) {
      state.evaulatecalculateResponse = action.payload;
      state.status = action.type;
    },
    evaulatecalculateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    certificatewiseexamRequest(state, action) {
      state.status = action.type;
    },
    certificatewiseexamSuccess(state, action) {
      state.certificatewiseexamResponse = action.payload;
      state.status = action.type;
    },
    certificatewiseexamFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    nextactionagainRequest(state, action) {
      state.status = action.type;
    },
    nextactionagainSuccess(state, action) {
      state.nextactionagainResponse = action.payload;
      state.status = action.type;
    },
    nextactionagainFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    CMEPlannerRequest(state, action) {
      state.status = action.type;
    },
    CMEPlannerSuccess(state, action) {
      state.CMEPlannerResponse = action.payload;
      state.status = action.type;
    },
    CMEPlannerFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    CMEPlannerEditRequest(state, action) {
      state.status = action.type;
    },
    CMEPlannerEditSuccess(state, action) {
      state.CMEPlannerEditResponse = action.payload;
      state.status = action.type;
    },
    CMEPlannerEditFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    CMEPlannerDelRequest(state, action) {
      state.status = action.type;
    },
    CMEPlannerDelSuccess(state, action) {
      state.CMEPlannerDelResponse = action.payload;
      state.status = action.type;
    },
    CMEPlannerDelFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    ConfActRequest(state, action) {
      state.status = action.type;
    },
    ConfActSuccess(state, action) {
      state.ConfActResponse = action.payload;
      state.status = action.type;
    },
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
export default CMESlice.reducer;
