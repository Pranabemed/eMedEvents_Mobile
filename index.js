/**
 * @format
 */

import React from 'react';
import { AppRegistry, LogBox, View, Text, TextInput, Image } from 'react-native';
import 'react-native-get-random-values';
import { Provider as StoreProvider } from 'react-redux';
import { registerBackgroundPushHandler } from './src/Utils/Helpers/PushNotifications';

// Apply legacy prop-type shims before loading App so old libraries
// like react-native-snap-carousel can read `*.propTypes.style` safely.
import {
  ViewPropTypes as DeprecatedViewPropTypes,
  TextPropTypes as DeprecatedTextPropTypes,
  TextInputPropTypes as DeprecatedTextInputPropTypes,
  ImagePropTypes as DeprecatedImagePropTypes,
} from 'deprecated-react-native-prop-types';

if (!View.propTypes) View.propTypes = DeprecatedViewPropTypes;
if (!Text.propTypes) Text.propTypes = DeprecatedTextPropTypes;
if (!TextInput.propTypes) TextInput.propTypes = DeprecatedTextInputPropTypes;
if (!Image.propTypes) Image.propTypes = DeprecatedImagePropTypes;

if (!global.ViewPropTypes) global.ViewPropTypes = DeprecatedViewPropTypes;
if (!global.TextPropTypes) global.TextPropTypes = DeprecatedTextPropTypes;
if (!global.TextInputPropTypes) global.TextInputPropTypes = DeprecatedTextInputPropTypes;
if (!global.ImagePropTypes) global.ImagePropTypes = DeprecatedImagePropTypes;

/**
 * App value.
 * @returns {*}
 */
const App = require('./App').default;
const { name: appName } = require('./app.json');
/**
 * Store value.
 * @returns {*}
 */
const Store = require('./src/Redux/Store').default;

LogBox.ignoreAllLogs();
registerBackgroundPushHandler();

/**
 * Emed events component.
 * @returns {JSX.Element}
 */
const EmedEvents = () => {
    return (
        <StoreProvider store={Store}>
                <App />
        </StoreProvider>
    )
}

AppRegistry.registerComponent(appName, () => EmedEvents);
