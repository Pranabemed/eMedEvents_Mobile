/**
 * @format
 */

import React from 'react';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Store from './src/Redux/Store';
import 'react-native-get-random-values';
import { Provider as StoreProvider } from 'react-redux';
LogBox.ignoreAllLogs();

const EmedEvents = () => {
    return (
        <StoreProvider store={Store}>
                <App />
        </StoreProvider>
    )
}

AppRegistry.registerComponent(appName, () => EmedEvents);
