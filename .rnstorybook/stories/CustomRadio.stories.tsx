import type { Meta, StoryObj } from '@storybook/react';
import CustomPaymentradio from '../../src/Components/CustomRadio';

const meta = {
  title: 'Components/CustomRadio',
  component: CustomPaymentradio,
} satisfies Meta<typeof CustomPaymentradio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
