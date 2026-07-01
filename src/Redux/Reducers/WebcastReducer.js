/**
 * Webcast reducer Redux slice module. Manages application state and exposes action creators for webcast. Exported members: initialState, WebCastSlice.
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Webcast slice state shape.
 *
 * @typedef {Object} WebcastState
 * @property {string} status
 * @property {string|null} token
 * @property {boolean} isLoading
 * @property {Record<string, unknown>} webcastDeatilsResponse
 * @property {Record<string, unknown>} webcastsearchResponse
 * @property {Record<string, unknown>} webcastviewallResponse
 * @property {Record<string, unknown>} webcastStateResponse
 * @property {Record<string, unknown>} saveTicketResponse
 * @property {Record<string, unknown>} saveTicketInpersonResponse
 * @property {Record<string, unknown>} saveRegistResponse
 * @property {Record<string, unknown>} webcastPaymentResponse
 * @property {Record<string, unknown>} addtoCartWebcastResponse
 * @property {Record<string, unknown>} cartcountWebcastResponse
 * @property {Record<string, unknown>} cartdetailsWebcastResponse
 * @property {Record<string, unknown>} cartdeleteWebcastResponse
 * @property {Record<string, unknown>} couponWebcastResponse
 * @property {Record<string, unknown>} cancelcouponResponse
 * @property {Record<string, unknown>} cartCheckoutResponse
 * @property {Record<string, unknown>} cartPaymentResponse
 * @property {Record<string, unknown>} walletCheckResponse
 * @property {Record<string, unknown>} TransemailcheckResponse
 * @property {Record<string, unknown>} StatusPaymentResponse
 * @property {Record<string, unknown>} FreeTransResponse
 * @property {Record<string, unknown>} FreeCartResponse
 * @property {Record<string, unknown>} PaymentCheckResponse
 * @property {Record<string, unknown>} PrimePaymentResponse
 * @property {Record<string, unknown>} PrimeCheckResponse
 * @property {Record<string, unknown>} RegisterIntResponse
 * @property {Record<string, unknown>} saveTicketCartResponse
 * @property {Record<string, unknown>} saveTicketAddResponse
 * @property {Record<string, unknown>} checkoutTicketResponse
 * @property {Record<string, unknown>} refIDResponse
 * @property {string|undefined} error
 */
/**
 * Initial state constant.
 *
 * @type {WebcastState}
 */
const initialState = {
  status: '',
  token: null,
  isLoading: true,
  webcastDeatilsResponse: {},
  webcastsearchResponse: {},
  webcastviewallResponse: {},
  webcastStateResponse: {},
  saveTicketResponse: {},
  saveTicketInpersonResponse: {},
  saveRegistResponse: {},
  webcastPaymentResponse: {},
  addtoCartWebcastResponse: {},
  cartcountWebcastResponse: {},
  cartdetailsWebcastResponse: {},
  cartdeleteWebcastResponse: {},
  couponWebcastResponse: {},
  cancelcouponResponse: {},
  cartCheckoutResponse: {},
  cartPaymentResponse: {},
  walletCheckResponse: {},
  TransemailcheckResponse: {},
  StatusPaymentResponse: {},
  FreeTransResponse: {},
  FreeCartResponse: {},
  PaymentCheckResponse: {},
  PrimePaymentResponse: {},
  PrimeCheckResponse: {},
  RegisterIntResponse: {},
  saveTicketCartResponse: {},
  saveTicketAddResponse: {},
  checkoutTicketResponse: {},
  refIDResponse: {},
};

/**
 * Web cast slice value.
 *
 * @type {import('@reduxjs/toolkit').Slice<WebcastState>}
 */
