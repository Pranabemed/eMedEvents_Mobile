import type { Meta, StoryObj } from '@storybook/react';
import BoardCarousel from '../../src/Components/BoardCarousel';

const meta = {
  title: 'Components/BoardCarousel',
  component: BoardCarousel,
} satisfies Meta<typeof BoardCarousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
