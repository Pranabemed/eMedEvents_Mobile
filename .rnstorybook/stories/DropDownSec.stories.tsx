import type { Meta, StoryObj } from '@storybook/react';
import onChangeText from '../../src/Components/DropDownSec';

const meta = {
  title: 'Components/DropDownSec',
  component: onChangeText,
} satisfies Meta<typeof onChangeText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
