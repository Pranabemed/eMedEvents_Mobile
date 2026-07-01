/**
 * State int.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import StateIntData from '../../src/Components/StateInt';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/StateInt',
  component: StateIntData,
} satisfies Meta<typeof StateIntData>;

/**
 * State int.stories default export.
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
