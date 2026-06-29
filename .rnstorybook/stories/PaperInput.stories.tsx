import type { Meta, StoryObj } from '@storybook/react';
import CustomInputs from '../../src/Components/PaperInput';

const meta = {
  title: 'Components/PaperInput',
  component: CustomInputs,
} satisfies Meta<typeof CustomInputs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
