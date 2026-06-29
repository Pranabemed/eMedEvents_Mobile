import type { Meta, StoryObj } from '@storybook/react';
import onChangeText from '../../src/Components/DropdownInput';

const meta = {
  title: 'Components/DropdownInput',
  component: onChangeText,
} satisfies Meta<typeof onChangeText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
