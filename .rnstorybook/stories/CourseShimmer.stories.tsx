import type { Meta, StoryObj } from '@storybook/react';
import CourseShimmer from '../../src/Components/CourseShimmer';

const meta = {
  title: 'Components/CourseShimmer',
  component: CourseShimmer,
} satisfies Meta<typeof CourseShimmer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
