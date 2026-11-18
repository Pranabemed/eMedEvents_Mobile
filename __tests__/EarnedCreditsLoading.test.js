import React from 'react';
import {act, create} from 'react-test-renderer';
import {DeviceEventEmitter} from 'react-native';
const mockFocus = React.createContext(true);
let mockFocused = true;
import reducer from '../src/Redux/Reducers/CreditVaultReducer';
import dashboardReducer from '../src/Redux/Reducers/DashboardReducer';

let mockState;
const mockDispatch = jest.fn(action => {
  mockState.CreditVaultReducer = reducer(mockState.CreditVaultReducer, action);
  mockState.DashboardReducer = dashboardReducer(mockState.DashboardReducer, action);
});
let mockResolveStorage;
const mockConnection = jest.fn(() => Promise.resolve());
jest.mock('react-redux', () => ({useSelector: fn => fn(mockState), useDispatch: () => mockDispatch}));
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => require('react').useContext(mockFocus),
  useFocusEffect: callback => {
    const React = require('react');
    const focused = React.useContext(mockFocus);
    React.useEffect(() => focused ? callback() : undefined, [callback, focused]);
  },
}));
jest.mock('../src/Utils/Helpers/nonUsaFlow', () => ({
  isNonUsaAccount: () => false,
  readNonUsaFlowState: () => new Promise(resolve => {mockResolveStorage = resolve;}),
}));
jest.mock('../src/Utils/Helpers/NetInfo', () => ({__esModule: true, default: () => mockConnection()}));
jest.mock('../src/Utils/Helpers/Toast', () => jest.fn());
jest.mock('../src/Utils/Helpers/Loader', () => 'CreditsLoader');
jest.mock('../src/Utils/Helpers/IntOff', () => 'Offline');
jest.mock('../src/Utils/Helpers/Dimen', () => n => n);
jest.mock('../src/Components/PageHeader', () => 'PageHeader');
jest.mock('../src/Components/CustomTextfiled', () => 'CustomTextField');
jest.mock('../src/Screen/CMECreditValut/CertificatModal', () => 'CertificatModal');
jest.mock('../src/Screen/CMECreditValut/CMEChecklistModal', () => 'CMEChecklistModal');
jest.mock('../src/Screen/GlobalSupport/AppContext', () => ({AppContext: require('react').createContext({})}));
jest.mock('react-native-vector-icons/Octicons', () => 'Icon');
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');
jest.mock('react-native-vector-icons/Feather', () => 'Icon');
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: 'SafeAreaView'}));
const Screen = require('../src/Screen/CMECreditValut/FileCheck').default;
let tree;
let props;
const loading = () => tree.root.findByType('CreditsLoader').props.visible;
const renderScreen = () => <mockFocus.Provider value={mockFocused}><Screen {...props} /></mockFocus.Provider>;
const update = async () => act(async () => tree.update(renderScreen()));
beforeEach(() => {
  mockFocused = true;
  mockState = {CreditVaultReducer: reducer(undefined, {}), DashboardReducer: dashboardReducer(undefined, {}), AuthReducer: {}};
  props = {navigation: {setOptions: jest.fn()}, route: {params: {boardID: {state_id: '1', certificates: []}}}};
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(async () => {
  if (tree) await act(async () => tree.unmount());
  tree = null;
  jest.restoreAllMocks();
});
test.each(['state', 'board'])('%s credits stay loading through storage and API, then finish on success', async kind => {
  if (kind === 'board') props.route.params = {boardCert: {board_id: '5', certificates: []}};
  await act(async () => {tree = create(renderScreen());});
  expect(loading()).toBe(true);
  await act(async () => mockResolveStorage(null));
  await update();
  expect(loading()).toBe(true);
  mockDispatch({type: 'CreditVault/creditvaultSuccess', payload: {certificates: [], state_data: {}}});
  await update();
  if (kind === 'board') {
    expect(loading()).toBe(true);
    mockDispatch({type: 'CreditVault/boardvaultSuccess', payload: {board_data: {'5': {certificates: []}}}});
    await update();
  }
  expect(loading()).toBe(false);
});
test('API failure stops the loader', async () => {
  await act(async () => {tree = create(renderScreen());});
  await act(async () => mockResolveStorage(null));
  await update();
  mockDispatch({type: 'CreditVault/creditvaultFailure'});
  await update();
  expect(loading()).toBe(false);
});
test('connection failure stops the loader', async () => {
  mockConnection.mockRejectedValueOnce(new Error('offline'));
  await act(async () => {tree = create(renderScreen());});
  await act(async () => mockResolveStorage(null));
  expect(loading()).toBe(false);
});

test.each(['Success', 'Failure'])('non-USA loader survives unrelated dashboard updates and stops on %s', async outcome => {
  props.route.params = {isNonUsaUser: true};
  const hasOverlay = () => tree.root.findAll(node => node.props.style?.zIndex === 1000001).length > 0;
  await act(async () => {tree = create(renderScreen());});
  expect(hasOverlay()).toBe(true);
  await act(async () => mockResolveStorage(null));
  await update();
  expect(hasOverlay()).toBe(true);
  mockDispatch({type: 'Dashboard/mainprofileRequest'});
  await update();
  expect(hasOverlay()).toBe(true);
  mockDispatch({type: `Dashboard/stateMandatory${outcome}`, payload: {state_data: {}}});
  await update();
  expect(hasOverlay()).toBe(false);
});

 test('saved Board credits refresh in place even when another action overwrites success status', async () => {
  props.route.params = {boardCert: {board_id: '5', certificates: []}};
  await act(async () => {tree = create(renderScreen());});
  await act(async () => mockResolveStorage(null));
  await update();
  mockDispatch({type: 'CreditVault/creditvaultSuccess', payload: {certificates: {}}});
  mockDispatch({type: 'CreditVault/boardvaultSuccess', payload: {board_data: {'5': {certificates: []}}}});
  await update();
  expect(loading()).toBe(false);
  mockDispatch.mockClear();
  mockDispatch({type: 'Dashboard/addCreditVaultSuccess', payload: {success: true}});
  mockDispatch({type: 'Dashboard/dashboardRequest'});
  await update();
  expect(mockDispatch.mock.calls.some(([a]) => a.type === 'CreditVault/boardvaultRequest')).toBe(true);
  expect(mockDispatch.mock.calls.some(([a]) => a.type === 'CreditVault/creditvaultRequest')).toBe(true);
  expect(loading()).toBe(false); // Refresh retains the already loaded page.
  const certificates = [{id: 'new', program_title: 'Newly Added Credit', mandated_course: '0'}];
  mockDispatch({type: 'CreditVault/creditvaultSuccess', payload: {certificates: {}}});
  mockDispatch({type: 'CreditVault/boardvaultSuccess', payload: {board_data: {'5': {certificates}}}});
  mockDispatch({type: 'CreditVault/downloadTranscriptRequest'});
  await update();
  expect(tree.root.findByType('CertificatModal').props.dataFull[0]).toEqual(certificates);
  mockDispatch({type: 'CreditVault/downloadTranscriptFailure'});
  await update();
  expect(loading()).toBe(false);
  expect(JSON.stringify(tree.toJSON())).toContain('Newly Added Credit');
});

test('saved State credit appears without reopening the page', async () => {
  await act(async () => {tree = create(renderScreen());});
  await act(async () => mockResolveStorage(null));
  await update();
  mockDispatch({type: 'CreditVault/creditvaultSuccess', payload: {state_data: {'1': {certificates: []}}}});
  await update();
  expect(loading()).toBe(false);
  mockDispatch.mockClear();
  mockDispatch({type: 'Dashboard/addCreditVaultSuccess', payload: {success: true}});
  mockDispatch({type: 'Dashboard/dashboardRequest'});
  await update();
  expect(mockDispatch.mock.calls).toContainEqual([expect.objectContaining({type: 'CreditVault/creditvaultRequest', payload: {state_id: '1'}})]);
  const credit = {id: 'new-state', program_title: 'New State Credit', mandated_course: '0', program_date: '2026-01-10'};
  mockDispatch({type: 'CreditVault/creditvaultSuccess', payload: {state_data: {'1': {certificates: [credit]}}}});
  mockDispatch({type: 'CreditVault/boardvaultRequest'});
  await update();
  expect(loading()).toBe(false);
  expect(tree.root.findAll(node => node.props.children === 'New State Credit').length).toBeGreaterThan(0);
});


test('returning from Add Credits refreshes once without flashing the loader or looping on new rows', async () => {
  await act(async () => {tree = create(renderScreen());});
  await act(async () => mockResolveStorage(null));
  await update();
  mockDispatch({type: 'CreditVault/creditvaultSuccess', payload: {state_data: {'1': {certificates: []}}}});
  await update();
  mockFocused = false;
  await update();
  mockDispatch.mockClear();
  mockDispatch({type: 'Dashboard/addCreditVaultSuccess', payload: {success: true}});
  await act(async () => DeviceEventEmitter.emit('CREDIT_VAULT_UPDATED', {state_id: '1'}));
  await update();
  expect(mockDispatch.mock.calls.filter(([a]) => a.type === 'CreditVault/creditvaultRequest')).toHaveLength(0);
  mockFocused = true;
  await update();
  await act(async () => mockResolveStorage(null));
  await update();
  await act(async () => DeviceEventEmitter.emit('CREDIT_VAULT_UPDATED', {state_id: '1'}));
  expect(loading()).toBe(false);
  expect(mockDispatch.mock.calls.filter(([a]) => a.type === 'CreditVault/creditvaultRequest')).toHaveLength(1);
  mockDispatch({type: 'CreditVault/creditvaultSuccess', payload: {state_data: {'1': {certificates: [{id: 'stable', program_title: 'Stable New Credit', mandated_course: '0'}]}}}});
  await update();
  await update();
  expect(loading()).toBe(false);
  expect(mockDispatch.mock.calls.filter(([a]) => a.type === 'CreditVault/creditvaultRequest')).toHaveLength(1);
  expect(tree.root.findAll(node => node.props.children === 'Stable New Credit').length).toBeGreaterThan(0);
});
