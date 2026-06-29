import type { Meta, StoryObj } from '@storybook/react';
import CustomInputWithDropdown from '../../src/Components/CustomTextInput';

const meta = {
  title: 'Components/CustomTextInput',
  component: CustomInputWithDropdown,
} satisfies Meta<typeof CustomInputWithDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
