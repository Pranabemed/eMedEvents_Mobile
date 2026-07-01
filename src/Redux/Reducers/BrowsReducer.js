/**
 * Brows reducer Redux slice module. Manages application state and exposes action creators for brows. Exported members: initialState, BrosweSlice.
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Browse slice state shape.
 *
 * @typedef {Object} BrowseState
 * @property {string} status
 * @property {string|null} token
 * @property {boolean} isLoading
 * @property {Record<string, unknown>} BrowseSpecialtyResponse
 * @property {string|undefined} error
 */
/**
 * Initial state constant.
 *
 * @type {BrowseState}
 */
const initialState = {
  status: '',
  token: null,
  isLoading: true,
  BrowseSpecialtyResponse: {},
};

/**
 * Broswe slice value.
 *
 * @type {import('@reduxjs/toolkit').Slice<BrowseState>}
 */
const BrosweSlice = createSlice({
  name: 'Browse',
  initialState,
  reducers: {
        /**
 * Browse specialty request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
BrowseSpecialtyRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Browse specialty success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
BrowseSpecialtySuccess(state, action) {
      state.BrowseSpecialtyResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Browse specialty failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
BrowseSpecialtyFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
  },
});

export const {
 BrowseSpecialtyFailure,
 BrowseSpecialtyRequest,
 BrowseSpecialtySuccess
} = BrosweSlice.actions;
/**
 * Brows reducer default export.
 *
 * @returns {*}
 */
export default BrosweSlice.reducer;
