import React from 'react';
import {act, render} from '@testing-library/react-native';
import {BackHandler} from 'react-native';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import Globalresult from '../src/Screen/GlobalSupport/Globalresult';
import cmeReducer, {cmeCourseRequest, cmeCourseSuccess, cmeCourseFailure} from '../src/Redux/Reducers/CMEReducer';
import guestReducer, {HomelistRequest, HomelistSuccess, HomelistFailure} from '../src/Redux/Reducers/GuestReducer';
import {AppContext} from '../src/Screen/GlobalSupport/AppContext';
import connectionrequest from '../src/Utils/Helpers/NetInfo';

jest.mock('../src/Screen/GlobalSupport/AppContext', () => ({AppContext: require('react').createContext({isConnected: true})}));
jest.mock('@react-native-community/netinfo', () => ({addEventListener: callback => {callback({isConnected: true}); return () => {};}}));
jest.mock('../src/Utils/Helpers/NetInfo', () => jest.fn(() => Promise.resolve(true)));
jest.mock('../src/Utils/Helpers/Toast', () => jest.fn());
jest.mock('../src/Utils/MyStatusBar', () => 'StatusBar');
jest.mock('../src/Components/PageHeader', () => 'PageHeader');
jest.mock('../src/Utils/Helpers/Loader', () => 'Loader');
jest.mock('../src/Utils/Helpers/IntOff', () => 'Offline');
jest.mock('../src/Screen/CMECreditValut/CMEChecklistModal', () => 'Checklist');
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: require('react-native').View}));

const conference = (id, title) => ({id, title, detailpage_url: `https://example.com/${id}`});
const response = title => ({header_title: title, conferences_count: 20, conferences: [conference(title, title)], aggregations: {title}});
const navigation = {addListener: jest.fn(() => () => {}), setOptions: jest.fn(), setParams: jest.fn(), dispatch: jest.fn(), navigate: jest.fn(), goBack: jest.fn()};
const browse = {trig: {rqstType: 'normallist', mainKey: 'listby_type', beforetake: 'recommended'}};
function setup(params = browse, cached = response('Stale result'), token = 'signed-in') {
  const actions = [];
  const store = configureStore({reducer: {CMEReducer: cmeReducer, GuestReducer: guestReducer, AuthReducer: () => ({token}), CreditVaultReducer: () => ({})}, middleware: getDefault => getDefault({serializableCheck: false}).concat(() => next => action => {actions.push(action); return next(action);})});
  store.dispatch(cmeCourseSuccess(cached));
  store.dispatch(HomelistSuccess({data: {popular_courses: [conference('old-home', 'Old home result')]}}));
  const tree = nextParams => <Provider store={store}><AppContext.Provider value={{isConnected: true}}><Globalresult navigation={navigation} route={{params: nextParams}} /></AppContext.Provider></Provider>;
  const screen = render(tree(params));
  return {store, screen, actions, tree};
}
const flush = () => act(async () => {await Promise.resolve();});
const lastRequest = (actions, type = 'CME/cmeCourseRequest') => actions.filter(a => a.type === type).at(-1);
const reply = (store, request, data, creator = cmeCourseSuccess) => act(() => store.dispatch({...creator(data), meta: request.meta}));

beforeEach(() => connectionrequest.mockImplementation(() => Promise.resolve(true)));

