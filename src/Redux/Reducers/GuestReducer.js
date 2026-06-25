import {createSlice} from '@reduxjs/toolkit';

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
    },
    StateBundleLandingRequest(state, action) {
      state.status = action.type;
      state.isLoading = true;
      state.stateBundleLandingLoading = true;
      state.StateBundleLandingResponse = {};
    },
    StateBundleLandingSuccess(state, action) {
      state.StateBundleLandingResponse = action.payload;
      state.status = action.type;
      state.isLoading = false;
      state.stateBundleLandingLoading = false;
    },
    StateBundleLandingFailure(state, action) {
      state.status = action.type;
      state.error = action.error || action.payload;
      state.isLoading = false;
      state.stateBundleLandingLoading = false;
    },
    professionSaveRequest(state, action) {
      state.status = action.type;
      state.isLoading = true;
      state.professionSaveResponse = {};
    },
    professionSaveSuccess(state, action) {
      state.professionSaveResponse = action.payload;
      state.status = action.type;
      state.isLoading = false;
    },
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
export default GuestSlice.reducer;
