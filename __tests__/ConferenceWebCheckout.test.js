import {CONFERENCE_CHECKOUT_API_BASE} from '../src/Utils/Helpers/ConferenceCheckoutApi';
import {renderHook, act} from '@testing-library/react-native';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {postApi} from '../src/Utils/Helpers/ApiRequest';
import useConferenceCheckout, {conferenceCheckoutScript, isCmeWebLink} from '../src/Screen/GlobalSupport/hooks/useConferenceCheckout';

jest.mock('../src/Utils/Helpers/ApiRequest', () => ({postApi: jest.fn()}));
const pageUrl = 'https://www.emedevents.com/psychedelics-in-clinical-medicine-2027';
const payload = {conference_id: 42, conference_url: 'psychedelics-in-clinical-medicine-2027', tickets: [{id: 7, quantity: 2}]};
const event = (changes = {}) => ({nativeEvent: {url: pageUrl, data: JSON.stringify({type: 'conference-checkout', pageUrl, payload, response: saved, status: 200}), ...changes}});
const details = {success: true, conferenceId: 42, registrationTickets: [{id: 7}]};
const saved = {success: true, invoice: 'invoice', tickets: [{id: 7, quantity: 2, gross_value: 100}], total_amount_with_fee: 100};
beforeEach(() => {
  postApi.mockReset();
  AsyncStorage.getItem.mockResolvedValue(null);
});
test.each([null, 'app-token'])('opens normal checkout with selected tickets and app auth (%s)', async token => {
  AsyncStorage.getItem.mockResolvedValue(token);
  postApi.mockResolvedValueOnce({data: details});
  const navigation = {navigate: jest.fn()};
  const ready = jest.fn();
  const {result} = renderHook(() => useConferenceCheckout(navigation, ready));
  await act(async () => { await result.current.onMessage(event()); });
  expect(postApi).toHaveBeenCalledWith(`${CONFERENCE_CHECKOUT_API_BASE}/Conference/conferenceDetailPage`, {conference_url: payload.conference_url}, expect.objectContaining({authorization: token}));
  expect(ready).toHaveBeenCalledTimes(1);
  expect(navigation.navigate.mock.invocationCallOrder[0]).toBeLessThan(ready.mock.invocationCallOrder[0]);
  expect(navigation.navigate).toHaveBeenCalledWith('Checkout', expect.objectContaining({checkoutSpan: expect.objectContaining({
    checkoutSpan: expect.objectContaining({...details, Realback: token ? undefined : 'guest'}),
    finalTicket: expect.objectContaining(saved), guestOrigin: token ? undefined : 'guest', checkoutApiBase: `${CONFERENCE_CHECKOUT_API_BASE}`,
  })}));
  expect(result.current.loading).toBe(false);
});
test('ignores messages from external pages and invalid quantities', async () => {
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation));
  await act(async () => {
    await result.current.onMessage(event({url: 'https://evil.example'}));
    await result.current.onMessage(event({data: JSON.stringify({type: 'conference-checkout', pageUrl, payload: {...payload, tickets: [{id: 7, quantity: -1}]}})}));
  });
  expect(postApi).not.toHaveBeenCalled();
  expect(navigation.navigate).not.toHaveBeenCalled();
});
test('never repeats saveTickets in the app when the WebView response is missing', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation));
  await act(async () => {
    await result.current.onMessage(event({data: JSON.stringify({type: 'conference-checkout', pageUrl, payload, response: null, status: 200})}));
  });
  expect(postApi).not.toHaveBeenCalled();
  expect(navigation.navigate).not.toHaveBeenCalled();
  expect(alert).toHaveBeenCalled();
  alert.mockRestore();
});
test('proceeds to checkout even when saveTickets response omits invoice', async () => {
  const savedNoInvoice = {success: true, tickets: [{id: 7, quantity: 2}]};
  postApi.mockResolvedValueOnce({data: details});
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation));
  await act(async () => { await result.current.onMessage(event({data: JSON.stringify({type: 'conference-checkout', pageUrl, payload, response: savedNoInvoice})})); });
  expect(navigation.navigate).toHaveBeenCalledWith('Checkout', expect.objectContaining({
    checkoutSpan: expect.objectContaining({
      finalTicket: expect.objectContaining({tickets: savedNoInvoice.tickets}),
    }),
  }));
});
test('reports the saveTickets rejection instead of hiding the server reason', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const rejected = event({data: JSON.stringify({type: 'conference-checkout', pageUrl, payload, response: {success: false, message: 'Selected ticket is unavailable'}, status: 200})});
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation));
  await act(async () => { await result.current.onMessage(rejected); });
  expect(alert).toHaveBeenCalledWith('Unable to open checkout', 'Saving selected tickets: Selected ticket is unavailable');
  expect(postApi).not.toHaveBeenCalled();
  expect(navigation.navigate).not.toHaveBeenCalled();
  alert.mockRestore();
});
test('uses matching root conference details when data contains unrelated metadata', async () => {
  postApi.mockResolvedValueOnce({data: {...details, data: {metadata: true}}});
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation));
  await act(async () => { await result.current.onMessage(event()); });
  expect(navigation.navigate).toHaveBeenCalledWith('Checkout', expect.objectContaining({checkoutSpan: expect.objectContaining({finalTicket: saved})}));
});
test('deduplicates taps and cancels navigation when the banner closes', async () => {
  let resolve;
  postApi.mockReturnValueOnce(new Promise(done => { resolve = done; }));
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation));
  let pending;
  act(() => { pending = result.current.onMessage(event()); });
  await act(async () => { await result.current.onMessage(event()); });
  expect(postApi).toHaveBeenCalledTimes(1);
  act(() => result.current.cancel());
  await act(async () => { resolve({data: saved}); await pending; });
  expect(postApi).toHaveBeenCalledTimes(1);
  expect(navigation.navigate).not.toHaveBeenCalled();
});
test('CME deep links match the exact domain and path boundary', () => {
  for (const url of ['https://www.emedevents.com/cme', 'https://emedevents.com/cme/?RefID=123', 'https://www.emedevents.com/cme/courses']) expect(isCmeWebLink(url)).toBe(true);
  for (const url of ['https://www.emedevents.com/cmepackages', 'https://emedevents.com.evil.com/cme', 'https://example.com/cme']) expect(isCmeWebLink(url)).toBe(false);
});
test('website XHR keeps the request and hands its response to native without web redirect', () => {
  const vm = require('vm');
  const send = jest.fn();
  const postMessage = jest.fn();
  function XHR() { this.listeners = {}; this.addEventListener = (type, callback) => { this.listeners[type] = callback; }; }
  XHR.prototype.open = jest.fn();
  XHR.prototype.send = send;
  const context = vm.createContext({window: {ReactNativeWebView: {postMessage}}, location: {href: pageUrl}, XMLHttpRequest: XHR, URL, Event: function (type) {this.type = type;}});
  vm.runInContext(conferenceCheckoutScript, context);
  vm.runInContext(conferenceCheckoutScript, context);
  const xhr = new XHR();
  xhr.open('POST', `${CONFERENCE_CHECKOUT_API_BASE}/transaction/saveTickets`);
  xhr.send(JSON.stringify(payload));
  expect(send).toHaveBeenCalledTimes(1);
  expect(postMessage).not.toHaveBeenCalled();
  xhr.readyState = 4;
  xhr.status = 200;
  xhr.responseText = JSON.stringify(saved);
  const stopImmediatePropagation = jest.fn();
  xhr.listeners.readystatechange({type: 'readystatechange', stopImmediatePropagation});
  xhr.listeners.load({type: 'load', stopImmediatePropagation});
  expect(stopImmediatePropagation).toHaveBeenCalledTimes(2);
  expect(JSON.parse(postMessage.mock.calls[0][0]).response).toEqual(saved);
  expect(JSON.parse(postMessage.mock.calls[0][0]).payload).toEqual(payload);
  expect(postMessage).toHaveBeenCalledTimes(1);
  xhr.open('POST', 'https://newdev.emedevents.com/Conference/conferenceDetailPage');
  xhr.send('{}');
  expect(send).toHaveBeenCalledTimes(2);
});

