import type { Meta, StoryObj } from '@storybook/react';
import CellModalPayemnt from '../../src/Components/PayemntModal';

const meta = {
  title: 'Components/PayemntModal',
  component: CellModalPayemnt,
} satisfies Meta<typeof CellModalPayemnt>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
