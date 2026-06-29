import type { Meta, StoryObj } from '@storybook/react';
import Specialized from '../../src/Components/Specialized';

const meta = {
  title: 'Components/Specialized',
  component: Specialized,
} satisfies Meta<typeof Specialized>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
