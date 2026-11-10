import WebcastReducer, {
  couponapplyRequest,
  couponapplySuccess,
  couponapplyFailure,
} from '../src/Redux/Reducers/WebcastReducer';
import { offlinePaymentSaga } from '../src/Redux/Saga/WebcastSaga';
import { runSaga } from 'redux-saga';
import * as api from '../src/Utils/Helpers/ApiRequest';

describe('Prime Offline Payment Reducer & Saga Flow', () => {
  it('updates reducer state correctly for couponapplyRequest, Success, and Failure', () => {
    let state = WebcastReducer(undefined, { type: '@@INIT' });
    expect(state.couponapplyResponse).toEqual({});
    expect(state.couponapplyError).toBeNull();

    state = WebcastReducer(state, couponapplyRequest({ discount_id: '740' }));
    expect(state.status).toBe('WebCast/couponapplyRequest');
    expect(state.couponapplyStatus).toBe('WebCast/couponapplyRequest');

    const successPayload = {
      success: true,
      msg: 'You are now enrolled for subscription successfully.',
      type: 'payment',
      auto_renew: 0,
      prime_start_date: 'Nov 10, 2026',
      auto_renew_date: 'Nov 10, 2027',
      user: {
        subscription_user: 'premium',
        subscriptions: [
          {
            id: '2872',
            subscription_type: '2',
            frequency: '2',
            start_date: '2026-11-10',
            end_date: '2027-11-10',
            createddate: '2026-11-10 07:51:52',
            subscription_status: '0',
            active_status: '1',
          },
        ],
      },
    };

    state = WebcastReducer(state, couponapplySuccess(successPayload));
    expect(state.status).toBe('WebCast/couponapplySuccess');
    expect(state.couponapplyResponse).toEqual(successPayload);
    expect(state.PrimePaymentResponse).toEqual(successPayload);

    state = WebcastReducer(state, couponapplyFailure({ message: 'Invalid discount' }));
    expect(state.status).toBe('WebCast/couponapplyFailure');
    expect(state.couponapplyError).toEqual({ message: 'Invalid discount' });
  });

  it('runs offlinePaymentSaga successfully with discount_id', async () => {
    const dispatched = [];
    const mockResponse = {
      status: 200,
      data: {
        success: true,
        msg: 'You are now enrolled for subscription successfully.',
        prime_start_date: 'Nov 10, 2026',
        auto_renew_date: 'Nov 10, 2027',
      },
    };

    const postApiSpy = jest.spyOn(api, 'postApi').mockResolvedValue(mockResponse);

    await runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({
          AuthReducer: {
            token: 'mock-token',
          },
        }),
      },
      offlinePaymentSaga,
      { payload: { discount_id: '740' } }
    ).toPromise();

    expect(postApiSpy).toHaveBeenCalledWith(
      'UserSubscription/offlinePayment',
      { discount_id: '740' },
      expect.objectContaining({
        authorization: 'mock-token',
      })
    );

    expect(dispatched).toContainEqual(couponapplySuccess(mockResponse.data));
    postApiSpy.mockRestore();
  });
});
