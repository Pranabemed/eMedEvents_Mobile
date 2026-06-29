import type { Meta, StoryObj } from '@storybook/react';
import FlatListShimmer from '../../src/Components/FlatlistShimmer';

const meta = {
  title: 'Components/FlatlistShimmer',
  component: FlatListShimmer,
} satisfies Meta<typeof FlatListShimmer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
