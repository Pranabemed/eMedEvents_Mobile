import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: '',
  token: null,
  isLoading: true,
  contactInfoResponse: {},
  profilepicResponse: {},
  personalInfoResponse:{},
  professionInfoResponse:{},
  stateLicenseListResponse:{},
  stateLicenseDeleteResponse:{},
  boardListProfileResponse:{},
  boardListDeleteResponse:{},
  EmpAddProfileResponse:{},
  SearchHospResponse:{}
};

const ProfileSlice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
    contactInfoRequest(state, action) {
      state.status = action.type;
    },
    contactInfoSuccess(state, action) {
      state.contactInfoResponse = action.payload;
      state.status = action.type;
    },
    contactInfoFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    profilepicRequest(state, action) {
      state.status = action.type;
    },
    profilepicSuccess(state, action) {
      state.profilepicResponse = action.payload;
      state.status = action.type;
    },
    personalInfoFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    personalInfoRequest(state, action) {
      state.status = action.type;
    },
    personalInfoSuccess(state, action) {
      state.personalInfoResponse = action.payload;
      state.status = action.type;
    },
    personalInfoFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    professionInfoRequest(state, action) {
      state.status = action.type;
    },
    professionInfoSuccess(state, action) {
      state.professionInfoResponse = action.payload;
      state.status = action.type;
    },
    professionInfoFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    stateLicenseListRequest(state, action) {
      state.status = action.type;
    },
    stateLicenseListSuccess(state, action) {
      state.stateLicenseListResponse = action.payload;
      state.status = action.type;
    },
    stateLicenseListFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    stateLicenseDeleteRequest(state, action) {
      state.status = action.type;
    },
    stateLicenseDeleteSuccess(state, action) {
      state.stateLicenseDeleteResponse = action.payload;
      state.status = action.type;
    },
    stateLicenseDeleteFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    boardListProfileRequest(state, action) {
      state.status = action.type;
    },
    boardListProfileSuccess(state, action) {
      state.boardListProfileResponse = action.payload;
      state.status = action.type;
    },
    boardListProfileFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    boardListDeleteRequest(state, action) {
      state.status = action.type;
    },
    boardListDeleteSuccess(state, action) {
      state.boardListDeleteResponse = action.payload;
      state.status = action.type;
    },
    boardListDeleteFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    EmpAddProfileRequest(state, action) {
      state.status = action.type;
    },
    EmpAddProfileSuccess(state, action) {
      state.EmpAddProfileResponse = action.payload;
      state.status = action.type;
    },
    EmpAddProfileFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    SearchHospRequest(state, action) {
      state.status = action.type;
    },
    SearchHospSuccess(state, action) {
      state.SearchHospResponse = action.payload;
      state.status = action.type;
    },
    SearchHospFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
  },
});

export const {
  contactInfoRequest,
  contactInfoFailure,
  contactInfoSuccess,
  profilepicFailure,
  profilepicRequest,
  profilepicSuccess,
  personalInfoFailure,
  personalInfoSuccess,
  personalInfoRequest,
  professionInfoSuccess,
  professionInfoFailure,
  professionInfoRequest,
  stateLicenseListFailure,
  stateLicenseListRequest,
  stateLicenseListSuccess,
  stateLicenseDeleteFailure,
  stateLicenseDeleteRequest,
  stateLicenseDeleteSuccess,
  boardListProfileRequest,
  boardListProfileFailure,
  boardListProfileSuccess,
  boardListDeleteFailure,
  boardListDeleteRequest,
  boardListDeleteSuccess,
  EmpAddProfileFailure,
  EmpAddProfileRequest,
  EmpAddProfileSuccess,
  SearchHospFailure,
  SearchHospRequest,
  SearchHospSuccess
} = ProfileSlice.actions;
export default ProfileSlice.reducer;
