import type { Meta, StoryObj } from '@storybook/react';
import StateModa from '../../src/Components/StateModa';

const meta = {
  title: 'Components/StateModa',
  component: StateModa,
} satisfies Meta<typeof StateModa>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
