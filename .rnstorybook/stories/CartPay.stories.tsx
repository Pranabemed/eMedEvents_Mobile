import type { Meta, StoryObj } from '@storybook/react';
import CartPay from '../../src/Components/CartPay';

const meta = {
  title: 'Components/CartPay',
  component: CartPay,
} satisfies Meta<typeof CartPay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
