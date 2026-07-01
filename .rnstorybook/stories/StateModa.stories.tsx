/**
 * State moda.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import StateModa from '../../src/Components/StateModa';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/StateModa',
  component: StateModa,
} satisfies Meta<typeof StateModa>;

/**
 * State moda.stories default export.
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
