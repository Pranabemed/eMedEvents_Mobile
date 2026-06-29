import type { Meta, StoryObj } from '@storybook/react';
import Boardonedata from '../../src/Components/Boardonedata';

const meta = {
  title: 'Components/Boardonedata',
  component: Boardonedata,
} satisfies Meta<typeof Boardonedata>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
