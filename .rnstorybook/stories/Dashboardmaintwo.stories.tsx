import type { Meta, StoryObj } from '@storybook/react';
import Dashboardmaintwo from '../../src/Components/Dashboardmaintwo';

const meta = {
  title: 'Components/Dashboardmaintwo',
  component: Dashboardmaintwo,
} satisfies Meta<typeof Dashboardmaintwo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
