import type { Meta, StoryObj } from '@storybook/react';
import RestProfession from '../../src/Components/RestProfession';

const meta = {
  title: 'Components/RestProfession',
  component: RestProfession,
} satisfies Meta<typeof RestProfession>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
