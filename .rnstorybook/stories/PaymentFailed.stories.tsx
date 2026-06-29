import type { Meta, StoryObj } from '@storybook/react';
import CellModalPayemntFailed from '../../src/Components/PaymentFailed';

const meta = {
  title: 'Components/PaymentFailed',
  component: CellModalPayemntFailed,
} satisfies Meta<typeof CellModalPayemntFailed>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
