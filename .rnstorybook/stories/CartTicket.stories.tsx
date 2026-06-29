import type { Meta, StoryObj } from '@storybook/react';
import PayModalCart from '../../src/Components/CartTicket';

const meta = {
  title: 'Components/CartTicket',
  component: PayModalCart,
} satisfies Meta<typeof PayModalCart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
