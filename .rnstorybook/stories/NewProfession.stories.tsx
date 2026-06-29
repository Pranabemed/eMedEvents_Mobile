import type { Meta, StoryObj } from '@storybook/react';
import NewProfession from '../../src/Components/NewProfession';

const meta = {
  title: 'Components/NewProfession',
  component: NewProfession,
} satisfies Meta<typeof NewProfession>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
