import React from 'react';
import {act, create} from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerModal from '../src/Components/DrawerModal';

let mockState;
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({useSelector: select => select(mockState), useDispatch: () => mockDispatch}));
jest.mock('../src/Navigator/StackNav', () => 'StackNav');
jest.mock('../src/Navigator/RootNavigation', () => ({navigationRef: {current: {dispatch: jest.fn()}}}));
jest.mock('../src/Screen/GlobalSupport/AppContext', () => ({AppContext: require('react').createContext({fulldashbaord: [], setAddit: jest.fn()})}));
jest.mock('react-native-modal', () => 'Modal');
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: 'SafeAreaView', useSafeAreaInsets: () => ({top: 0, bottom: 0})}));
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');
jest.mock('../src/Utils/Helpers/nonUsaFlow', () => ({
  readNonUsaFlowState: async () => ({isNonUsa: true, ipCountryCode: 'IN'}),
  readNonUsaPermanentFlags: async () => ({}),
  isUsaCountryCode: value => value === 'US',
}));
const user = {user_address: {country_code: 'US'}, profession: 'Physician', profession_type: 'MD', subscription_user: 'non-subscribed'};
let tree;
const label = text => tree.root.findAll(node => node.props.children === text).length > 0;
beforeEach(async () => {
  await AsyncStorage.clear();
  mockState = {AuthReducer: {}, DashboardReducer: {}, WebcastReducer: {}};
});
afterEach(async () => {if (tree) await act(async () => tree.unmount()); tree = null;});

test('first Menu render uses live login while persisted account is empty and IP is India', async () => {
  mockState.AuthReducer = {dircetloginResponse: {user}};
  await act(async () => {tree = create(<DrawerModal isVisible onBackdropPress={() => {}} />);});
  expect(label('Become a Prime Member')).toBe(true);
});

test('Menu updates when USA profile arrives without reload', async () => {
  mockState.AuthReducer = {dircetloginResponse: {user: {firstname: 'User'}}};
  await act(async () => {tree = create(<DrawerModal isVisible onBackdropPress={() => {}} />);});
  expect(label('Become a Prime Member')).toBe(false);
  mockState.DashboardReducer = {mainprofileResponse: {...user, professional_information: {profession: 'Physician', profession_type: 'MD'}}};
  await act(async () => tree.update(<DrawerModal isVisible onBackdropPress={() => {}} />));
  expect(label('Become a Prime Member')).toBe(true);
});

test.each([
  [{...user, user_address: {country_code: 'IN'}}, false],
  [{...user, profession: 'Nurse'}, false],
])('ineligible account does not receive Prime option', async (account, expected) => {
  mockState.AuthReducer = {dircetloginResponse: {user: account}};
  await act(async () => {tree = create(<DrawerModal isVisible onBackdropPress={() => {}} />);});
  expect(label('Become a Prime Member')).toBe(expected);
});

test('existing Prime user retains Prime Member label', async () => {
  mockState.AuthReducer = {dircetloginResponse: {user: {...user, subscription_user: 'subscribed'}}};
  await act(async () => {tree = create(<DrawerModal isVisible onBackdropPress={() => {}} />);});
  expect(label('Prime Member')).toBe(true);
  expect(label('Become a Prime Member')).toBe(false);
});