const WebCastSlice = createSlice({
  name: 'WebCast',
  initialState,
  reducers: {
        /**
 * Reducer logic for webcast deatils request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastDeatilsRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for webcast deatils success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastDeatilsSuccess(state, action) {
      state.webcastDeatilsResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for webcast deatils failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastDeatilsFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for webcastsearch request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastsearchRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for webcastsearch success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastsearchSuccess(state, action) {
      state.webcastsearchResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for webcastsearch failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastsearchFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for webcastviewall request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastviewallRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for webcastviewall success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastviewallSuccess(state, action) {
      state.webcastviewallResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for webcastviewall failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastviewallFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for webcast state request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastStateRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for webcast state success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastStateSuccess(state, action) {
      state.webcastStateResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for webcast state failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastStateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for save ticket request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for save ticket success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketSuccess(state, action) {
      state.saveTicketResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for save ticket failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for save ticket inperson request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketInpersonRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for save ticket inperson success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketInpersonSuccess(state, action) {
      state.saveTicketInpersonResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for save ticket inperson failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketInpersonFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for save regist request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveRegistRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for save regist success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveRegistSuccess(state, action) {
      state.saveRegistResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for save regist failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveRegistFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Status payment request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
StatusPaymentRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Status payment success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
StatusPaymentSuccess(state, action) {
      state.StatusPaymentResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Status payment failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
StatusPaymentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Payment check request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
PaymentCheckRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Payment check success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
PaymentCheckSuccess(state, action) {
      state.PaymentCheckResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Payment check failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
PaymentCheckFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for webcast payment request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastPaymentRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for webcast payment success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastPaymentSuccess(state, action) {
      state.webcastPaymentResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for webcast payment failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
webcastPaymentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for addto cart webcast request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
addtoCartWebcastRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for addto cart webcast success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
addtoCartWebcastSuccess(state, action) {
      state.addtoCartWebcastResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for addto cart webcast failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
addtoCartWebcastFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for cartcount webcast request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartcountWebcastRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cartcount webcast success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartcountWebcastSuccess(state, action) {
      state.cartcountWebcastResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cartcount webcast failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartcountWebcastFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for cartdetails webcast request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartdetailsWebcastRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cartdetails webcast success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartdetailsWebcastSuccess(state, action) {
      state.cartdetailsWebcastResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cartdetails webcast failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartdetailsWebcastFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for cartdelete webcast request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartdeleteWebcastRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cartdelete webcast success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartdeleteWebcastSuccess(state, action) {
      state.cartdeleteWebcastResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cartdelete webcast failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartdeleteWebcastFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for coupon webcast request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
couponWebcastRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for coupon webcast success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
couponWebcastSuccess(state, action) {
      state.couponWebcastResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for coupon webcast failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
couponWebcastFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for cancelcoupon request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cancelcouponRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cancelcoupon success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cancelcouponSuccess(state, action) {
      state.cancelcouponResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cancelcoupon failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cancelcouponFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for cart checkout request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartCheckoutRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cart checkout success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartCheckoutSuccess(state, action) {
      state.cartCheckoutResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cart checkout failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartCheckoutFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for cart payment request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartPaymentRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for cart payment success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartPaymentSuccess(state, action) {
      state.cartPaymentResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for cart payment failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
cartPaymentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for wallet check request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
walletCheckRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for wallet check success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
walletCheckSuccess(state, action) {
      state.walletCheckResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for wallet check failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
walletCheckFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Transemailcheck request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
TransemailcheckRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Transemailcheck success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
TransemailcheckSuccess(state, action) {
      state.TransemailcheckResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Transemailcheck failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
TransemailcheckFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Free trans request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
FreeTransRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Free trans success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
FreeTransSuccess(state, action) {
      state.FreeTransResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Free trans failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
FreeTransFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Free cart request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
FreeCartRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Free cart success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
FreeCartSuccess(state, action) {
      state.FreeCartResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Free cart failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
FreeCartFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Prime payment request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
PrimePaymentRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Prime payment success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
PrimePaymentSuccess(state, action) {
      state.PrimePaymentResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Prime payment failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
PrimePaymentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Prime check request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
PrimeCheckRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Prime check success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
PrimeCheckSuccess(state, action) {
      state.PrimeCheckResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Prime check failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
PrimeCheckFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Register int request component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
RegisterIntRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Register int success component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
RegisterIntSuccess(state, action) {
      state.RegisterIntResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Register int failure component.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
RegisterIntFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for save ticket cart request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketCartRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for save ticket cart success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketCartSuccess(state, action) {
      state.saveTicketCartResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for save ticket cart failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketCartFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for save ticket add request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketAddRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for save ticket add success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketAddSuccess(state, action) {
      state.saveTicketAddResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for save ticket add failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
saveTicketAddFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for checkout ticket request state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
checkoutTicketRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for checkout ticket success state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
checkoutTicketSuccess(state, action) {
      state.checkoutTicketResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for checkout ticket failure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
checkoutTicketFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
        /**
 * Reducer logic for ref idrequest state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
refIDRequest(state, action) {
      state.status = action.type;
    },
        /**
 * Reducer logic for ref idsuccess state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
refIDSuccess(state, action) {
      state.refIDResponse = action.payload;
      state.status = action.type;
    },
        /**
 * Reducer logic for ref idfailure state.
 * @param {*} state - Input value.
 * @param {*} action - Input value.
 * @returns {void}
 */
refIDFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
  },
});

