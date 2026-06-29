import type { Meta, StoryObj } from '@storybook/react';
import Dashboardmain from '../../src/Components/Dashboardmain';

const meta = {
  title: 'Components/Dashboardmain',
  component: Dashboardmain,
} satisfies Meta<typeof Dashboardmain>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
