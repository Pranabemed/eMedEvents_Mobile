/**
 * Trans reducer Redux slice module. Manages application state and exposes action creators for trans. Exported members: initialState, TransSlice.
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Transaction slice state shape.
 *
 * @typedef {Object} TransState
 * @property {string} status
 * @property {string|null} token
 * @property {boolean} isLoading
 * @property {Record<string, unknown>} registPaymentResponse
 * @property {Record<string, unknown>} subscribeTransResponse
 * @property {Record<string, unknown>} walletsTransResponse
 * @property {Record<string, unknown>} walletsgetResponse
 * @property {Record<string, unknown>} userSubResponse
 * @property {Record<string, unknown>} HCPSubResponse
 * @property {Record<string, unknown>} subPaymentcardResponse
 * @property {Record<string, unknown>} subRenewalResponse
 * @property {Record<string, unknown>} searchSpeakerResponse
 * @property {Record<string, unknown>} speakerProfileResponse
 * @property {Record<string, unknown>} contactusSpeakerResponse
 * @property {string|undefined} error
 */
/**
 * Initial state constant.
 *
 * @type {TransState}
 */
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

/**
 * Trans slice value.
 *
 * @type {import('@reduxjs/toolkit').Slice<TransState>}
 */
const TransSlice = createSlice({
  name: 'Transaction',
  initialState,
  reducers: {
        /**
 * Reducer logic for regist payment request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
registPaymentRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for regist payment success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
registPaymentSuccess(state, action) {
      state.registPaymentResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for regist payment failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
registPaymentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for subscribe trans request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
subscribeTransRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for subscribe trans success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
subscribeTransSuccess(state, action) {
      state.subscribeTransResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for subscribe trans failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
subscribeTransFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for wallets trans request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
walletsTransRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for wallets trans success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
walletsTransSuccess(state, action) {
      state.walletsTransResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for wallets trans failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
walletsTransFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for walletsget request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
walletsgetRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for walletsget success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
walletsgetSuccess(state, action) {
      state.walletsgetResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for walletsget failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
walletsgetFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for user sub request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
userSubRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for user sub success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
userSubSuccess(state, action) {
      state.userSubResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for user sub failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
userSubFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Hcpsub request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
HCPSubRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Hcpsub success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
HCPSubSuccess(state, action) {
      state.HCPSubResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Hcpsub failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
HCPSubFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for sub paymentcard request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
subPaymentcardRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for sub paymentcard success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
subPaymentcardSuccess(state, action) {
      state.subPaymentcardResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for sub paymentcard failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
subPaymentcardFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for sub renewal request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
subRenewalRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for sub renewal success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
subRenewalSuccess(state, action) {
      state.subRenewalResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for sub renewal failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
subRenewalFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for search speaker request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
searchSpeakerRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for search speaker success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
searchSpeakerSuccess(state, action) {
      state.searchSpeakerResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for search speaker failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
searchSpeakerFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for speaker profile request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
speakerProfileRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for speaker profile success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
speakerProfileSuccess(state, action) {
      state.speakerProfileResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for speaker profile failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
speakerProfileFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
          /**
 * Reducer logic for contactus speaker request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
contactusSpeakerRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for contactus speaker success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
contactusSpeakerSuccess(state, action) {
      state.contactusSpeakerResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for contactus speaker failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
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
/**
 * Trans reducer default export.
 *
 * @returns {*}
 */
export default TransSlice.reducer;