test('uses the website invoice without creating a second invoice', async () => {
  postApi.mockResolvedValueOnce({data: details});
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation));
  await act(async () => {
    await result.current.onMessage(event({data: JSON.stringify({type: 'conference-checkout', pageUrl, payload, response: saved, status: 200,
      endpoint: 'https://newdev.emedevents.com/transaction/saveTickets', apiOrigin: 'https://newdev.emedevents.com',
    })}));
  });
  expect(postApi.mock.calls.map(call => call[0])).toEqual([`${CONFERENCE_CHECKOUT_API_BASE}/Conference/conferenceDetailPage`]);
  expect(navigation.navigate.mock.calls[0][1].checkoutSpan.finalTicket.invoice).toBe(saved.invoice);
});

test('opens checkout normally when saveTickets response omits invoice', async () => {
  postApi.mockResolvedValueOnce({data: details});
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation));
  await act(async () => { await result.current.onMessage(event({data: JSON.stringify({type: 'conference-checkout', pageUrl, payload, response: {...saved, invoice: undefined}})})); });
  expect(navigation.navigate).toHaveBeenCalledWith('Checkout', expect.objectContaining({
    checkoutSpan: expect.objectContaining({
      finalTicket: expect.objectContaining({tickets: saved.tickets}),
    }),
  }));
  expect(result.current.loading).toBe(false);
});

