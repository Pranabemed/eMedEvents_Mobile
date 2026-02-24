import 'react-native';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from '../App';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({ navigate: jest.fn() }),
    useRoute: () => ({ params: {} }),
  };
});

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: jest.fn(() => ({
      Navigator: ({ children }) => children,
      Screen: ({ children }) => <>{children}</>,
    })),
  };
});

const mockStore = configureStore([]);
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
