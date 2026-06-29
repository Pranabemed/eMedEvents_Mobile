import type { Meta, StoryObj } from '@storybook/react';
import CustomInput from '../../src/Components/NewTextIn';

const meta = {
  title: 'Components/NewTextIn',
  component: CustomInput,
} satisfies Meta<typeof CustomInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
