import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: '',
  token: null,
  isLoading: true,
  BrowseSpecialtyResponse: {},
};

const BrosweSlice = createSlice({
  name: 'Browse',
  initialState,
  reducers: {
    BrowseSpecialtyRequest(state, action) {
      state.status = action.type;
    },
    BrowseSpecialtySuccess(state, action) {
      state.BrowseSpecialtyResponse = action.payload;
      state.status = action.type;
    },
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
export default BrosweSlice.reducer;
