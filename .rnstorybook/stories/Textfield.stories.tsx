import type { Meta, StoryObj } from '@storybook/react';
import onChangeText from '../../src/Components/Textfield';

const meta = {
  title: 'Components/Textfield',
  component: onChangeText,
} satisfies Meta<typeof onChangeText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