test('logs the API rejection reason and HTTP status when saveTickets returns success false', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const rejected = event({data: JSON.stringify({type: 'conference-checkout', pageUrl, payload, response: {success: false, message: 'Selected ticket is unavailable'}, status: 200})});
  const {result} = renderHook(() => useConferenceCheckout({navigate: jest.fn()}));
  await act(async () => { await result.current.onMessage(rejected); });
  expect(warning).toHaveBeenCalledWith('[ConferenceCheckout]', expect.objectContaining({
    stage: 'Saving selected tickets', status: 200, reason: 'Selected ticket is unavailable',
  }));
  warning.mockRestore();
  alert.mockRestore();
});

test.each([undefined, 'GuestHeroSection'])('passes attendee heading source only for GuestHeroSection (%s)', async source => {
  postApi.mockResolvedValueOnce({data: details});
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation, undefined, {source, conferenceDetails: details}));
  await act(async () => { await result.current.onMessage(event()); });
  expect(navigation.navigate.mock.calls[0][1].checkoutSpan.source).toBe(source);
});

test.each([42, 99])('reuses prefetched details only for the selected conference (%s)', async conferenceId => {
  postApi.mockResolvedValueOnce({data: details});
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation, undefined, {conferenceDetails: {...details, conferenceId}}));
  await act(async () => { await result.current.onMessage(event()); });
  expect(postApi).toHaveBeenCalledTimes(conferenceId === 42 ? 0 : 1);
  expect(navigation.navigate.mock.calls[0][1].checkoutSpan.checkoutSpan.conferenceId).toBe(42);
});

test('opens native checkout even when the catalogue does not contain the selected ticket', async () => {
  const navigation = {navigate: jest.fn()};
  const ready = jest.fn();
  const {result} = renderHook(() => useConferenceCheckout(navigation, ready, {
    source: 'GuestHeroSection', conferenceDetails: {...details, registrationTickets: [{id: 99}]},
  }));
  await act(async () => {
    await result.current.onMessage(event({data: JSON.stringify({type: 'conference-checkout', pageUrl, payload, response: saved, status: 200})}));
  });
  expect(postApi).not.toHaveBeenCalled();
  expect(navigation.navigate).toHaveBeenCalledWith('Checkout', expect.objectContaining({
    checkoutSpan: expect.objectContaining({finalTicket: saved}),
  }));
  expect(ready).toHaveBeenCalledTimes(1);
  expect(result.current.shouldStartLoad({url: 'https://www.emedevents.com/checkout'})).toBe(false);
  expect(result.current.shouldStartLoad({url: 'https://checkout.example.com'})).toBe(false);
});

