import type { Meta, StoryObj } from '@storybook/react';
import DashboardMainShimmer from '../../src/Components/DashboardMainShimmer';

const meta = {
  title: 'Components/DashboardMainShimmer',
  component: DashboardMainShimmer,
} satisfies Meta<typeof DashboardMainShimmer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
