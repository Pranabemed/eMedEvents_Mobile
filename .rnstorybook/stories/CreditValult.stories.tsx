import type { Meta, StoryObj } from '@storybook/react';
import CreditValult from '../../src/Components/CreditValult';

const meta = {
  title: 'Components/CreditValult',
  component: CreditValult,
} satisfies Meta<typeof CreditValult>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
