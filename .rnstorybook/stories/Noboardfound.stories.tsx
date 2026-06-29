import type { Meta, StoryObj } from '@storybook/react';
import Noboardfound from '../../src/Components/Noboardfound';

const meta = {
  title: 'Components/Noboardfound',
  component: Noboardfound,
} satisfies Meta<typeof Noboardfound>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
