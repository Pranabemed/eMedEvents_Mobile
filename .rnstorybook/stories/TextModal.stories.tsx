import type { Meta, StoryObj } from '@storybook/react';
import TextModal from '../../src/Components/TextModal';

const meta = {
  title: 'Components/TextModal',
  component: TextModal,
} satisfies Meta<typeof TextModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
