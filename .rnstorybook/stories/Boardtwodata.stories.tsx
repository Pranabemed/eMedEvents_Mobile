import type { Meta, StoryObj } from '@storybook/react';
import Boardtwodata from '../../src/Components/Boardtwodata';

const meta = {
  title: 'Components/Boardtwodata',
  component: Boardtwodata,
} satisfies Meta<typeof Boardtwodata>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
