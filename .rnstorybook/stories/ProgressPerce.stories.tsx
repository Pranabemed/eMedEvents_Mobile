import type { Meta, StoryObj } from '@storybook/react';
import ProgressBarLine from '../../src/Components/ProgressPerce';

const meta = {
  title: 'Components/ProgressPerce',
  component: ProgressBarLine,
} satisfies Meta<typeof ProgressBarLine>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
