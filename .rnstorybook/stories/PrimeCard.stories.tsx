import type { Meta, StoryObj } from '@storybook/react';
import PrimeCard from '../../src/Components/PrimeCard';

const meta = {
  title: 'Components/PrimeCard',
  component: PrimeCard,
} satisfies Meta<typeof PrimeCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