test('reuses the website save and opens checkout when optional details fail', async () => {
  postApi.mockRejectedValueOnce(new Error('Details unavailable'));
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation, undefined, {source: 'GuestHeroSection'}));
  await act(async () => { await result.current.onMessage(event()); });
  expect(postApi).toHaveBeenCalledTimes(1);
  expect(postApi.mock.calls[0][0]).toContain('Conference/conferenceDetailPage');
  expect(navigation.navigate).toHaveBeenCalledWith('Checkout', expect.objectContaining({
    checkoutSpan: expect.objectContaining({finalTicket: saved}),
  }));
});

test.each([
  ['cardiology-conference', '501', '901'],
  ['emergency-medicine-course', '502', '902'],
])('opens %s with one selected ticket and ignores stale cached conference details', async (slug, conferenceId, ticketId) => {
  const selected = {id: ticketId, quantity: '1'};
  const conference = {success: true, conferenceId, registrationTickets: [{id: ticketId, name: 'Registration'}]};
  const purchase = {success: true, invoice: `invoice-${conferenceId}`, tickets: [selected]};
  postApi.mockResolvedValueOnce({data: conference});
  const navigation = {navigate: jest.fn()};
  const {result} = renderHook(() => useConferenceCheckout(navigation, undefined, {
    source: 'GuestHeroSection', conferenceDetails: details, conferenceUrl: pageUrl,
  }));
  const currentPage = `https://www.emedevents.com/cme/${slug}`;
  await act(async () => {
    await result.current.onMessage({nativeEvent: {url: currentPage, data: JSON.stringify({
      type: 'conference-checkout', pageUrl: currentPage, status: 200, response: purchase,
      payload: {conference_id: conferenceId, ...(conferenceId === '501' ? {conference_url: slug} : {}), tickets: [{id: 'unselected', quantity: '0'}, selected]},
    })}});
  });
  expect(postApi).toHaveBeenCalledTimes(1);
  expect(postApi).toHaveBeenCalledWith(`${CONFERENCE_CHECKOUT_API_BASE}/Conference/conferenceDetailPage`, {conference_url: slug}, expect.any(Object));
  const route = navigation.navigate.mock.calls[0][1].checkoutSpan;
  expect(route.checkoutSpan.conferenceId).toBe(conferenceId);
  expect(route.finalTicket.tickets).toEqual([{...selected, ticket_name: 'Registration'}]);
  expect(route.finalTicket.invoice).toBe(purchase.invoice);
});

test.each([false, true])('fetch preserves the website request and hands its response to native (Request object: %s)', async requestObject => {
  const vm = require('vm');
  const fetch = jest.fn().mockResolvedValue({status: 200, clone: () => ({json: () => Promise.resolve(saved)})});
  const postMessage = jest.fn();
  function XHR() {}
  XHR.prototype.open = jest.fn();
  XHR.prototype.send = jest.fn();
  const window = {fetch, ReactNativeWebView: {postMessage}};
  const context = vm.createContext({window, location: {href: pageUrl}, XMLHttpRequest: XHR, URL});
  vm.runInContext(conferenceCheckoutScript, context);
  const url = `${CONFERENCE_CHECKOUT_API_BASE}/transaction/saveTickets`;
  const body = JSON.stringify(payload);
  if (requestObject) {
    window.fetch({url, clone: () => ({text: () => Promise.resolve(body)})});
    await Promise.resolve();
  } else {
    window.fetch(url, {method: 'POST', body});
  }
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(JSON.parse(postMessage.mock.calls[0][0]).response).toEqual(saved);
  expect(postMessage).toHaveBeenCalledTimes(1);
  expect(JSON.parse(postMessage.mock.calls[0][0]).payload).toEqual(payload);
  window.fetch('https://www.emedevents.com/other');
  expect(fetch).toHaveBeenCalledTimes(2);
});

