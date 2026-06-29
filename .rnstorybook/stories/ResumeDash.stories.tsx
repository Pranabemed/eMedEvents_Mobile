import type { Meta, StoryObj } from '@storybook/react';
import ResumeDash from '../../src/Components/ResumeDash';

const meta = {
  title: 'Components/ResumeDash',
  component: ResumeDash,
} satisfies Meta<typeof ResumeDash>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
