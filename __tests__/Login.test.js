/**
 * Login.test test module. Verifies the behavior of the associated screen, component, or helper. Exported members: mockStore, renderComponent.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from '../src/Screen/Auth/Login';
import { AppContext } from '../src/Screen/GlobalSupport/AppContext';
import * as netInfoHelper from '../src/Utils/Helpers/NetInfo';
import * as firebaseTokenHelper from '../src/Utils/Helpers/FirebaseToken';
import showErrorAlert from '../src/Utils/Helpers/Toast';

// No fake timers to prevent blocking waitFor

jest.mock('../src/Utils/Helpers/NetInfo', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.resolve())
}));
jest.mock('../src/Utils/Helpers/Toast', () => jest.fn());
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

/**
 * Mock store value.
 * @returns {*}
 */
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
        // No pending timers to flush manually

    });

        /**
 * Render component utility.
 * @param {Object} props - Input value.
 * @returns {*}
 */
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
    test('shows validation alert when entering valid email but missing password', async () => {
        const { getByText, UNSAFE_getAllByType } = renderComponent();
        await waitFor(() => expect(getByText('Hello Again!')).toBeTruthy());

        const textInputs = UNSAFE_getAllByType(require('react-native').TextInput);
        fireEvent.changeText(textInputs[0], 'test@example.com');

        await waitFor(() => expect(getByText("Sign In")).toBeTruthy());

        const signInButton = getByText("Sign In");

        // Clear mock before firing
        showErrorAlert.mockClear();
        fireEvent.press(signInButton);

        expect(showErrorAlert).toHaveBeenCalledWith("Please enter your password to continue");
    });

    test('dispatches loginRequest on valid email and password submit', async () => {
        const { getByText, UNSAFE_getAllByType } = renderComponent();
        await waitFor(() => expect(getByText('Hello Again!')).toBeTruthy());

        const textInputs = UNSAFE_getAllByType(require('react-native').TextInput);
        fireEvent.changeText(textInputs[0], 'test@example.com');

        await waitFor(() => expect(getByText("Sign In")).toBeTruthy());

        // Second input should be password
        const passwordInputs = UNSAFE_getAllByType(require('react-native').TextInput);
        fireEvent.changeText(passwordInputs[1], 'password123');

        const signInButton = getByText("Sign In");
        fireEvent.press(signInButton);

        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'Auth/loginRequest' })
            );
        });
    });

    test('dispatches loginsiginRequest on valid phone submit', async () => {
        const { getByText, UNSAFE_getAllByType } = renderComponent();
        await waitFor(() => expect(getByText('Hello Again!')).toBeTruthy());

        const textInputs = UNSAFE_getAllByType(require('react-native').TextInput);
        fireEvent.changeText(textInputs[0], '1234567890');

        await waitFor(() => expect(getByText("Proceed")).toBeTruthy());

        // Fire button press to trigger login via phone 
        // Note: proceed button only renders when isPasswordFieldVisibile is false.
        const proceedButton = getByText("Proceed");
        fireEvent.press(proceedButton);

        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'Auth/loginsiginRequest' })
            );
        });
    });

    test('initializes with route params if provided', async () => {
        const routeMock = { params: { email: 'preset@example.com' } };
        const { getByDisplayValue, getByText } = renderComponent({ route: routeMock });

        await waitFor(() => {
            expect(getByDisplayValue('preset@example.com')).toBeTruthy();
            expect(getByText("Sign In")).toBeTruthy(); // Proves isPasswordFieldVisible became true automatically
        });
    });
});
