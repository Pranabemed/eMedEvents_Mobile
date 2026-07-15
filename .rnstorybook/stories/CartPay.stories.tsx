/**
 * Cart pay.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CartPay from '../../src/Components/CartPay';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CartPay',
  component: CartPay,
} satisfies Meta<typeof CartPay>;

/**
 * Cart pay.stories default export.
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
