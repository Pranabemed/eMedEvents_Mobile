import type { Meta, StoryObj } from '@storybook/react';
import PayModal from '../../src/Components/PayModal';

const meta = {
  title: 'Components/PayModal',
  component: PayModal,
} satisfies Meta<typeof PayModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
