import type { Meta, StoryObj } from '@storybook/react';
import CircularProgress from '../../src/Components/ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: CircularProgress,
} satisfies Meta<typeof CircularProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
