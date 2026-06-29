import type { Meta, StoryObj } from '@storybook/react';
import Cmemodal from '../../src/Components/Cmemodal';

const meta = {
  title: 'Components/Cmemodal',
  component: Cmemodal,
} satisfies Meta<typeof Cmemodal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
