import type { Meta, StoryObj } from '@storybook/react';
import PayModalFd from '../../src/Components/PayModalFd';

const meta = {
  title: 'Components/PayModalFd',
  component: PayModalFd,
} satisfies Meta<typeof PayModalFd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
