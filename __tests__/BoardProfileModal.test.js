import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import BoardProfile from '../src/Screen/Profile/BoardProfile';

const mockDispatch = jest.fn();
let mockFocused = true;
let mockState;
jest.mock('react-redux', () => ({useDispatch: () => mockDispatch, useSelector: selector => selector(mockState)}));
jest.mock('@react-navigation/native', () => ({useIsFocused: () => mockFocused, CommonActions: {reset: jest.fn()}}));
jest.mock('../src/Screen/GlobalSupport/AppContext', () => ({AppContext: require('react').createContext({isConnected: true})}));
jest.mock('../src/Utils/Helpers/NetInfo', () => () => Promise.resolve(true));
jest.mock('@react-native-community/netinfo', () => ({addEventListener: callback => {callback({isConnected: true}); return () => {};}}));
jest.mock('../src/Utils/Helpers/Toast', () => jest.fn());
jest.mock('../src/Utils/MyStatusBar', () => 'StatusBar');
jest.mock('../src/Components/PageHeader', () => 'PageHeader');
jest.mock('../src/Screen/Profile/ProfileModal', () => 'ProfileModal');
jest.mock('../src/Utils/Helpers/Loader', () => 'Loader');
jest.mock('../src/Utils/Helpers/IntOff', () => 'Offline');
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: require('react-native').View}));

const board = {id: 1, board_id: '1', board_name: 'Test Certification Board', speciality: 'Cardiology'};
const navigation = {setOptions: jest.fn(), dispatch: jest.fn()};
const route = {params: {}};
const flush = () => act(async () => {await Promise.resolve();});

test('board title and menu open without refetching or showing a background loader; return from edit still refreshes', async () => {
  mockState = {
    ProfileReducer: {status: 'Profile/boardListProfileSuccess', boardListProfileResponse: {board_certifications: [board]}},
    DashboardReducer: {status: '', mainprofileResponse: {specialities: {1: 'Cardiology'}, professional_information: {profession: 'Physician'}}, dashboardResponse: {data: {board_certifications: []}}, boardSpecialityResponse: {certification_boards: {}}},
  };
  const screen = render(<BoardProfile navigation={navigation} route={route} />);
  await flush();
  expect(screen.UNSAFE_getByType('PageHeader').props.showTitle).toBe(true);
  mockDispatch.mockClear();
  fireEvent.press(screen.getByText('Test Certification Board'));
  await flush();
  expect(screen.UNSAFE_getByType('ProfileModal').props.profiletakeshow).toBe(true);
  expect(screen.UNSAFE_getByType('ProfileModal').props.detectdata).toEqual(board);
  expect(mockDispatch).not.toHaveBeenCalled();
  mockState.ProfileReducer.status = 'Profile/boardListProfileRequest';
  screen.rerender(<BoardProfile navigation={navigation} route={route} />);
  expect(screen.UNSAFE_getByType('Loader').props.visible).toBe(false);
  act(() => screen.UNSAFE_getByType('ProfileModal').props.setProfiletakeshow(false));
  await flush();
  expect(mockDispatch).not.toHaveBeenCalled();
  mockFocused = false;
  screen.rerender(<BoardProfile navigation={navigation} route={route} />);
  await flush();
  expect(mockDispatch).not.toHaveBeenCalled();
  mockFocused = true;
  screen.rerender(<BoardProfile navigation={navigation} route={route} />);
  await flush();
  expect(mockDispatch.mock.calls.some(([action]) => action.type === 'Profile/boardListProfileRequest')).toBe(true);
});
