/**
 * Jest.setup module. Contains application logic, configuration, or shared helpers. Exported members: MapView.
 */

import 'react-native-gesture-handler/jestSetup';

// Silence the warning: Animated: `useNativeDriver` is not supported (removed as no longer valid for this RN version)
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
                /**
 * Custom hook that manages navigation.
 * @returns {Object}
 */
useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
            reset: jest.fn(),
            replace: jest.fn(),
        }),
                /**
 * Custom hook that manages route.
 * @returns {Object}
 */
useRoute: () => ({
            params: {},
        }),
                /**
 * Custom hook that manages is focused.
 * @returns {boolean}
 */
useIsFocused: () => true,
                /**
 * Navigation container component.
 * @param {Object} props - Input object.
 * @param {*} props.children - Nested property value.
 * @returns {JSX.Element}
 */
NavigationContainer: ({ children }) => children,
    };
});

// Mock Vector Icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');
jest.mock('react-native-vector-icons/Entypo', () => 'Icon');

// Mock Firebase
jest.mock('@react-native-firebase/app', () => {
    return () => ({
        onConnect: jest.fn(),
        onMessage: jest.fn(),
    });
});

jest.mock('@react-native-firebase/messaging', () => {
    return () => ({
        AuthorizationStatus: {
            AUTHORIZED: 1,
            PROVISIONAL: 2,
        },
        hasPermission: jest.fn(() => Promise.resolve(true)),
        registerDeviceForRemoteMessages: jest.fn(() => Promise.resolve()),
        subscribeToTopic: jest.fn(),
        unsubscribeFromTopic: jest.fn(),
        requestPermission: jest.fn(() => Promise.resolve(true)),
        getToken: jest.fn(() => Promise.resolve('myMockToken')),
        onMessage: jest.fn(),
        onNotificationOpenedApp: jest.fn(),
        getInitialNotification: jest.fn(() => Promise.resolve(false)),
        setBackgroundMessageHandler: jest.fn(),
    });
});

jest.mock('@notifee/react-native', () => require('@notifee/react-native/jest-mock'));

jest.mock('@react-native-firebase/analytics', () => () => ({
    logEvent: jest.fn(),
    logScreenView: jest.fn(),
    setCurrentScreen: jest.fn(),
}));

// Setup Redux Mocks removed so we can use <Provider> over real components

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => require('@react-native-community/netinfo/jest/netinfo-mock.js'));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
    return {
        default: {
                        /**
 * Call utility.
 * @returns {void}
 */
call: () => { },
            createAnimatedComponent: jest.fn((comp) => comp),
        },
        createAnimatedComponent: jest.fn((comp) => comp),
        useSharedValue: jest.fn(() => ({ value: 0 })),
        useAnimatedStyle: jest.fn(() => ({})),
        withTiming: jest.fn(),
        withSpring: jest.fn(),
        withRepeat: jest.fn(),
        withSequence: jest.fn(),
        useAnimatedGestureHandler: jest.fn(),
        useAnimatedRef: jest.fn(),
        useAnimatedScrollHandler: jest.fn(),
        useDerivedValue: jest.fn(),
        Extrapolate: { CLAMP: 'clamp' },
        interpolate: jest.fn(),
        interpolateColor: jest.fn(),
        runOnJS: jest.fn(() => jest.fn()),
        runOnUI: jest.fn(() => jest.fn()),
        View: 'View',
        Text: 'Text',
        Image: 'Image',
        ScrollView: 'ScrollView',
    };
});

// Mock deep internal reanimated path required by a specific component
jest.mock('react-native-reanimated/lib/typescript/animation/springUtils', () => ({
    checkIfConfigIsValid: jest.fn(),
}), { virtual: true });

// Mock react-native-simple-toast
jest.mock('react-native-simple-toast', () => ({
    default: {
        show: jest.fn(),
        showWithGravity: jest.fn(),
    }
}));

// Mock react-native-share
jest.mock('react-native-share', () => ({
    default: jest.fn()
}));

// Mock react-native-fs
jest.mock('react-native-fs', () => {
    return {
        mkdir: jest.fn(),
        moveFile: jest.fn(),
        copyFile: jest.fn(),
        pathForBundle: jest.fn(),
        pathForGroup: jest.fn(),
        getFSInfo: jest.fn(),
        getAllExternalFilesDirs: jest.fn(),
        randomFile: jest.fn(),
        readDir: jest.fn(),
        readDirAssets: jest.fn(),
        exists: jest.fn(),
        existsAssets: jest.fn(),
        hash: jest.fn(),
        copyFileAssets: jest.fn(),
        copyFileAssetsIOS: jest.fn(),
        copyAssetsVideoIOS: jest.fn(),
        stat: jest.fn(),
        readFile: jest.fn(),
        read: jest.fn(),
        readFileAssets: jest.fn(),
        hashAssetFiles: jest.fn(),
        copyFileRes: jest.fn(),
        copyFileIOS: jest.fn(),
        copyAssetsFileIOS: jest.fn(),
        copyAssetsVideoFileIOS: jest.fn(),
        writeFile: jest.fn(),
        appendFile: jest.fn(),
        write: jest.fn(),
        downloadFile: jest.fn(),
        uploadFiles: jest.fn(),
        touch: jest.fn(),
        MainBundlePath: jest.fn(),
        CachesDirectoryPath: jest.fn(),
        DocumentDirectoryPath: jest.fn(),
        ExternalDirectoryPath: jest.fn(),
        ExternalStorageDirectoryPath: jest.fn(),
        TemporaryDirectoryPath: jest.fn(),
        LibraryDirectoryPath: jest.fn(),
        PicturesDirectoryPath: jest.fn(),
    };
});