test.each([
  ['guest', 'hardware'], ['guest', 'header'],
  ['signed-in', 'hardware'], ['signed-in', 'header'],
])('%s %s back clears empty filters without leaving results', async (account, back) => {
  const listener = jest.spyOn(BackHandler, 'addEventListener');
  const original = {trig: {...browse.trig, Realback: account === 'guest' ? 'guest' : 'cont'}};
  const filtered = {...original, filterDatSh: {returnTake: original, filterDatSh: [], minValP: 999}};
  const {store, screen, actions, tree} = setup(filtered, response('Stale result'), account === 'guest' ? null : 'signed-in');
  try {
    await flush();
    reply(store, lastRequest(actions), {conferences: [], conferences_count: 0});
    act(() => {
      if (back === 'hardware') listener.mock.calls.filter(([event]) => event === 'hardwareBackPress').at(-1)[1]();
      else screen.UNSAFE_getAllByType('PageHeader')[0].props.onBackPress();
    });
    expect(navigation.setParams).toHaveBeenCalledWith({...original, filterDatSh: null});
    expect(navigation.goBack).not.toHaveBeenCalled();
    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(navigation.dispatch).not.toHaveBeenCalled();
    screen.rerender(tree({...filtered, ...navigation.setParams.mock.calls.at(-1)[0]}));
    await flush();
    const restored = lastRequest(actions);
    expect(restored.payload.price_from).not.toBe(999);
    reply(store, restored, response('Original course'));
    expect(screen.getAllByText('Original course').length).toBeGreaterThan(0);
    act(() => screen.UNSAFE_getAllByType('PageHeader')[0].props.onBackPress());
    expect(navigation.goBack).toHaveBeenCalled();
  } finally {
    listener.mockRestore();
  }
});

test('cached and unrelated results never replace the current Browse Courses request', async () => {
  const {store, screen, actions} = setup();
  expect(screen.queryByText('Stale result')).toBeNull();
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(true);
  await flush();
  const request = lastRequest(actions);
  act(() => store.dispatch(cmeCourseSuccess(response('Other screen'))));
  expect(screen.queryByText('Other screen')).toBeNull();
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(true);
  reply(store, request, response('Correct course'));
  expect(screen.getAllByText('Correct course').length).toBeGreaterThan(0);
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(false);
  act(() => store.dispatch(cmeCourseSuccess(response('Foreign header'))));
  expect(screen.queryByText('Foreign header')).toBeNull();
  expect(screen.getAllByText('Correct course').length).toBeGreaterThan(0);
});

test('changing routes rejects an old response and waits for the new query', async () => {
  const {store, screen, actions, tree} = setup();
  await flush();
  const old = lastRequest(actions);
  screen.rerender(tree({trig: {...browse.trig, beforetake: 'free'}}));
  await flush();
  const current = lastRequest(actions);
  expect(current.meta).not.toEqual(old.meta);
  reply(store, old, response('Late old result'));
  expect(screen.queryByText('Late old result')).toBeNull();
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(true);
  reply(store, current, response('New query'));
  expect(screen.getAllByText('New query').length).toBeGreaterThan(0);
});

test('guest View All ignores cached home data and results from another home request', async () => {
  const {store, screen, actions} = setup({homeListPayload: {sectionTitle: 'Most Popular Conferences', is_mobile: 1}});
  await flush();
  const request = lastRequest(actions, 'Guest/HomelistRequest');
  expect(screen.queryByText('Old home result')).toBeNull();
  act(() => store.dispatch(HomelistSuccess({data: {popular_courses: [conference('foreign', 'Foreign home')]}})));
  expect(screen.queryByText('Foreign home')).toBeNull();
  reply(store, request, {data: {popular_courses: [conference('fresh', 'Fresh home')]}}, HomelistSuccess);
  expect(screen.getByText('Fresh home')).toBeTruthy();
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(false);
});

test.each(['empty', 'failure', 'offline'])('%s finishes loading without exposing stale results', async kind => {
  if (kind === 'offline') connectionrequest.mockRejectedValue(new Error('offline'));
  const {store, screen, actions} = setup();
  await flush();
  if (kind !== 'offline') reply(store, lastRequest(actions), kind === 'empty' ? {conferences: [], conferences_count: 0} : {}, kind === 'empty' ? cmeCourseSuccess : cmeCourseFailure);
  expect(screen.queryByText('Stale result')).toBeNull();
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(false);
});

