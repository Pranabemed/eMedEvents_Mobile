import type { Meta, StoryObj } from '@storybook/react';
import GradientButton from '../../src/Components/LinearButton';

const meta = {
  title: 'Components/LinearButton',
  component: GradientButton,
} satisfies Meta<typeof GradientButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
