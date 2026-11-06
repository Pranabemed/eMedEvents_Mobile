import React from 'react';
import {act, render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import Screen from '../src/Screen/Specialization/ChooseSpecailization';
import reducer, {stateCourseRequest, stateCourseSuccess, stateCourseFailure} from '../src/Redux/Reducers/DashboardReducer';
import {AppContext} from '../src/Screen/GlobalSupport/AppContext';

jest.mock('../src/Screen/GlobalSupport/AppContext', () => ({AppContext: require('react').createContext({})}));
jest.mock('@react-native-community/netinfo', () => ({addEventListener: cb => {cb({isConnected: true}); return () => {};}}));
jest.mock('../src/Utils/Helpers/NetInfo', () => jest.fn(() => Promise.resolve(true)));
jest.mock('../src/Utils/Helpers/Toast', () => jest.fn());
jest.mock('../src/Utils/MyStatusBar', () => 'StatusBar');
jest.mock('../src/Components/PageHeader', () => 'PageHeader');
jest.mock('../src/Utils/Helpers/Loader', () => 'Loader');
jest.mock('../src/Utils/Helpers/IntOff', () => 'Offline');
jest.mock('../src/Components/FlatlistShimmer', () => 'Shimmer');
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: require('react-native').View}));
const data = name => ({data: {state_data: {topics: [{name}]}}});
const tagged = (action, id) => ({...action, meta: {complianceRequestId: id}});

test('switching states hides cached content until the matching request completes', async () => {
  const actions = [];
  const store = configureStore({reducer: {DashboardReducer: reducer}, middleware: getDefault => getDefault().concat(() => next => action => {actions.push(action); return next(action);})});
  store.dispatch(stateCourseSuccess(data('Cached topic')));
  const navigation = {setOptions: jest.fn(), dispatch: jest.fn(), navigate: jest.fn()};
  const tree = id => <Provider store={store}><AppContext.Provider value={{isConnected: true}}><Screen navigation={navigation} route={{params: {stateID: {state_id: id, state_name: id}}}} /></AppContext.Provider></Provider>;
  const screen = render(tree('A'));
  expect(screen.queryByText('Cached topic')).toBeNull();
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(true);
  await act(async () => {await Promise.resolve();});
  const first = actions.filter(a => a.type === stateCourseRequest.type).at(-1);
  act(() => store.dispatch({...stateCourseSuccess(data('State A topic')), meta: first.meta}));
  expect(screen.getByText('State A topic')).toBeTruthy();
  screen.rerender(tree('B'));
  expect(screen.queryByText('State A topic')).toBeNull();
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(true);
  await act(async () => {await Promise.resolve();});
  const second = actions.filter(a => a.type === stateCourseRequest.type).at(-1);
  act(() => store.dispatch({...stateCourseSuccess(data('Late A topic')), meta: first.meta}));
  expect(screen.queryByText('Late A topic')).toBeNull();
  act(() => store.dispatch({...stateCourseSuccess(data('State B topic')), meta: second.meta}));
  expect(screen.getByText('State B topic')).toBeTruthy();
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(false);
});

test('failed request stops loading without restoring old compliance data', () => {
  const cached = reducer(undefined, stateCourseSuccess(data('Old')));
  const pending = reducer(cached, tagged(stateCourseRequest({state_id: 'B'}), 'B'));
  expect(pending.stateCourseResponse).toEqual({});
  const failed = reducer(pending, tagged(stateCourseFailure({}), 'B'));
  expect(failed.stateCourseLoading).toBe(false);
  expect(failed.stateCourseResponse).toEqual({});
});
