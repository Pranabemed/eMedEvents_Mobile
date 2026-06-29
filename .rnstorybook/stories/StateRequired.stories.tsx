import type { Meta, StoryObj } from '@storybook/react';
import StateRequireditem from '../../src/Components/StateRequired';

const meta = {
  title: 'Components/StateRequired',
  component: StateRequireditem,
} satisfies Meta<typeof StateRequireditem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
