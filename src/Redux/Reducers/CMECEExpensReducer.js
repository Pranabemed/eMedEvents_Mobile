import {createSlice} from '@reduxjs/toolkit';

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

const ExpenseSlice = createSlice({
  name: 'Expenses',
  initialState,
  reducers: {
    AddExpensesRequest(state, action) {
      state.status = action.type;
    },
    AddExpensesSuccess(state, action) {
      state.AddExpensesResponse = action.payload;
      state.status = action.type;
    },
    AddExpensesFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    CMECEListRequest(state, action) {
      state.status = action.type;
    },
    CMECEListSuccess(state, action) {
      state.CMECEListResponse = action.payload;
      state.status = action.type;
    },
    CMECEListFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    CMEListWiseRequest(state, action) {
      state.status = action.type;
    },
    CMEListWiseSuccess(state, action) {
      state.CMEListWiseResponse = action.payload;
      state.status = action.type;
    },
    CMEListWiseFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    CMEAllowanceRequest(state, action) {
      state.status = action.type;
    },
    CMEAllowanceSuccess(state, action) {
      state.CMEAllowanceResponse = action.payload;
      state.status = action.type;
    },
    CMEAllowanceFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    againListRequest(state, action) {
      state.status = action.type;
    },
    againListSuccess(state, action) {
      state.againListResponse = action.payload;
      state.status = action.type;
    },
    againListFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    deleteExpensesRequest(state, action) {
      state.status = action.type;
    },
    deleteExpensesSuccess(state, action) {
      state.deleteExpensesResponse = action.payload;
      state.status = action.type;
    },
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
export default ExpenseSlice.reducer;
