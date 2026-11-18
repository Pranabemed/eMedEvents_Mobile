import React from 'react';
import {act, create} from 'react-test-renderer';
import {Pressable, TextInput} from 'react-native';
import InputField from '../src/Components/CellInput';
import fs from 'fs';
import path from 'path';

jest.mock('../src/Utils/Helpers/Dimen', () => n => n);
// Exercise both actual email JSX branches with the real native input wrapper.
const source = fs.readFileSync(path.resolve(__dirname, '../src/Screen/DetailsPageWebcast/CheckoutInputbox.js'), 'utf8');
const branches = ['attendee', 'billing'].map(branch => {
  const marker = source.indexOf('testID={`checkout-email-area-' + branch);
  const start = source.lastIndexOf('<Pressable', marker);
  const end = source.indexOf('</Pressable>', marker) + '</Pressable>'.length;
  const code = require('@babel/core').transformSync(`function renderEmail(){return (${source.slice(start, end)});}`, {
    configFile: false, babelrc: false, plugins: ['@babel/plugin-transform-react-jsx'],
  }).code;
  return {branch, render: new Function('React', 'Pressable', 'InputField', 'normalize', 'index', 'isGuestCheckout', 'allmsg', 'emailInputRefs', 'formData', 'handleInputChangeeamilad', 'handleInputChange', 'handleInputChanged', code + '; return renderEmail();')};
});
let tree;
beforeEach(() => jest.useFakeTimers());
afterEach(async () => {if (tree) await act(async () => tree.unmount()); tree = null; jest.clearAllTimers(); jest.useRealTimers();});
test.each(branches)('$branch email label/padding tap focuses the real input and preserves editing', async ({branch, render}) => {
  const focus = jest.fn();
  const changed = jest.fn();
  const refs = {current: {}};
  const element = render(React, Pressable, InputField, n => n, 0, true, '', refs, [{emailad: ''}], jest.fn(), changed, jest.fn());
  await act(async () => {tree = create(element, {createNodeMock: () => ({focus})});});
  const nativeFocus = jest.spyOn(refs.current[`${branch}-0`], 'focus');
  await act(async () => tree.root.findByProps({testID: `checkout-email-area-${branch}-0`}).props.onPress());
  expect(nativeFocus).toHaveBeenCalledTimes(1);
  const input = tree.root.findByType(TextInput);
  expect(input.props.editable).toBe(true);
  expect(input.props.keyboardType).toBe('email-address');
  expect(input.props.autoCapitalize).toBe('none');
  await act(async () => input.props.onChangeText('guest@example.com'));
  expect(changed).toHaveBeenCalledWith(0, 'emailad', 'guest@example.com');
});
test.each(branches)('$branch preserves the authenticated primary email lock', async ({branch, render}) => {
  const focus = jest.fn();
  await act(async () => {tree = create(render(React, Pressable, InputField, n => n, 0, false, '', {current: {}}, [{emailad: 'account@example.com'}], jest.fn(), jest.fn(), jest.fn()), {createNodeMock: () => ({focus})});});
  await act(async () => tree.root.findByProps({testID: `checkout-email-area-${branch}-0`}).props.onPress());
  expect(focus).not.toHaveBeenCalled();
  expect(tree.root.findByType(TextInput).props.editable).toBe(false);
});
