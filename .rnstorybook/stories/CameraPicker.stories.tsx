import type { Meta, StoryObj } from '@storybook/react';
import CameraPicker from '../../src/Components/CameraPicker';

const meta = {
  title: 'Components/CameraPicker',
  component: CameraPicker,
} satisfies Meta<typeof CameraPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
