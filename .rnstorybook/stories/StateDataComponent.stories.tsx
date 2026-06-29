import type { Meta, StoryObj } from '@storybook/react';
import StateDataComponent from '../../src/Components/StateDataComponent';

const meta = {
  title: 'Components/StateDataComponent',
  component: StateDataComponent,
} satisfies Meta<typeof StateDataComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
