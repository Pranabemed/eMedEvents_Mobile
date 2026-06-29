import type { Meta, StoryObj } from '@storybook/react';
import CellModal from '../../src/Components/CellModal';

const meta = {
  title: 'Components/CellModal',
  component: CellModal,
} satisfies Meta<typeof CellModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
