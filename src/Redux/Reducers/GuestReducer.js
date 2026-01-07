import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  token: null,
  isLoading: true,
  HomelistResponse:{},
};

const GuestSlice = createSlice({
  name: 'Guest',
  initialState,
  reducers: {
    HomelistRequest(state, action) {
      state.status = action.type;
    },
    HomelistSuccess(state, action) {
      state.HomelistResponse = action.payload;
      state.status = action.type;
    },
    HomelistFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    }
  },
});

export const {
  HomelistRequest,
  HomelistFailure,
  HomelistSuccess,
} = GuestSlice.actions;
export default GuestSlice.reducer;
