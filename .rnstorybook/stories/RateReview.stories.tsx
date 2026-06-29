import type { Meta, StoryObj } from '@storybook/react';
import RateReview from '../../src/Components/RateReview';

const meta = {
  title: 'Components/RateReview',
  component: RateReview,
} satisfies Meta<typeof RateReview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
