/**
 * Cart fd.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CartFd from '../../src/Components/CartFd';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CartFd',
  component: CartFd,
} satisfies Meta<typeof CartFd>;

/**
 * Cart fd.stories default export.
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
