import type { Meta, StoryObj } from '@storybook/react';
import CMECard from '../../src/Components/CMECard';

const meta = {
  title: 'Components/CMECard',
  component: CMECard,
} satisfies Meta<typeof CMECard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
