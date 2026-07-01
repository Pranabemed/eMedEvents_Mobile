/**
 * Index Storybook module. Defines stories and controls for component previews. Exported members: StorybookUIRoot.
 */

import { AppRegistry } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LiteUI } from '@storybook/react-native-ui-lite';

import { view } from './storybook.requires';
import { name as appName } from '../app.json';

/**
 * This file is user-editable.
 *
 * Use it as your React Native Storybook entrypoint and wrap `StorybookUIRoot`
 * with application decorators/providers (theme, i18n, state, navigation, etc).
 */
const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  CustomUIComponent: LiteUI,
});

AppRegistry.registerComponent(appName, () => StorybookUIRoot);

/**
 * Index default export.
 *
 * @returns {*}
 */
export default StorybookUIRoot;
