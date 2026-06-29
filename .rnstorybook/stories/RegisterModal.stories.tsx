import type { Meta, StoryObj } from '@storybook/react';
import RegisterModal from '../../src/Components/RegisterModal';

const meta = {
  title: 'Components/RegisterModal',
  component: RegisterModal,
} satisfies Meta<typeof RegisterModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
