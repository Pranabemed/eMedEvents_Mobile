import type { Meta, StoryObj } from '@storybook/react';
import StatewebcastShimmer from '../../src/Components/StatewebcastShimmer';

const meta = {
  title: 'Components/StatewebcastShimmer',
  component: StatewebcastShimmer,
} satisfies Meta<typeof StatewebcastShimmer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
