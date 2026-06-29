import type { Meta, StoryObj } from '@storybook/react';
import CustomInputTouchable from '../../src/Components/IconTextIn';

const meta = {
  title: 'Components/IconTextIn',
  component: CustomInputTouchable,
} satisfies Meta<typeof CustomInputTouchable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
