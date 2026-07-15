/**
 * State license.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import StateLicense from '../../src/Components/StateLicense';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/StateLicense',
  component: StateLicense,
} satisfies Meta<typeof StateLicense>;

/**
 * State license.stories default export.
 *
 * @returns {*}
 */
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default object.
 * @returns {Object}
 */
/**
 * Default object.
 * @returns {Object}
 */
export const Default: Story = {
  args: {
    // Add default props here
  },
};