test('does not retry a rejected website saveTickets response through a different native session', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const navigation = {navigate: jest.fn()};
  const response = {success: false, message: 'Either conference is not active or not enabled for registration.'};
  const {result} = renderHook(() => useConferenceCheckout(navigation, undefined, {source: 'GuestHeroSection'}));
  await act(async () => {
    await result.current.onMessage(event({data: JSON.stringify({type: 'conference-checkout', pageUrl, payload, response, status: 200})}));
  });
  expect(postApi).not.toHaveBeenCalled();
  expect(navigation.navigate).not.toHaveBeenCalled();
  expect(alert).toHaveBeenCalledWith('Unable to open checkout', `Saving selected tickets: ${response.message}`);
  alert.mockRestore();
});

test.each(['xhr', 'fetch', 'request'])('uses the selected details conferenceId in the actual %s saveTickets request', async transport => {
  const vm = require('vm');
  const send = jest.fn();
  const fetch = jest.fn().mockResolvedValue({status: 200, clone: () => ({json: () => Promise.resolve(saved)})});
  function XHR() { this.addEventListener = jest.fn(); }
  XHR.prototype.open = jest.fn();
  XHR.prototype.send = send;
  const window = {fetch, ReactNativeWebView: {postMessage: jest.fn()}, __nativeConferenceSelection: {id: 'selected-details-id', slug: payload.conference_url}};
  vm.runInContext(conferenceCheckoutScript, vm.createContext({window, location: {href: pageUrl}, XMLHttpRequest: XHR, URL}));
  const url = `${CONFERENCE_CHECKOUT_API_BASE}/transaction/saveTickets`;
  const body = JSON.stringify(payload);
  if (transport === 'xhr') {
    const xhr = new XHR();
    xhr.open('POST', url);
    xhr.send(body);
    expect(JSON.parse(send.mock.calls[0][0])).toEqual({...payload, conference_id: 'selected-details-id'});
  } else {
    const options = {method: 'POST', credentials: 'include', headers: {test: 'preserved'}};
    const input = transport === 'request' ? {url, clone: () => ({text: () => Promise.resolve(body)})} : url;
    window.fetch(input, transport === 'request' ? options : {...options, body});
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(fetch.mock.calls[0][0]).toBe(input);
    expect(fetch.mock.calls[0][1]).toEqual({...options, body: JSON.stringify({...payload, conference_id: 'selected-details-id'})});
  }
});

test('reports saveTickets msg rejection and does not open checkout with an empty invoice', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const navigation = {navigate: jest.fn()};
  const response = {success: false, msg: 'Either conference is not active or not enabled for registration.', tickets: [{id: '1659183', quantity: '1'}], invoice: ''};
  const {result} = renderHook(() => useConferenceCheckout(navigation));
  await act(async () => {
    await result.current.onMessage(event({data: JSON.stringify({type: 'conference-checkout', pageUrl, payload, response, status: 200})}));
  });
  expect(navigation.navigate).not.toHaveBeenCalled();
  expect(postApi).not.toHaveBeenCalled();
  expect(alert).toHaveBeenCalledWith('Unable to open checkout', `Saving selected tickets: ${response.msg}`);
  alert.mockRestore();
});

