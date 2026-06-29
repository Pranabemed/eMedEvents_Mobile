import type { Meta, StoryObj } from '@storybook/react';
import ProfessionCourseShimmer from '../../src/Components/ProfessionCourseShimmer';

const meta = {
  title: 'Components/ProfessionCourseShimmer',
  component: ProfessionCourseShimmer,
} satisfies Meta<typeof ProfessionCourseShimmer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
