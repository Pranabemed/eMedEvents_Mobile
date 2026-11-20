import React from 'react';
import {render, act} from '@testing-library/react-native';
import ExternalWebView from '../src/Screen/GlobalSupport/ExternalWebView';

jest.mock('@react-navigation/native', () => ({useFocusEffect: jest.fn()}));
jest.mock('react-native-webview', () => ({WebView: require('react').forwardRef((props, ref) => require('react').createElement('WebView', props))}));
jest.mock('../src/Components/PageHeader', () => 'PageHeader');
jest.mock('../src/Utils/MyStatusBar', () => 'MyStatusBar');
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: 'SafeAreaView'}));
jest.mock('../src/Screen/GlobalSupport/hooks/useConferenceCheckout', () => ({__esModule: true, default: () => ({cancel: jest.fn(), shouldStartLoad: () => true, onMessage: jest.fn(), loading: false}), conferenceCheckoutScript: 'true;'}));

test('loads the CME URL and resets a previous popup when a new deep link arrives', () => {
  const navigation = {navigate: jest.fn(), canGoBack: () => false};
  const url = 'https://www.emedevents.com/cme';
  const screen = render(<ExternalWebView navigation={navigation} route={{params: {url, key: 'first'}}} />);
  expect(screen.UNSAFE_getByType('WebView').props.source.uri).toBe(url);
  act(() => screen.UNSAFE_getByType('WebView').props.onOpenWindow({nativeEvent: {targetUrl: `${url}/old-course`}}));
  expect(screen.UNSAFE_getByType('WebView').props.source.uri).toBe(`${url}/old-course`);
  screen.rerender(<ExternalWebView navigation={navigation} route={{params: {url, key: 'second'}}} />);
  expect(screen.UNSAFE_getByType('WebView').props.source.uri).toBe(url);
  screen.rerender(<ExternalWebView navigation={navigation} route={{params: {url: `${url}/new-course?RefID=123`, key: 'third'}}} />);
  expect(screen.UNSAFE_getByType('WebView').props.source.uri).toBe(`${url}/new-course?RefID=123`);
});
