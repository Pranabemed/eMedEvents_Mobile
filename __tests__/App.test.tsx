/**
 * App.test test module. Verifies the behavior of the associated screen, component, or helper. Exported members: mockStore, store.
 */

import 'react-native';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from '../App';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
        /**
 * Navigation container component.
 * @param {Object} props - Input object.
 * @param {*} props.children - Nested property value.
 * @returns {JSX.Element}
 */
NavigationContainer: ({ children }) => children,
        /**
 * Custom hook that manages navigation.
 * @returns {Object}
 */
useNavigation: () => ({ navigate: jest.fn() }),
        /**
 * Custom hook that manages route.
 * @returns {Object}
 */
useRoute: () => ({ params: {} }),
  };
});

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: jest.fn(() => ({
            /**
 * Navigator component.
 * @param {Object} props - Input object.
 * @param {*} props.children - Nested property value.
 * @returns {JSX.Element}
 */
Navigator: ({ children }) => children,
            /**
 * Screen component.
 * @param {Object} props - Input object.
 * @param {*} props.children - Nested property value.
 * @returns {JSX.Element}
 */
Screen: ({ children }) => <>{children}</>,
    })),
  };
});

/**
 * Mock store value.
 * @returns {*}
 */
const mockStore = configureStore([]);
/**
 * Store value.
 * @returns {*}
 */
const store = mockStore({
  AuthReducer: { status: 'idle', loginResponse: {}, loginsiginResponse: {} },
  DashboardReducer: { status: 'idle', dashboardResponse: {} }
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });
});
