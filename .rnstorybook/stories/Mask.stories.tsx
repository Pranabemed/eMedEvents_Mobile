import type { Meta, StoryObj } from '@storybook/react';
import MaskField from '../../src/Components/Mask';

const meta = {
  title: 'Components/Mask',
  component: MaskField,
} satisfies Meta<typeof MaskField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
