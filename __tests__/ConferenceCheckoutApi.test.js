import {CONFERENCE_CHECKOUT_API_BASE, getConferenceSlug} from '../src/Utils/Helpers/ConferenceCheckoutApi';
import {saveRegistSaga, TransEmailCheckSaga, webcastDetailsSaga} from '../src/redux/Saga/WebcastSaga';
import {postApi} from '../src/Utils/Helpers/ApiRequest';
import {call} from 'redux-saga/effects';

jest.mock('../src/Utils/Helpers/ApiRequest', () => ({postApi: jest.fn()}));
jest.mock('../src/Utils/Helpers/IPServer', () => ({getPublicIP: () => ''}));

test.each([
  [saveRegistSaga, 'transaction/saveRegistration', {invoice: 'test-invoice', attendee: []}],
  [TransEmailCheckSaga, 'Transaction/RegistrationStatus', {conference: '330483', ticket: '1609852', email: 'test@example.com'}],
])('routes web checkout to the invoice API without changing its payload', (worker, path, payload) => {
  const iterator = worker({payload, meta: {checkoutApiBase: `${CONFERENCE_CHECKOUT_API_BASE}`}});
  iterator.next();
  const effect = iterator.next({token: null}).value;
  expect(effect).toEqual(call(postApi, `${CONFERENCE_CHECKOUT_API_BASE}/${path}`, payload, expect.any(Object)));
});

test('keeps existing native checkout routing unchanged', () => {
  const payload = {invoice: 'native-invoice'};
  const iterator = saveRegistSaga({payload});
  iterator.next();
  expect(iterator.next({token: null}).value).toEqual(call(postApi, 'transaction/saveRegistration', payload, expect.any(Object)));
});

test('loads the tapped href and attaches it to the details response', () => {
  const url = 'https://www.emedevents.com/cme/conference';
  const iterator = webcastDetailsSaga({payload: {conference_url: url}, meta: {checkoutApiBase: `${CONFERENCE_CHECKOUT_API_BASE}`}});
  iterator.next();
  expect(iterator.next({token: null}).value).toEqual(call(postApi, `${CONFERENCE_CHECKOUT_API_BASE}/Conference/conferenceDetailPage`, {conference_url: url}, expect.any(Object)));
  const effect = iterator.next({data: {success: true, conferenceId: 42}}).value;
  expect(effect.payload.action.meta).toEqual({conferenceUrl: url});
});

test.each([
  'https://www.emedevents.com/innovations-in-stroke-and-cardiac-care-2027',
  'https://www.emedevents.com/cme/innovations-in-stroke-and-cardiac-care-2027/?ref=1#register',
  'innovations-in-stroke-and-cardiac-care-2027',
])('extracts only the conference slug from %s', value => {
  expect(getConferenceSlug(value)).toBe('innovations-in-stroke-and-cardiac-care-2027');
});
