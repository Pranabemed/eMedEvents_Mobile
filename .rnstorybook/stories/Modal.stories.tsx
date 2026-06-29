import type { Meta, StoryObj } from '@storybook/react';
import CustomModal from '../../src/Components/Modal';

const meta = {
  title: 'Components/Modal',
  component: CustomModal,
} satisfies Meta<typeof CustomModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
