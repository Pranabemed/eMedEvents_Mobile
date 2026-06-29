import type { Meta, StoryObj } from '@storybook/react';
import TaskCardItem from '../../src/Components/Taskcarditem';

const meta = {
  title: 'Components/Taskcarditem',
  component: TaskCardItem,
} satisfies Meta<typeof TaskCardItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