test.each([
  ['1609693', undefined, '1609693'],
  ['1659183', 'Physician', '1609693'],
  ['1659183', undefined, '1609693'],
  ['old-virtual-id', 'Physician (Virtual)', '1609699'],
  ['old-nurse-id', 'Nurse / PA', '1609695'],
])('maps selected ticket %s (%s) to the matching registrationTickets ID', (id, name, expectedId) => {
  const vm = require('vm');
  const send = jest.fn();
  function XHR() { this.addEventListener = jest.fn(); }
  XHR.prototype.open = jest.fn();
  XHR.prototype.send = send;
  const window = {ReactNativeWebView: {postMessage: jest.fn()}, __nativeConferenceSelection: {
    id: '330468', slug: payload.conference_url,
    tickets: [{id: '1609744', name: 'Poster Presenter'}, {id: '1609693', name: '<b>Physician</b>'}, {id: '1609695', name: '<b>Nurse / PA</b>'}, {id: '1609699', name: '<b>Physician (Virtual)</b>'}],
  }};
  vm.runInContext(conferenceCheckoutScript, vm.createContext({window, location: {href: pageUrl}, XMLHttpRequest: XHR, URL, document: {querySelectorAll: () => [{id: 'quantity-1659183', getAttribute: () => null, closest: () => ({innerText: 'Physician\nEarly Fee\n380.00'})}]}}));
  const xhr = new XHR();
  xhr.open('POST', `${CONFERENCE_CHECKOUT_API_BASE}/transaction/saveTickets`);
  xhr.send(JSON.stringify({conference_id: 'old-conference', tickets: [{id, quantity: '1', ...(name ? {name} : {})}], other_country: 1, refer_params: ''}));
  const request = JSON.parse(send.mock.calls[0][0]);
  expect(request.conference_id).toBe('330468');
  expect(request.tickets[0]).toEqual({id: expectedId, quantity: '1', ...(name ? {name} : {})});
  expect(request.other_country).toBe(1);
});

test('maps an ID-only web selection through the website catalogue to Redux IDs', () => {
  const vm = require('vm');
  const send = jest.fn();
  const postMessage = jest.fn();
  function XHR() { this.listeners = {}; this.addEventListener = (type, callback) => { this.listeners[type] = callback; }; }
  XHR.prototype.open = jest.fn();
  XHR.prototype.send = send;
  const window = {ReactNativeWebView: {postMessage}, __nativeConferenceSelection: {
    required: true, id: '330468', slug: payload.conference_url,
    tickets: [{id: '1609693', name: '<b>Physician</b>'}, {id: '1609699', name: '<b>Physician (Virtual)</b>'}],
  }};
  vm.runInContext(conferenceCheckoutScript, vm.createContext({window, location: {href: pageUrl}, XMLHttpRequest: XHR, URL}));
  const detailsRequest = new XHR();
  detailsRequest.open('POST', `${CONFERENCE_CHECKOUT_API_BASE}/Conference/conferenceDetailPage`);
  detailsRequest.send('{}');
  detailsRequest.responseText = JSON.stringify({conferenceId: '361957', registrationTickets: [{id: '1659183', name: 'Physician'}]});
  detailsRequest.listeners.load();
  const xhr = new XHR();
  xhr.open('POST', `${CONFERENCE_CHECKOUT_API_BASE}/transaction/saveTickets`);
  xhr.send(JSON.stringify({conference_id: '361957', tickets: [{id: '1659183', quantity: '1'}], other_country: 1, refer_params: ''}));
  expect(JSON.parse(send.mock.calls[1][0])).toEqual({conference_id: '330468', tickets: [{id: '1609693', quantity: '1'}], other_country: 1, refer_params: ''});
  xhr.send(JSON.stringify({conference_id: '361957', tickets: [{id: 'unknown', quantity: '1'}]}));
  expect(send).toHaveBeenCalledTimes(2);
  expect(JSON.parse(postMessage.mock.calls[0][0]).type).toBe('conference-checkout-mapping-error');
});

