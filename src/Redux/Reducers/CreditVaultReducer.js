import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  token: null,
  isLoading: true,
  creditVaultResponse:{},
  boardvaultResponse:{},
  deletevaultResponse:{},
  professionvaultResponse:{},
  downloadTranscriptResponse:{}
};

const CreditVaultSlice = createSlice({
  name: 'CreditVault',
  initialState,
  reducers: {
    creditvaultRequest(state, action) {
      state.status = action.type;
    },
    creditvaultSuccess(state, action) {
      state.creditVaultResponse = action.payload;
      state.status = action.type;
    },
    creditvaultFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    boardvaultRequest(state, action) {
      state.status = action.type;
    },
    boardvaultSuccess(state, action) {
      state.boardvaultResponse = action.payload;
      state.status = action.type;
    },
    boardvaultFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    deletevaultRequest(state, action) {
      state.status = action.type;
    },
    deletevaultSuccess(state, action) {
      state.deletevaultResponse = action.payload;
      state.status = action.type;
    },
    deletevaultFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    professionvaultRequest(state, action) {
      state.status = action.type;
    },
    professionvaultSuccess(state, action) {
      state.professionvaultResponse = action.payload;
      state.status = action.type;
    },
    professionvaultFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    downloadTranscriptRequest(state, action) {
      state.status = action.type;
    },
    downloadTranscriptSuccess(state, action) {
      state.downloadTranscriptResponse = action.payload;
      state.status = action.type;
    },
    downloadTranscriptFailure(state, action) {
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
  downloadTranscriptSuccess
} = CreditVaultSlice.actions;
export default CreditVaultSlice.reducer;
