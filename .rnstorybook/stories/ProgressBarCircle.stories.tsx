import type { Meta, StoryObj } from '@storybook/react';
import ProgressBarCircle from '../../src/Components/ProgressBarCircle';

const meta = {
  title: 'Components/ProgressBarCircle',
  component: ProgressBarCircle,
} satisfies Meta<typeof ProgressBarCircle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
