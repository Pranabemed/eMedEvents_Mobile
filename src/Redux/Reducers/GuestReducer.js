import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  token: null,
  isLoading: true,
  HomelistResponse:{},
  AboutusResponse:{},
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
    },
    AboutusRequest(state, action) {
      state.status = action.type;
    },
    AboutusSuccess(state, action) {
      state.AboutusResponse = action.payload;
      state.status = action.type;
    },
    AboutusFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
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
} = GuestSlice.actions;
export default GuestSlice.reducer;
