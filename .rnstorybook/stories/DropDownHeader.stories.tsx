import type { Meta, StoryObj } from '@storybook/react';
import DropDownHeader from '../../src/Components/DropDownHeader';

const meta = {
  title: 'Components/DropDownHeader',
  component: DropDownHeader,
} satisfies Meta<typeof DropDownHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
