import type { Meta, StoryObj } from '@storybook/react';
import CustomRadioButtons from '../../src/Components/CustomRadioSc';

const meta = {
  title: 'Components/CustomRadioSc',
  component: CustomRadioButtons,
} satisfies Meta<typeof CustomRadioButtons>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
