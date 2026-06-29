import type { Meta, StoryObj } from '@storybook/react';
import CartItemShimmer from '../../src/Components/AddToCartShimmer';

const meta = {
  title: 'Components/AddToCartShimmer',
  component: CartItemShimmer,
} satisfies Meta<typeof CartItemShimmer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
