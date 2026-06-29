import type { Meta, StoryObj } from '@storybook/react';
import toggleSecureEntry from '../../src/Components/CellInput';

const meta = {
  title: 'Components/CellInput',
  component: toggleSecureEntry,
} satisfies Meta<typeof toggleSecureEntry>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
