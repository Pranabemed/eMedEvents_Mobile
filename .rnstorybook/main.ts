/**
 * Main Storybook module. Defines stories and controls for component previews. Exported members: main.
 */

import type { StorybookConfig } from '@storybook/react-native';

/**
 * Main object.
 * @returns {Object}
 */
const main: StorybookConfig = {
  stories: ['./stories/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

/**
 * Main default export.
 *
 * @returns {*}
 */
export default main;
