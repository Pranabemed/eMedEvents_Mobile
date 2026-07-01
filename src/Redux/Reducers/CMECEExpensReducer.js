/**
 * Cmeceexpens reducer Redux slice module. Manages application state and exposes action creators for cmeceexpens. Exported members: initialState, ExpenseSlice.
 */

import {createSlice} from '@reduxjs/toolkit';

/**
 * Expense slice state shape.
 *
 * @typedef {Object} ExpenseState
 * @property {string} status
 * @property {string|null} token
 * @property {boolean} isLoading
 * @property {Record<string, unknown>} AddExpensesResponse
 * @property {Record<string, unknown>} CMECEListResponse
 * @property {Record<string, unknown>} CMEListWiseResponse
 * @property {Record<string, unknown>} CMEAllowanceResponse
 * @property {Record<string, unknown>} againListResponse
 * @property {Record<string, unknown>} deleteExpensesResponse
 * @property {string|undefined} error
 */
/**
 * Initial state constant.
 *
 * @type {ExpenseState}
 */
const initialState = {
  status: '',
  token: null,
  isLoading: true,
  AddExpensesResponse:{},
  CMECEListResponse:{},
  CMEListWiseResponse:{},
  CMEAllowanceResponse:{},
  againListResponse:{},
  deleteExpensesResponse:{}
};

/**
 * Expense slice value.
 *
 * @type {import('@reduxjs/toolkit').Slice<ExpenseState>}
 */
const ExpenseSlice = createSlice({
  name: 'Expenses',
  initialState,
  reducers: {
        /**
 * Add expenses request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
AddExpensesRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Add expenses success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
AddExpensesSuccess(state, action) {
      state.AddExpensesResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Add expenses failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
AddExpensesFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Cmecelist request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMECEListRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Cmecelist success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMECEListSuccess(state, action) {
      state.CMECEListResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Cmecelist failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMECEListFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Cmelist wise request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEListWiseRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Cmelist wise success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEListWiseSuccess(state, action) {
      state.CMEListWiseResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Cmelist wise failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEListWiseFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Cmeallowance request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEAllowanceRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Cmeallowance success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEAllowanceSuccess(state, action) {
      state.CMEAllowanceResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Cmeallowance failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
CMEAllowanceFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for again list request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
againListRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for again list success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
againListSuccess(state, action) {
      state.againListResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for again list failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
againListFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for delete expenses request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
deleteExpensesRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for delete expenses success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
deleteExpensesSuccess(state, action) {
      state.deleteExpensesResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for delete expenses failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
deleteExpensesFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    }
  },
});

export const {
  AddExpensesRequest,
  AddExpensesFailure,
  AddExpensesSuccess,
  CMECEListFailure,
  CMECEListRequest,
  CMECEListSuccess,
  CMEListWiseFailure,
  CMEListWiseRequest,
  CMEListWiseSuccess,
  CMEAllowanceFailure,
  CMEAllowanceRequest,
  CMEAllowanceSuccess,
  againListFailure,
  againListRequest,
  againListSuccess,
  deleteExpensesFailure,
  deleteExpensesRequest,
  deleteExpensesSuccess,
} = ExpenseSlice.actions;
/**
 * Cmeceexpens reducer default export.
 *
 * @returns {*}
 */
export default ExpenseSlice.reducer;