test('maps an ID-only selection from server-rendered page catalogue data', () => {
  const vm = require('vm');
  const send = jest.fn();
  function XHR() { this.addEventListener = jest.fn(); }
  XHR.prototype.open = jest.fn();
  XHR.prototype.send = send;
  const window = {
    ReactNativeWebView: {postMessage: jest.fn()},
    __NEXT_DATA__: {props: {pageProps: {conference: {registrationTickets: [{id: '1659183', name: '<b>Physician</b>'}]}}, recommendations: {registrationTickets: [{id: 'unrelated', name: 'Nurse'}]}}},
    __nativeConferenceSelection: {required: true, id: '330468', slug: payload.conference_url, tickets: [{id: '1609693', name: '<b>Physician</b>'}, {id: '1609699', name: 'Physician (Virtual)'}]},
  };
  vm.runInContext(conferenceCheckoutScript, vm.createContext({window, location: {href: pageUrl}, XMLHttpRequest: XHR, URL}));
  const xhr = new XHR();
  xhr.open('POST', `${CONFERENCE_CHECKOUT_API_BASE}/transaction/saveTickets`);
  xhr.send(JSON.stringify({conference_id: '361957', tickets: [{id: '1659183', quantity: '1'}]}));
  expect(JSON.parse(send.mock.calls[0][0])).toEqual({conference_id: '330468', tickets: [{id: '1609693', quantity: '1'}]});
});

test.each(['xhr', 'fetch', 'request'])('sends %s saveTickets to the API that supplied the Redux catalogue exactly once', async transport => {
  const vm = require('vm');
  const open = jest.fn();
  const send = jest.fn();
  const postMessage = jest.fn();
  const fetch = jest.fn().mockResolvedValue({status: 200, clone: () => ({json: () => Promise.resolve(saved)})});
  function XHR() { this.addEventListener = jest.fn(); }
  XHR.prototype.open = open;
  XHR.prototype.send = send;
  function Request(url, original) { Object.assign(this, original, {url}); }
  const window = {fetch, ReactNativeWebView: {postMessage}, __nativeConferenceSelection: {
    required: true, apiBase: `${CONFERENCE_CHECKOUT_API_BASE}`, id: '330468', slug: payload.conference_url,
    tickets: [{id: '1609693', name: 'Physician'}],
  }};
  vm.runInContext(conferenceCheckoutScript, vm.createContext({window, location: {href: pageUrl}, XMLHttpRequest: XHR, URL, Request}));
  const originalUrl = 'https://newdev.emedevents.com/transaction/saveTickets';
  const targetUrl = `${CONFERENCE_CHECKOUT_API_BASE}/transaction/saveTickets`;
  const body = JSON.stringify({conference_id: '361957', tickets: [{id: '1659183', name: 'Physician', quantity: '1'}]});
  if (transport === 'xhr') {
    const xhr = new XHR();
    xhr.open('POST', originalUrl, true);
    xhr.send(body);
    expect(open).toHaveBeenCalledWith('POST', targetUrl, true);
    expect(send).toHaveBeenCalledTimes(1);
    expect(JSON.parse(send.mock.calls[0][0]).conference_id).toBe('330468');
    expect(JSON.parse(send.mock.calls[0][0]).tickets[0].id).toBe('1609693');
  } else {
    const options = {method: 'POST', credentials: 'include', headers: {test: 'preserved'}};
    const input = transport === 'request' ? {...options, url: originalUrl, clone: () => ({text: () => Promise.resolve(body)})} : originalUrl;
    window.fetch(input, transport === 'request' ? undefined : {...options, body});
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(fetch).toHaveBeenCalledTimes(1);
    const [request, init] = fetch.mock.calls[0];
    expect(typeof request === 'string' ? request : request.url).toBe(targetUrl);
    expect(JSON.parse(init.body).conference_id).toBe('330468');
    expect(JSON.parse(init.body).tickets[0].id).toBe('1609693');
    expect(transport === 'request' ? request.credentials : init.credentials).toBe('include');
    expect(JSON.parse(postMessage.mock.calls[0][0]).endpoint).toBe(targetUrl);
  }
});

