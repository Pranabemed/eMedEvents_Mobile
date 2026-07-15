/**
 * Add to cart shimmer.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CartItemShimmer from '../../src/Components/AddToCartShimmer';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/AddToCartShimmer',
  component: CartItemShimmer,
} satisfies Meta<typeof CartItemShimmer>;

/**
 * Add to cart shimmer.stories default export.
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
