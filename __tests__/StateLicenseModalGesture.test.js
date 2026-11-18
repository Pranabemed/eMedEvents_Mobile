import React from 'react';
import {Platform, FlatList, StyleSheet} from 'react-native';
import {render, fireEvent, act} from '@testing-library/react-native';
import ProfileModal from '../src/Screen/Profile/ProfileModal';
jest.mock('react-redux', () => ({useDispatch: () => jest.fn(), useSelector: select => select({ProfileReducer: {status: ''}})}));
jest.mock('react-native-modal', () => 'Modal');
jest.mock('react-native-safe-area-context', () => ({useSafeAreaInsets: () => ({bottom: 24})}));
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');
jest.mock('../src/Utils/Helpers/NetInfo', () => () => Promise.resolve());
jest.mock('../src/Utils/Helpers/Toast', () => jest.fn());
jest.mock('../src/Utils/Helpers/Dimen', () => n => n);
const license = {id: 12, license_file: '', to_date: '2099-01-01'};
let nav, close;
beforeEach(() => {
  jest.replaceProperty(Platform, 'OS', 'android');
  jest.spyOn(console, 'log').mockImplementation(() => {});
  nav = {navigate: jest.fn()};
  close = jest.fn();
});
afterEach(() => jest.restoreAllMocks());
const modal = extra => render(<ProfileModal profiletakeshow setProfiletakeshow={close} detectdata={license} nav={nav} {...extra} />);
test('Android system Back dismisses the license modal without navigating the underlying page', () => {
  const screen = modal();
  act(() => screen.UNSAFE_getByType('Modal').props.onBackButtonPress());
  expect(close).toHaveBeenCalledWith(false);
  act(() => screen.UNSAFE_getByType('Modal').props.onModalHide());
  expect(nav.navigate).not.toHaveBeenCalled();
});
test('Android Edit waits for native modal dismissal and navigates only once', () => {
  const screen = modal();
  fireEvent.press(screen.getByText('Edit'));
  fireEvent.press(screen.getByText('Edit'));
  expect(close).toHaveBeenCalledTimes(1);
  expect(nav.navigate).not.toHaveBeenCalled();
  act(() => screen.UNSAFE_getByType('Modal').props.onModalHide());
  expect(nav.navigate).toHaveBeenCalledWith('AddLicense', {profiledet: license});
  act(() => screen.UNSAFE_getByType('Modal').props.onModalHide());
  expect(nav.navigate).toHaveBeenCalledTimes(1);
});
test('iOS retains the existing edit navigation', () => {
  jest.replaceProperty(Platform, 'OS', 'ios');
  const screen = modal();
  fireEvent.press(screen.getByText('Edit'));
  expect(nav.navigate).toHaveBeenCalledWith('AddLicense', {profiledet: license});
});

test.each(['Profile/StateProfile', 'Specialization/AddLicense'])('%s installs Back handling only while focused and removes it on blur', file => {
  const fs = require('fs');
  const path = require('path');
  const source = fs.readFileSync(path.resolve(__dirname, `../src/Screen/${file}.js`), 'utf8');
  const ast = require('@babel/parser').parse(source, {sourceType: 'module', plugins: ['jsx']});
  let effect;
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'CallExpression' && node.callee.name === 'useEffect' && source.slice(node.start, node.end).includes("'hardwareBackPress'")) effect = node.arguments[0];
    Object.values(node).forEach(value => Array.isArray(value) ? value.forEach(visit) : value && typeof value === 'object' && visit(value));
  };
  visit(ast);
  expect(effect).toBeDefined();
  const install = new Function('BackHandler', 'isFocus', 'isFoucs', 'SearchBack', 'addCreditBack', `return (${source.slice(effect.start, effect.end)})();`);
  const remove = jest.fn();
  const back = jest.fn();
  const handler = {addEventListener: jest.fn(() => ({remove}))};
  expect(install(handler, false, false, back, back)).toBeUndefined();
  expect(handler.addEventListener).not.toHaveBeenCalled();
  const cleanup = install(handler, true, true, back, back);
  expect(handler.addEventListener.mock.calls[0][1]()).toBe(true);
  expect(back).toHaveBeenCalledTimes(1);
  cleanup();
  expect(remove).toHaveBeenCalledTimes(1);
});


test.each([
  [{license_file: '', to_date: '2099-01-01'}, 1],
  [{license_file: 'license.pdf', to_date: '2099-01-01'}, 2],
  [{license_file: 'license.pdf', to_date: '2000-01-01'}, 3],
])('license sheet fits %j without unused row space', (details, count) => {
  const screen = modal({detectdata: {...license, ...details}});
  const list = screen.UNSAFE_getByType(FlatList);
  const style = StyleSheet.flatten(list.parent.props.style);
  expect(list.props.data).toHaveLength(count);
  expect(style.height).toBe(count * 50 + 7 + 36);
  expect(style.paddingBottom).toBe(36);
  expect(list.props.contentContainerStyle.paddingBottom).toBe(0);
  expect(list.props.scrollEnabled).toBe(false);
});
