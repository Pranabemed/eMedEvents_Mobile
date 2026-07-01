/**
 * Camera picker.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CameraPicker from '../../src/Components/CameraPicker';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CameraPicker',
  component: CameraPicker,
} satisfies Meta<typeof CameraPicker>;

/**
 * Camera picker.stories default export.
 *
 * @returns {*}
 */
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default object.
 * @returns {Object}
 */
export const Default: Story = {
  args: {
    // Add default props here
  },
};
