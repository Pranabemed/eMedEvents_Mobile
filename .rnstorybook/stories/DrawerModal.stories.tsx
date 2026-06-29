import type { Meta, StoryObj } from '@storybook/react';
import DrawerModal from '../../src/Components/DrawerModal';

const meta = {
  title: 'Components/DrawerModal',
  component: DrawerModal,
} satisfies Meta<typeof DrawerModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