test.each(['cardiology-2027', 'nursing-2027'])('matches the selected fee category for %s instead of assuming names are unique', slug => {
  const vm = require('vm');
  const send = jest.fn();
  function XHR() { this.addEventListener = jest.fn(); }
  XHR.prototype.open = jest.fn();
  XHR.prototype.send = send;
  const window = {
    ReactNativeWebView: {postMessage: jest.fn()},
    __websiteRegistrationTickets: [{id: 'old-page-ticket', name: 'Other conference'}],
    __NEXT_DATA__: {props: {pageProps: {registrationTickets: [{id: 'web-final', name: '&lt;b&gt;Physician&lt;/b&gt;', category: 'Final Fee'}]}}},
    __nativeConferenceSelection: {required: true, id: 'current-conference', slug, tickets: [
      {id: 'native-early', name: '<b>Physician</b>', category: 'Early Fee'},
      {id: 'native-final', name: '<b>Physician</b>', category: 'Final Fee'},
      {id: 'native-virtual', name: '<b>Physician (Virtual)</b>', category: 'Final Fee'},
    ]},
  };
  vm.runInContext(conferenceCheckoutScript, vm.createContext({window, location: {href: `https://www.emedevents.com/cme/${slug}`}, XMLHttpRequest: XHR, URL}));
  const xhr = new XHR();
  xhr.open('POST', `${CONFERENCE_CHECKOUT_API_BASE}/transaction/saveTickets`);
  xhr.send(JSON.stringify({conference_id: 'web-conference', tickets: [{id: 'web-final', quantity: '2'}]}));
  expect(JSON.parse(send.mock.calls[0][0])).toEqual({conference_id: 'current-conference', tickets: [{id: 'native-final', quantity: '2'}]});
});

const conference330484Tickets = [
  ['1662256', 'Physicians', '1609888', 'Physician'],
  ['1662258', 'Nurse/PA', '1609889', 'Nurse/PA'],
  ['1662260', 'Resident/Fellow', '1609890', 'Resident/Fellow'],
  ['1662262', 'Students', '1609891', 'Student'],
  ['1662264', 'Industry/Others', '1609892', 'Industry/Others'],
  ['1662266', 'Physicians (Virtual)', '1609893', 'Physician (Virtual)'],
  ['1662268', 'Nurse/PA (Virtual)', '1609894', 'Nurse/PA (Virtual)'],
  ['1662270', 'Resident/Fellow (Virtual)', '1609895', 'Resident/Fellow (Virtual)'],
  ['1662272', 'Students (Virtual)', '1609896', 'Student (Virtual)'],
  ['1662274', 'Others (Virtual)', '1609897', 'Others (Virtual)'],
];

test.each(conference330484Tickets)('maps conference 330484 website ticket %s (%s) to %s', (webId, webName, nativeId) => {
  const vm = require('vm');
  const send = jest.fn();
  const postMessage = jest.fn();
  function XHR() { this.addEventListener = jest.fn(); }
  XHR.prototype.open = jest.fn();
  XHR.prototype.send = send;
  const slug = 'conference-330484';
  const window = {
    ReactNativeWebView: {postMessage},
    __websiteRegistrationTickets: conference330484Tickets.map(([id, name]) => ({id, name})),
    __nativeConferenceSelection: {required: true, id: '330484', slug,
      tickets: conference330484Tickets.map(([, , id, name]) => ({id, name, category: 'Early Bird Fee'})),
    },
  };
  vm.runInContext(conferenceCheckoutScript, vm.createContext({window, location: {href: `https://www.emedevents.com/cme/${slug}`}, XMLHttpRequest: XHR, URL}));
  const xhr = new XHR();
  xhr.open('POST', `${CONFERENCE_CHECKOUT_API_BASE}/transaction/saveTickets`);
  xhr.send(JSON.stringify({conference_id: 'website-id', tickets: [{id: webId, quantity: '1'}], other_country: 1, refer_params: ''}));
  expect(send).toHaveBeenCalledTimes(1);
  expect(JSON.parse(send.mock.calls[0][0])).toEqual({conference_id: '330484', tickets: [{id: nativeId, quantity: '1'}], other_country: 1, refer_params: ''});
  expect(postMessage).not.toHaveBeenCalled();
});
