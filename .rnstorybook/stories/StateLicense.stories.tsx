import type { Meta, StoryObj } from '@storybook/react';
import StateLicense from '../../src/Components/StateLicense';

const meta = {
  title: 'Components/StateLicense',
  component: StateLicense,
} satisfies Meta<typeof StateLicense>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
