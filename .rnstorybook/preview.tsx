/**
 * Preview Storybook module. Defines stories and controls for component previews. Exported members: preview.
 */

import type { Preview } from '@storybook/react-native';

/**
 * Preview object.
 * @returns {Object}
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

/**
 * Preview default export.
 *
 * @returns {*}
 */
export default preview;