test.each([[cmeReducer, cmeCourseRequest, cmeCourseSuccess, cmeCourseFailure, 'cmeCourseRequestId', 'cmeCourseResponse'], [guestReducer, HomelistRequest, HomelistSuccess, HomelistFailure, 'HomelistRequestId', 'HomelistResponse']])('request metadata is optional and does not change legacy response payloads', (reducer, request, success, failure, key, responseKey) => {
  let state = reducer(undefined, {...request({}), meta: {globalResultRequestId: 'owned'}});
  expect(state[key]).toBe('owned');
  const payload = {conferences: []};
  state = reducer(state, success(payload));
  expect(state[key]).toBeNull();
  expect(state[responseKey]).toEqual(payload);
  expect(reducer(state, failure({}))[key]).toBeNull();
});

test('guest section changes do not display the previous section while waiting', async () => {
  const {store, screen, actions, tree} = setup({homeListPayload: {sectionTitle: 'Most Popular Conferences', category: 'popular'}});
  await flush();
  const old = lastRequest(actions, 'Guest/HomelistRequest');
  reply(store, old, {data: {popular_courses: [conference('popular', 'Popular course')]}}, HomelistSuccess);
  screen.rerender(tree({homeListPayload: {sectionTitle: 'Free Courses', category: 'free'}}));
  await flush();
  const current = lastRequest(actions, 'Guest/HomelistRequest');
  expect(screen.queryByText('Popular course')).toBeNull();
  reply(store, old, {data: {popular_courses: [conference('late', 'Late popular course')]}}, HomelistSuccess);
  expect(screen.queryByText('Late popular course')).toBeNull();
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(true);
  reply(store, current, {data: {free_conferences: [conference('free', 'Free course')]}}, HomelistSuccess);
  expect(screen.getByText('Free course')).toBeTruthy();
});

test('filter-only navigation requests fresh results and includes price filter changes', async () => {
  const filter = {filterDatSh: {returnTake: browse, filterDatSh: [], minValP: 10}};
  const {store, screen, actions, tree} = setup(filter);
  await flush();
  const old = lastRequest(actions);
  reply(store, old, response('Old price range'));
  screen.rerender(tree({filterDatSh: {...filter.filterDatSh, minValP: 30}}));
  await flush();
  const current = lastRequest(actions);
  expect(current.payload.price_from).toBe(30);
  expect(screen.queryByText('Old price range')).toBeNull();
  reply(store, current, response('New price range'));
  expect(screen.getAllByText('New price range').length).toBeGreaterThan(0);
});

test('a slow connectivity check cannot dispatch an obsolete query after navigation', async () => {
  const resolveConnections = [];
  connectionrequest.mockImplementation(() => new Promise(resolve => resolveConnections.push(resolve)));
  const {screen, actions, tree} = setup();
  screen.rerender(tree({trig: {...browse.trig, beforetake: 'free'}}));
  await act(async () => {resolveConnections.at(-1)(true); await Promise.resolve();});
  const current = lastRequest(actions);
  await act(async () => {resolveConnections[0](true); await Promise.resolve();});
  expect(lastRequest(actions)).toBe(current);
  expect(actions.filter(action => action.type === 'CME/cmeCourseRequest')).toHaveLength(1);
});

test('pagination appends only the matching page without losing accepted results', async () => {
  const {store, screen, actions} = setup();
  await flush();
  const first = lastRequest(actions);
  reply(store, first, response('First course'));
  const list = screen.UNSAFE_getAllByType(require('react-native').FlatList).find(node => node.props.data?.some(item => item.id === 'First course'));
  act(() => list.props.onEndReached());
  await flush();
  const second = lastRequest(actions);
  expect(second.payload.pageno).toBe(1);
  reply(store, first, response('Wrong page'));
  expect(screen.queryByText('Wrong page')).toBeNull();
  reply(store, second, response('Second course'));
  expect(screen.getByText('First course')).toBeTruthy();
  expect(screen.getAllByText('Second course').length).toBeGreaterThan(0);
});
