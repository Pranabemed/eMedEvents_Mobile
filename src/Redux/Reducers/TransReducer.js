import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: '',
  token: null,
  isLoading: true,
  registPaymentResponse: {},
  subscribeTransResponse: {},
  walletsTransResponse: {},
  walletsgetResponse: {},
  userSubResponse: {},
  HCPSubResponse: {},
  subPaymentcardResponse:{},
  subRenewalResponse:{},
  searchSpeakerResponse:{},
  speakerProfileResponse:{},
  contactusSpeakerResponse:{}
};

const TransSlice = createSlice({
  name: 'Transaction',
  initialState,
  reducers: {
    registPaymentRequest(state, action) {
      state.status = action.type;
    },
    registPaymentSuccess(state, action) {
      state.registPaymentResponse = action.payload;
      state.status = action.type;
    },
    registPaymentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    subscribeTransRequest(state, action) {
      state.status = action.type;
    },
    subscribeTransSuccess(state, action) {
      state.subscribeTransResponse = action.payload;
      state.status = action.type;
    },
    subscribeTransFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    walletsTransRequest(state, action) {
      state.status = action.type;
    },
    walletsTransSuccess(state, action) {
      state.walletsTransResponse = action.payload;
      state.status = action.type;
    },
    walletsTransFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    walletsgetRequest(state, action) {
      state.status = action.type;
    },
    walletsgetSuccess(state, action) {
      state.walletsgetResponse = action.payload;
      state.status = action.type;
    },
    walletsgetFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    userSubRequest(state, action) {
      state.status = action.type;
    },
    userSubSuccess(state, action) {
      state.userSubResponse = action.payload;
      state.status = action.type;
    },
    userSubFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    HCPSubRequest(state, action) {
      state.status = action.type;
    },
    HCPSubSuccess(state, action) {
      state.HCPSubResponse = action.payload;
      state.status = action.type;
    },
    HCPSubFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    subPaymentcardRequest(state, action) {
      state.status = action.type;
    },
    subPaymentcardSuccess(state, action) {
      state.subPaymentcardResponse = action.payload;
      state.status = action.type;
    },
    subPaymentcardFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    subRenewalRequest(state, action) {
      state.status = action.type;
    },
    subRenewalSuccess(state, action) {
      state.subRenewalResponse = action.payload;
      state.status = action.type;
    },
    subRenewalFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    searchSpeakerRequest(state, action) {
      state.status = action.type;
    },
    searchSpeakerSuccess(state, action) {
      state.searchSpeakerResponse = action.payload;
      state.status = action.type;
    },
    searchSpeakerFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    speakerProfileRequest(state, action) {
      state.status = action.type;
    },
    speakerProfileSuccess(state, action) {
      state.speakerProfileResponse = action.payload;
      state.status = action.type;
    },
    speakerProfileFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    searchSpeakerRequest(state, action) {
      state.status = action.type;
    },
    searchSpeakerSuccess(state, action) {
      state.searchSpeakerResponse = action.payload;
      state.status = action.type;
    },
    searchSpeakerFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
     contactusSpeakerRequest(state, action) {
      state.status = action.type;
    },
    contactusSpeakerSuccess(state, action) {
      state.contactusSpeakerResponse = action.payload;
      state.status = action.type;
    },
    contactusSpeakerFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    }
  },
});

export const {
  registPaymentRequest,
  registPaymentFailure,
  registPaymentSuccess,
  subscribeTransFailure,
  subscribeTransRequest,
  subscribeTransSuccess,
  walletsTransFailure,
  walletsTransRequest,
  walletsTransSuccess,
  walletsgetRequest,
  walletsgetFailure,
  walletsgetSuccess,
  userSubFailure,
  userSubRequest,
  userSubSuccess,
  HCPSubFailure,
  HCPSubRequest,
  HCPSubSuccess,
  subPaymentcardFailure,
  subPaymentcardRequest,
  subPaymentcardSuccess,
  subRenewalFailure,
  subRenewalRequest,
  subRenewalSuccess,
  searchSpeakerFailure,
  searchSpeakerRequest,
  searchSpeakerSuccess,
  speakerProfileFailure,
  speakerProfileRequest,
  speakerProfileSuccess,
  contactusSpeakerFailure,
  contactusSpeakerRequest,
  contactusSpeakerSuccess
} = TransSlice.actions;
export default TransSlice.reducer;
