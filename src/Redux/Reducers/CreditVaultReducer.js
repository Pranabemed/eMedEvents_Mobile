/**
 * Credit vault reducer Redux slice module. Manages application state and exposes action creators for credit vault. Exported members: initialState, CreditVaultSlice.
 */

import {createSlice} from '@reduxjs/toolkit';

/**
 * Credit vault slice state shape.
 *
 * @typedef {Object} CreditVaultState
 * @property {string} status
 * @property {string|null} token
 * @property {boolean} isLoading
 * @property {Record<string, unknown>} creditVaultResponse
 * @property {Record<string, unknown>} boardvaultResponse
 * @property {Record<string, unknown>} deletevaultResponse
 * @property {Record<string, unknown>} professionvaultResponse
 * @property {Record<string, unknown>} downloadTranscriptResponse
 * @property {Record<string, unknown>} downloadTranscriptNonUsaResponse
 * @property {string|undefined} error
 */
/**
 * Initial state constant.
 *
 * @type {CreditVaultState}
 */
const initialState = {
  status: '',
  token: null,
  isLoading: true,
  creditVaultResponse:{},
  boardvaultResponse:{},
  deletevaultResponse:{},
  professionvaultResponse:{},
  downloadTranscriptResponse:{},
  downloadTranscriptNonUsaResponse:{}
};

/**
 * Credit vault slice value.
 *
 * @type {import('@reduxjs/toolkit').Slice<CreditVaultState>}
 */
const CreditVaultSlice = createSlice({
  name: 'CreditVault',
  initialState,
  reducers: {
        /**
 * Reducer logic for creditvault request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
creditvaultRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for creditvault success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
creditvaultSuccess(state, action) {
      state.creditVaultResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for creditvault failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
creditvaultFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for boardvault request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardvaultRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for boardvault success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardvaultSuccess(state, action) {
      state.boardvaultResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for boardvault failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
boardvaultFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for deletevault request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
deletevaultRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for deletevault success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
deletevaultSuccess(state, action) {
      state.deletevaultResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for deletevault failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
deletevaultFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for professionvault request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionvaultRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for professionvault success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionvaultSuccess(state, action) {
      state.professionvaultResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for professionvault failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
professionvaultFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for download transcript request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
downloadTranscriptRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for download transcript success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
downloadTranscriptSuccess(state, action) {
      state.downloadTranscriptResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for download transcript failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
downloadTranscriptFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for download transcript non usa request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
downloadTranscriptNonUsaRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for download transcript non usa success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
downloadTranscriptNonUsaSuccess(state, action) {
      state.downloadTranscriptNonUsaResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for download transcript non usa failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
downloadTranscriptNonUsaFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    }
  },
});

export const {
  creditvaultRequest,
  creditvaultSuccess,
  creditvaultFailure,
  boardvaultFailure,
  boardvaultRequest,
  boardvaultSuccess,
  deletevaultFailure,
  deletevaultRequest,
  deletevaultSuccess,
  professionvaultFailure,
  professionvaultRequest,
  professionvaultSuccess,
  downloadTranscriptFailure,
  downloadTranscriptRequest,
  downloadTranscriptSuccess,
  downloadTranscriptNonUsaFailure,
  downloadTranscriptNonUsaRequest,
  downloadTranscriptNonUsaSuccess
} = CreditVaultSlice.actions;
/**
 * Credit vault reducer default export.
 *
 * @returns {*}
 */
export default CreditVaultSlice.reducer;
