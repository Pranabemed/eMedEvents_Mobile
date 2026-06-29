import type { Meta, StoryObj } from '@storybook/react';
import PrimeSuccess from '../../src/Components/PrimeSuccess';

const meta = {
  title: 'Components/PrimeSuccess',
  component: PrimeSuccess,
} satisfies Meta<typeof PrimeSuccess>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
