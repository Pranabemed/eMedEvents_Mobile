import type { Meta, StoryObj } from '@storybook/react';
import CartFd from '../../src/Components/CartFd';

const meta = {
  title: 'Components/CartFd',
  component: CartFd,
} satisfies Meta<typeof CartFd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
