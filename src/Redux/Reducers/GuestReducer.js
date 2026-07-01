/**
 * Guest reducer Redux slice module. Manages application state and exposes action creators for guest. Exported members: initialState, GuestSlice.
 */

import {createSlice} from '@reduxjs/toolkit';

/**
 * Guest slice state shape.
 *
 * @typedef {Object} GuestState
 * @property {string} status
 * @property {string|null} token
 * @property {boolean} isLoading
 * @property {Record<string, unknown>} HomelistResponse
 * @property {Record<string, unknown>} AboutusResponse
 * @property {Record<string, unknown>} StateBundleLandingResponse
 * @property {boolean} stateBundleLandingLoading
 * @property {Record<string, unknown>} professionSaveResponse
 * @property {string|undefined} error
 */
/**
 * Initial state constant.
 *
 * @type {GuestState}
 */
const initialState = {
  status: '',
  token: null,
  isLoading: true,
  HomelistResponse:{},
  AboutusResponse:{},
  StateBundleLandingResponse:{},
  stateBundleLandingLoading:false,
  professionSaveResponse:{},
};

/**
 * Guest slice value.
 *
 * @type {import('@reduxjs/toolkit').Slice<GuestState>}
 */
const GuestSlice = createSlice({
  name: 'Guest',
  initialState,
  reducers: {
        /**
 * Homelist request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
HomelistRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Homelist success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
HomelistSuccess(state, action) {
      state.HomelistResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Homelist failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
HomelistFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Aboutus request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
AboutusRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Aboutus success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
AboutusSuccess(state, action) {
      state.AboutusResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Aboutus failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
AboutusFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * State bundle landing request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
StateBundleLandingRequest(state, action) {
      state.status = action.type;
      state.isLoading = true;
      state.stateBundleLandingLoading = true;
      state.StateBundleLandingResponse = {};
    },
        /**
 * State bundle landing success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
StateBundleLandingSuccess(state, action) {
      state.StateBundleLandingResponse = action.payload;
      state.status = action.type;
      state.isLoading = false;
      state.stateBundleLandingLoading = false;
    },
        /**
 * State bundle landing failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
StateBundleLandingFailure(state, action) {
      state.status = action.type;
      state.error = action.error || action.payload;
      state.isLoading = false;
      state.stateBundleLandingLoading = false;
    },
        /**
 * Reducer logic for profession save request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionSaveRequest(state, action) {
      state.status = action.type;
      state.isLoading = true;
      state.professionSaveResponse = {};
    },
        /**
 * Reducer logic for profession save success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionSaveSuccess(state, action) {
      state.professionSaveResponse = action.payload;
      state.status = action.type;
      state.isLoading = false;
    },
        /**
 * Reducer logic for profession save failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionSaveFailure(state, action) {
      state.status = action.type;
      state.error = action.error || action.payload;
      state.isLoading = false;
    }
  },
});

export const {
  HomelistRequest,
  HomelistFailure,
  HomelistSuccess,
  AboutusRequest,
  AboutusFailure,
  AboutusSuccess,
  StateBundleLandingRequest,
  StateBundleLandingFailure,
  StateBundleLandingSuccess,
  professionSaveFailure,
  professionSaveRequest,
  professionSaveSuccess,
} = GuestSlice.actions;
/**
 * Guest reducer default export.
 *
 * @returns {*}
 */
export default GuestSlice.reducer;
