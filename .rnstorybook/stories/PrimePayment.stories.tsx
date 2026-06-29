import type { Meta, StoryObj } from '@storybook/react';
import PrimePayment from '../../src/Components/PrimePayment';

const meta = {
  title: 'Components/PrimePayment',
  component: PrimePayment,
} satisfies Meta<typeof PrimePayment>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
