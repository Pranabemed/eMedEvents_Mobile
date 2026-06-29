import type { Meta, StoryObj } from '@storybook/react';
import HomeShimmer from '../../src/Components/DashBoardShimmer';

const meta = {
  title: 'Components/DashBoardShimmer',
  component: HomeShimmer,
} satisfies Meta<typeof HomeShimmer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
