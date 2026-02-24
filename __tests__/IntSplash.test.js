import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashInt from '../src/Screen/SplashScreen/IntSplash';
import { AppContext } from '../src/Screen/GlobalSupport/AppContext';

// We need to mock timers because of the setTimeout in the component
jest.useFakeTimers();

describe('SplashInt Component', () => {
    const mockSetFulldashbaord = jest.fn();
    const mockSetGtprof = jest.fn();
    const mockSetAddit = jest.fn();

    const mockNavigation = {
        navigate: jest.fn(),
        setOptions: jest.fn(),
    };

    const MockAppContextProvider = ({ children }) => (
        <AppContext.Provider
            value={{
                setFulldashbaord: mockSetFulldashbaord,
                setGtprof: mockSetGtprof,
                setAddit: mockSetAddit,
            }}
        >
            {children}
        </AppContext.Provider>
    );

    beforeEach(() => {
        // Clear mocks before each test
        jest.clearAllMocks();
        AsyncStorage.getItem.mockClear();
    });

    it('renders correctly and sets navigation options', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null).mockResolvedValueOnce(null); // No data

        const { getByTestId, toJSON } = render(
            <MockAppContextProvider>
                <SplashInt navigation={mockNavigation} />
            </MockAppContextProvider>
        );

        // Verify setOptions was called to disable gestures
        expect(mockNavigation.setOptions).toHaveBeenCalledWith({ gestureEnabled: false });

        // Snapshot testing (Optional but good to have)
        expect(toJSON()).toMatchSnapshot();
    });

    it('navigates to Onboard when no user data is in AsyncStorage', async () => {
        // Mock AsyncStorage returning null for both variables
        AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));

        render(
            <MockAppContextProvider>
                <SplashInt navigation={mockNavigation} />
            </MockAppContextProvider>
        );

        // We need to wait for the microtasks (AsyncStorage promises) to resolve
        // so that the component can successfully schedule the setTimeout.
        await waitFor(() => {
            jest.runAllTimers();
            expect(mockNavigation.navigate).toHaveBeenCalledWith('Onboard');
        });
    });

    it('navigates to TabNav and sets dashboard data when WHOLEDATA exists', async () => {
        const fakeDashData = { id: 1, name: 'Test Dashboard' };

        // Mock AsyncStorage returning fake stringified data
        AsyncStorage.getItem.mockImplementation((key) => {
            if (key === 'WHOLEDATA') return Promise.resolve(JSON.stringify(fakeDashData));
            return Promise.resolve(null);
        });

        render(
            <MockAppContextProvider>
                <SplashInt navigation={mockNavigation} />
            </MockAppContextProvider>
        );

        await waitFor(() => {
            jest.runAllTimers();
            // Check Context actions were executed
            expect(mockSetAddit).toHaveBeenCalledWith(JSON.stringify(fakeDashData));
            expect(mockSetFulldashbaord).toHaveBeenCalledWith([fakeDashData]);
            expect(mockSetGtprof).toHaveBeenCalledWith(true);

            // Check navigation
            expect(mockNavigation.navigate).toHaveBeenCalledWith('TabNav');
        });
    });
});
