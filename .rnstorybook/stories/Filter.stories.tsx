import type { Meta, StoryObj } from '@storybook/react';
import FilterModal from '../../src/Components/Filter';

const meta = {
  title: 'Components/Filter',
  component: FilterModal,
} satisfies Meta<typeof FilterModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
