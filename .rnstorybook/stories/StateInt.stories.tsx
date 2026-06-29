import type { Meta, StoryObj } from '@storybook/react';
import StateIntData from '../../src/Components/StateInt';

const meta = {
  title: 'Components/StateInt',
  component: StateIntData,
} satisfies Meta<typeof StateIntData>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