// Mock react-native-snackbar
jest.mock('react-native-snackbar', () => ({
    LENGTH_LONG: 0,
    LENGTH_SHORT: -1,
    LENGTH_INDEFINITE: -2,
    show: jest.fn(),
    dismiss: jest.fn(),
}));

// Mock react-native-file-viewer
jest.mock('react-native-file-viewer', () => {
    return {
        open: jest.fn()
    };
});

// Mock react-native-maps
jest.mock('react-native-maps', () => {
    const React = require('react');
        /**
 * Map view component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const MapView = (props) => React.createElement('MapView', props, props.children);
    MapView.Marker = (props) => React.createElement('Marker', props, props.children);
    MapView.Callout = (props) => React.createElement('Callout', props, props.children);
    MapView.Polyline = (props) => React.createElement('Polyline', props, props.children);
    return {
        __esModule: true,
        default: MapView,
        PROVIDER_DEFAULT: 'PROVIDER_DEFAULT',
        PROVIDER_GOOGLE: 'PROVIDER_GOOGLE',
    };
});

// Mock react-native-document-picker
jest.mock('react-native-document-picker', () => ({
    default: {
        pick: jest.fn(),
        pickMultiple: jest.fn(),
    },
    types: {}
}));

// Mock react-native-image-crop-picker
jest.mock('react-native-image-crop-picker', () => ({
    openPicker: jest.fn(),
    openCamera: jest.fn(),
    clean: jest.fn(),
}));

// Mock SpeechRecognition NativeModule
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    RN.NativeModules.SpeechRecognition = {
        startListening: jest.fn(),
        stopListening: jest.fn(),
        destroy: jest.fn(),
        addListener: jest.fn(),
        removeListeners: jest.fn(),
    };
    return RN;
});

// Mock deep internal reanimated path for Colors
jest.mock('react-native-reanimated/lib/typescript/Colors', () => ({
    normalizeColor: jest.fn(),
}), { virtual: true });

// Mock react-native-orientation-locker
jest.mock('react-native-orientation-locker', () => {
    return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        lockToPortrait: jest.fn(),
        lockToLandscape: jest.fn(),
        unlockAllOrientations: jest.fn(),
    };
});

// Mock react-native-blob-util
jest.mock('react-native-blob-util', () => {
    return {
        DocumentDir: jest.fn(),
        ImageCache: {
            get: {
                clear: jest.fn(),
            },
        },
        fs: {
            exists: jest.fn(),
            dirs: {
                MainBundleDir: jest.fn(),
                CacheDir: jest.fn(),
                DocumentDir: jest.fn(),
            },
        },
    };
});

// Mock react-native-pdf
jest.mock('react-native-pdf', () => {
    const React = require('react');
    return {
        __esModule: true,
                /**
 * Default helper.
 * @param {*} props - Input value.
 * @returns {*}
 */
default: (props) => React.createElement('Pdf', props, props.children),
    };
});

// Mock react-native-device-info (both direct and transitive deps like react-native-siren)
jest.mock('react-native-device-info', () => require('react-native-device-info/jest/react-native-device-info-mock'), { virtual: true });
// Since react-native-siren has its own nested device-info, we need to mock it globally globally via module mapper, 
// but for Jest setup we can also mock sp-react-native-in-app-updates directly.
jest.mock('sp-react-native-in-app-updates', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => {
            return {
                checkNeedsUpdate: jest.fn(() => Promise.resolve({ shouldUpdate: false })),
                startUpdate: jest.fn(() => Promise.resolve()),
                installUpdate: jest.fn(() => Promise.resolve()),
                addStatusUpdateListener: jest.fn(),
                removeStatusUpdateListener: jest.fn(),
            };
        }),
        IAUUpdateKind: {
            FLEXIBLE: 0,
            IMMEDIATE: 1,
        },
        IAUInstallStatus: {
            DOWNLOADING: 2,
            DOWNLOADED: 11,
            INSTALLED: 3,
            INSTALLING: 4,
            FAILED: 5,
        }
    }
});

// Mock react-native-geolocation-service
jest.mock('react-native-geolocation-service', () => {
    return {
        getCurrentPosition: jest.fn(),
        watchPosition: jest.fn(),
        clearWatch: jest.fn(),
        stopObserving: jest.fn(),
        requestAuthorization: jest.fn(),
    };
});

// Mock IPServer globally to avoid test memory leaks from unresolved `fetch` requests tracing Public IPs
jest.mock('./src/Utils/Helpers/IPServer', () => ({
    initPublicIP: jest.fn(() => Promise.resolve()),
    getPublicIP: jest.fn(() => '1.2.3.4'),
}));
