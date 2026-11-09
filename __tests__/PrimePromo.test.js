import reducer, { primepromoRequest, primepromotSuccess, primepromoFailure } from '../src/Redux/Reducers/WebcastReducer';
import { primepromoSaga } from '../src/Redux/Saga/WebcastSaga';
import { call, put } from 'redux-saga/effects';
import { postApi } from '../src/Utils/Helpers/ApiRequest';

jest.mock('../src/Utils/Helpers/ApiRequest', () => ({ postApi: jest.fn(), getApi: jest.fn(), deleteApi: jest.fn() }));
jest.mock('../src/Utils/Helpers/Toast', () => jest.fn());
jest.mock('../src/Utils/Helpers/IPServer', () => ({ getPublicIP: jest.fn() }));

const payload = { email: 'test@example.com', promo_code: 'SAVE' };
const start = () => {
  const saga = primepromoSaga(primepromoRequest(payload));
  saga.next();
  expect(saga.next({ token: 'token' }).value).toEqual(call(postApi,
    'UserSubscription/checkValidPromoCode', payload,
    { Accept: 'application/json', contenttype: 'application/json', authorization: 'token' }));
  return saga;
};

test('Prime promo state is separate from conference coupon and payment status', () => {
  const initial = { ...reducer(undefined, {}), status: 'WebCast/primetrialCheckSuccess', couponWebcastResponse: { code: 'conference' } };
  const requested = reducer(initial, primepromoRequest(payload));
  expect(requested.status).toBe(initial.status);
  expect(requested.primepromoStatus).toBe('WebCast/primepromoRequest');
  const success = reducer(requested, primepromotSuccess({ valid: true }));
  expect(success.primepromoResponse).toEqual({ valid: true });
  const failed = reducer(success, primepromoFailure({ message: 'Invalid Promo Code!' }));
  expect(failed.primepromoResponse).toBeNull();
  expect(failed.primepromoError.message).toBe('Invalid Promo Code!');
  expect(failed.couponWebcastResponse).toEqual(initial.couponWebcastResponse);
});

test('posts email and promo_code to the Prime endpoint', () => {
  const saga = start();
  expect(saga.next({ status: 200, data: { valid: true } }).value).toEqual(put(primepromotSuccess({ valid: true })));
});

test('preserves HTTP validation errors', () => {
  const saga = start();
  const error = { message: 'Invalid Promo Code!' };
  expect(saga.next({ status: 400, data: error }).value).toEqual(put(primepromoFailure(error)));
});

test('preserves network/API exception messages', () => {
  const saga = start();
  const data = { message: 'Required fields are not passed.' };
  expect(saga.throw({ response: { data } }).value).toEqual(put(primepromoFailure(data)));
});
