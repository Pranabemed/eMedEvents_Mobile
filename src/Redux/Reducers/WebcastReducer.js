import { createSlice } from '@reduxjs/toolkit';

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
  checkoutTicketResponse:{}
};

const WebCastSlice = createSlice({
  name: 'WebCast',
  initialState,
  reducers: {
    webcastDeatilsRequest(state, action) {
      state.status = action.type;
    },
    webcastDeatilsSuccess(state, action) {
      state.webcastDeatilsResponse = action.payload;
      state.status = action.type;
    },
    webcastDeatilsFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    webcastsearchRequest(state, action) {
      state.status = action.type;
    },
    webcastsearchSuccess(state, action) {
      state.webcastsearchResponse = action.payload;
      state.status = action.type;
    },
    webcastsearchFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    webcastviewallRequest(state, action) {
      state.status = action.type;
    },
    webcastviewallSuccess(state, action) {
      state.webcastviewallResponse = action.payload;
      state.status = action.type;
    },
    webcastviewallFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    webcastStateRequest(state, action) {
      state.status = action.type;
    },
    webcastStateSuccess(state, action) {
      state.webcastStateResponse = action.payload;
      state.status = action.type;
    },
    webcastStateFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    saveTicketRequest(state, action) {
      state.status = action.type;
    },
    saveTicketSuccess(state, action) {
      state.saveTicketResponse = action.payload;
      state.status = action.type;
    },
    saveTicketFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    saveTicketInpersonRequest(state, action) {
      state.status = action.type;
    },
    saveTicketInpersonSuccess(state, action) {
      state.saveTicketInpersonResponse = action.payload;
      state.status = action.type;
    },
    saveTicketInpersonFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    saveRegistRequest(state, action) {
      state.status = action.type;
    },
    saveRegistSuccess(state, action) {
      state.saveRegistResponse = action.payload;
      state.status = action.type;
    },
    saveRegistFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    StatusPaymentRequest(state, action) {
      state.status = action.type;
    },
    StatusPaymentSuccess(state, action) {
      state.StatusPaymentResponse = action.payload;
      state.status = action.type;
    },
    StatusPaymentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    PaymentCheckRequest(state, action) {
      state.status = action.type;
    },
    PaymentCheckSuccess(state, action) {
      state.PaymentCheckResponse = action.payload;
      state.status = action.type;
    },
    PaymentCheckFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    webcastPaymentRequest(state, action) {
      state.status = action.type;
    },
    webcastPaymentSuccess(state, action) {
      state.webcastPaymentResponse = action.payload;
      state.status = action.type;
    },
    webcastPaymentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    addtoCartWebcastRequest(state, action) {
      state.status = action.type;
    },
    addtoCartWebcastSuccess(state, action) {
      state.addtoCartWebcastResponse = action.payload;
      state.status = action.type;
    },
    addtoCartWebcastFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cartcountWebcastRequest(state, action) {
      state.status = action.type;
    },
    cartcountWebcastSuccess(state, action) {
      state.cartcountWebcastResponse = action.payload;
      state.status = action.type;
    },
    cartcountWebcastFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cartdetailsWebcastRequest(state, action) {
      state.status = action.type;
    },
    cartdetailsWebcastSuccess(state, action) {
      state.cartdetailsWebcastResponse = action.payload;
      state.status = action.type;
    },
    cartdetailsWebcastFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cartdeleteWebcastRequest(state, action) {
      state.status = action.type;
    },
    cartdeleteWebcastSuccess(state, action) {
      state.cartdeleteWebcastResponse = action.payload;
      state.status = action.type;
    },
    cartdeleteWebcastFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    couponWebcastRequest(state, action) {
      state.status = action.type;
    },
    couponWebcastSuccess(state, action) {
      state.couponWebcastResponse = action.payload;
      state.status = action.type;
    },
    couponWebcastFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cancelcouponRequest(state, action) {
      state.status = action.type;
    },
    cancelcouponSuccess(state, action) {
      state.cancelcouponResponse = action.payload;
      state.status = action.type;
    },
    cancelcouponFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cartCheckoutRequest(state, action) {
      state.status = action.type;
    },
    cartCheckoutSuccess(state, action) {
      state.cartCheckoutResponse = action.payload;
      state.status = action.type;
    },
    cartCheckoutFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    cartPaymentRequest(state, action) {
      state.status = action.type;
    },
    cartPaymentSuccess(state, action) {
      state.cartPaymentResponse = action.payload;
      state.status = action.type;
    },
    cartPaymentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    walletCheckRequest(state, action) {
      state.status = action.type;
    },
    walletCheckSuccess(state, action) {
      state.walletCheckResponse = action.payload;
      state.status = action.type;
    },
    walletCheckFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    TransemailcheckRequest(state, action) {
      state.status = action.type;
    },
    TransemailcheckSuccess(state, action) {
      state.TransemailcheckResponse = action.payload;
      state.status = action.type;
    },
    TransemailcheckFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    FreeTransRequest(state, action) {
      state.status = action.type;
    },
    FreeTransSuccess(state, action) {
      state.FreeTransResponse = action.payload;
      state.status = action.type;
    },
    FreeTransFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    FreeCartRequest(state, action) {
      state.status = action.type;
    },
    FreeCartSuccess(state, action) {
      state.FreeCartResponse = action.payload;
      state.status = action.type;
    },
    FreeCartFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    PrimePaymentRequest(state, action) {
      state.status = action.type;
    },
    PrimePaymentSuccess(state, action) {
      state.PrimePaymentResponse = action.payload;
      state.status = action.type;
    },
    PrimePaymentFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    PrimeCheckRequest(state, action) {
      state.status = action.type;
    },
    PrimeCheckSuccess(state, action) {
      state.PrimeCheckResponse = action.payload;
      state.status = action.type;
    },
    PrimeCheckFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    RegisterIntRequest(state, action) {
      state.status = action.type;
    },
    RegisterIntSuccess(state, action) {
      state.RegisterIntResponse = action.payload;
      state.status = action.type;
    },
    RegisterIntFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    saveTicketCartRequest(state, action) {
      state.status = action.type;
    },
    saveTicketCartSuccess(state, action) {
      state.saveTicketCartResponse = action.payload;
      state.status = action.type;
    },
    saveTicketCartFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
    saveTicketAddRequest(state, action) {
      state.status = action.type;
    },
    saveTicketAddSuccess(state, action) {
      state.saveTicketAddResponse = action.payload;
      state.status = action.type;
    },
    saveTicketAddFailure(state, action) {
      state.status = action.type;
      state.error = action.error;
    },
     checkoutTicketRequest(state, action) {
      state.status = action.type;
    },
    checkoutTicketSuccess(state, action) {
      state.checkoutTicketResponse = action.payload;
      state.status = action.type;
    },
    checkoutTicketFailure(state, action) {
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
  checkoutTicketFailure
} = WebCastSlice.actions;
export default WebCastSlice.reducer;
