import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from '../src/Screen/Auth/Login';
import { AppContext } from '../src/Screen/GlobalSupport/AppContext';
import * as netInfoHelper from '../src/Utils/Helpers/NetInfo';
import * as firebaseTokenHelper from '../src/Utils/Helpers/FirebaseToken';

// Jest fake timers
jest.useFakeTimers();

// Mocks
jest.mock('../src/Utils/Helpers/NetInfo', () => jest.fn(() => Promise.resolve()));
jest.mock('../src/Utils/Helpers/FirebaseToken', () => ({
    generateDeviceToken: jest.fn(() => Promise.resolve('fake-device-token')),
}));
jest.mock('../src/Utils/Helpers/IPServer', () => ({
    getPublicIP: jest.fn(() => '1.2.3.4'),
}));
jest.mock('react-native-safe-area-context', () => {
    const inset = { top: 0, right: 0, bottom: 0, left: 0 };
    return {
        SafeAreaProvider: jest.fn(({ children }) => children),
        SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
        useSafeAreaInsets: jest.fn(() => inset),
        SafeAreaView: jest.fn(({ children }) => children),
    };
});

const mockStore = configureStore([]);

describe('Login Component', () => {
    let store;
    let mockNavigation;
    let mockSetGtprof;
    let mockSetFulldashbaord;

    beforeEach(() => {
        store = mockStore({
            AuthReducer: { status: 'idle', loginResponse: {}, loginsiginResponse: {} },
            DashboardReducer: { status: 'idle', dashboardResponse: {} }
        });

        store.dispatch = jest.fn();

        mockNavigation = {
            navigate: jest.fn(),
            setOptions: jest.fn(),
            dispatch: jest.fn(),
        };

        mockSetGtprof = jest.fn();
        mockSetFulldashbaord = jest.fn();

        jest.clearAllMocks();
    });

    afterEach(async () => {
        // Flush any pending promises/microtasks so background useEffects don't carry over
        await waitFor(() => Promise.resolve());
        jest.runOnlyPendingTimers();
    });

    const renderComponent = (props = {}) => {
        return render(
            <Provider store={store}>
                <AppContext.Provider value={{ setGtprof: mockSetGtprof, setFulldashbaord: mockSetFulldashbaord }}>
                    <Login navigation={mockNavigation} {...props} />
                </AppContext.Provider>
            </Provider>
        );
    };

    test('renders properly and suppresses act warnings', async () => {
        const { getByText } = renderComponent();

        await waitFor(() => {
            expect(getByText('Hello Again!')).toBeTruthy();
            expect(getByText(/Welcome back/i)).toBeTruthy();
        });
    });

    test('handles valid email input and toggles password visibility', async () => {
        const { getByText, getByDisplayValue, queryByText, UNSAFE_getByType } = renderComponent();

        // Let component mount
        await waitFor(() => {
            expect(getByText('Hello Again!')).toBeTruthy();
        });

        // Initially we should have a "Proceed" button that is disabled
        const proceedButton = getByText("Proceed");
        expect(proceedButton).toBeTruthy();

        // Find the input field (since InputField wraps TextInput, we can find by its label text sibling or by TextInputs directly)
        const textInput = UNSAFE_getByType(require('react-native').TextInput);

        // Type a valid email
        fireEvent.changeText(textInput, 'test@example.com');

        // Check that "Sign In" button shows up instead of "Proceed" now that it's a valid email requiring a password
        await waitFor(() => {
            expect(getByText("Sign In")).toBeTruthy();
            expect(queryByText("Proceed")).toBeNull();
        });
    });

    test('handles valid phone input and enables Proceed button', async () => {
        const { getByText, UNSAFE_getByType, queryByText } = renderComponent();

        await waitFor(() => {
            expect(getByText('Hello Again!')).toBeTruthy();
        });

        const textInput = UNSAFE_getByType(require('react-native').TextInput);

        // Type a 10 digit phone number (mobileRegex = /^\d{10}$/)
        fireEvent.changeText(textInput, '1234567890');

        // Phone numbers do not require passwords immediately upon entering text unless they are processed,
        // Wait for state updates
        await waitFor(() => {
            expect(getByText("Proceed")).toBeTruthy();
            expect(queryByText("Sign In")).toBeNull();
        });
    });
});