export const {
  webcastDeatilsRequest,
  webcastDeatilsFailure,
  webcastDeatilsSuccess,
  webcastsearchFailure,
  webcastsearchSuccess,
  webcastsearchRequest,
  webcastviewallFailure,
  webcastviewallRequest,
  webcastviewallSuccess,
  webcastStateFailure,
  webcastStateRequest,
  webcastStateSuccess,
  saveTicketFailure,
  saveTicketRequest,
  saveTicketSuccess,
  saveTicketInpersonFailure,
  saveTicketInpersonRequest,
  saveTicketInpersonSuccess,
  saveRegistFailure,
  saveRegistRequest,
  saveRegistSuccess,
  StatusPaymentFailure,
  StatusPaymentSuccess,
  StatusPaymentRequest,
  webcastPaymentFailure,
  webcastPaymentSuccess,
  webcastPaymentRequest,
  addtoCartWebcastFailure,
  addtoCartWebcastRequest,
  addtoCartWebcastSuccess,
  cartcountWebcastFailure,
  cartcountWebcastRequest,
  cartcountWebcastSuccess,
  cartdetailsWebcastFailure,
  cartdetailsWebcastRequest,
  cartdetailsWebcastSuccess,
  cartdeleteWebcastFailure,
  cartdeleteWebcastRequest,
  cartdeleteWebcastSuccess,
  couponWebcastFailure,
  couponWebcastRequest,
  couponWebcastSuccess,
  cancelcouponFailure,
  cancelcouponRequest,
  cancelcouponSuccess,
  cartCheckoutFailure,
  cartCheckoutRequest,
  cartCheckoutSuccess,
  cartPaymentFailure,
  cartPaymentRequest,
  cartPaymentSuccess,
  walletCheckRequest,
  walletCheckFailure,
  walletCheckSuccess,
  TransemailcheckFailure,
  TransemailcheckRequest,
  TransemailcheckSuccess,
  FreeTransFailure,
  FreeTransRequest,
  FreeTransSuccess,
  FreeCartFailure,
  FreeCartRequest,
  FreeCartSuccess,
  PaymentCheckFailure,
  PaymentCheckRequest,
  PaymentCheckSuccess,
  PrimePaymentFailure,
  PrimePaymentRequest,
  PrimePaymentSuccess,
  PrimeCheckFailure,
  PrimeCheckRequest,
  PrimeCheckSuccess,
  RegisterIntFailure,
  RegisterIntRequest,
  RegisterIntSuccess,
  saveTicketCartRequest,
  saveTicketCartSuccess,
  saveTicketCartFailure,
  saveTicketAddRequest,
  saveTicketAddSuccess,
  saveTicketAddFailure,
  checkoutTicketRequest,
  checkoutTicketSuccess,
  checkoutTicketFailure,
  refIDRequest,
  refIDSuccess,
  refIDFailure,
} = WebCastSlice.actions;
/**
 * Webcast reducer default export.
 *
 * @returns {*}
 */
export default WebCastSlice.reducer;
