/**
 * Profile reducer Redux slice module. Manages application state and exposes action creators for profile. Exported members: initialState, ProfileSlice.
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Profile slice state shape.
 *
 * @typedef {Object} ProfileState
 * @property {string} status
 * @property {string|null} token
 * @property {boolean} isLoading
 * @property {Record<string, unknown>} contactInfoResponse
 * @property {Record<string, unknown>} profilepicResponse
 * @property {Record<string, unknown>} personalInfoResponse
 * @property {Record<string, unknown>} professionInfoResponse
 * @property {Record<string, unknown>} latestProfessionInfo
 * @property {Record<string, unknown>} stateLicenseListResponse
 * @property {Record<string, unknown>} stateLicenseDeleteResponse
 * @property {Record<string, unknown>} boardListProfileResponse
 * @property {Record<string, unknown>} boardListDeleteResponse
 * @property {Record<string, unknown>} EmpAddProfileResponse
 * @property {Record<string, unknown>} SearchHospResponse
 * @property {string|undefined} error
 */
/**
 * Initial state constant.
 *
 * @type {ProfileState}
 */
const initialState = {
  status: '',
  token: null,
  isLoading: true,
  contactInfoResponse: {},
  profilepicResponse: {},
  personalInfoResponse:{},
  professionInfoResponse:{},
  latestProfessionInfo:{},
  stateLicenseListResponse:{},
  stateLicenseDeleteResponse:{},
  boardListProfileResponse:{},
  boardListDeleteResponse:{},
  EmpAddProfileResponse:{},
  SearchHospResponse:{}
};

/**
 * Profile slice value.
 *
 * @type {import('@reduxjs/toolkit').Slice<ProfileState>}
 */
const ProfileSlice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
        /**
 * Reducer logic for contact info request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
contactInfoRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for contact info success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
contactInfoSuccess(state, action) {
      state.contactInfoResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for contact info failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
contactInfoFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for profilepic request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
profilepicRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for profilepic success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
profilepicSuccess(state, action) {
      state.profilepicResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for personal info request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
personalInfoRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for personal info success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
personalInfoSuccess(state, action) {
      state.personalInfoResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for personal info failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
personalInfoFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for profession info request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionInfoRequest(state, action) {
      state.latestProfessionInfo = action.payload || {};
      state.status = action.type;
    },
        /**
 * Reducer logic for profession info success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionInfoSuccess(state, action) {
      state.professionInfoResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for profession info failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionInfoFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for state license list request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateLicenseListRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for state license list success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateLicenseListSuccess(state, action) {
      state.stateLicenseListResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for state license list failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateLicenseListFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for state license delete request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateLicenseDeleteRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for state license delete success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateLicenseDeleteSuccess(state, action) {
      state.stateLicenseDeleteResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for state license delete failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
stateLicenseDeleteFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for board list profile request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardListProfileRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for board list profile success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardListProfileSuccess(state, action) {
      state.boardListProfileResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for board list profile failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardListProfileFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for board list delete request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardListDeleteRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for board list delete success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardListDeleteSuccess(state, action) {
      state.boardListDeleteResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for board list delete failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardListDeleteFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Emp add profile request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
EmpAddProfileRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Emp add profile success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
EmpAddProfileSuccess(state, action) {
      state.EmpAddProfileResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Emp add profile failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
EmpAddProfileFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Search hosp request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
SearchHospRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Search hosp success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
SearchHospSuccess(state, action) {
      state.SearchHospResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Search hosp failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
SearchHospFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
  },
});

export const {
  contactInfoRequest,
  contactInfoFailure,
  contactInfoSuccess,
  profilepicFailure,
  profilepicRequest,
  profilepicSuccess,
  personalInfoFailure,
  personalInfoSuccess,
  personalInfoRequest,
  professionInfoSuccess,
  professionInfoFailure,
  professionInfoRequest,
  stateLicenseListFailure,
  stateLicenseListRequest,
  stateLicenseListSuccess,
  stateLicenseDeleteFailure,
  stateLicenseDeleteRequest,
  stateLicenseDeleteSuccess,
  boardListProfileRequest,
  boardListProfileFailure,
  boardListProfileSuccess,
  boardListDeleteFailure,
  boardListDeleteRequest,
  boardListDeleteSuccess,
  EmpAddProfileFailure,
  EmpAddProfileRequest,
  EmpAddProfileSuccess,
  SearchHospFailure,
  SearchHospRequest,
  SearchHospSuccess
} = ProfileSlice.actions;
/**
 * Profile reducer default export.
 *
 * @returns {*}
 */
export default ProfileSlice.reducer;
