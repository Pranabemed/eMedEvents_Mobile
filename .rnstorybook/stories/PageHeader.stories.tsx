import type { Meta, StoryObj } from '@storybook/react';
import PageHeader from '../../src/Components/PageHeader';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
