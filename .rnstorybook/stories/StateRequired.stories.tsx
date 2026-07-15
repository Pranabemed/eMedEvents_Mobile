/**
 * State required.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import StateRequireditem from '../../src/Components/StateRequired';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/StateRequired',
  component: StateRequireditem,
} satisfies Meta<typeof StateRequireditem>;

/**
 * State required.stories default export.
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
