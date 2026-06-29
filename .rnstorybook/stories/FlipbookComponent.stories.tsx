import type { Meta, StoryObj } from '@storybook/react';
import FlipbookComponent from '../../src/Components/FlipbookComponent';

const meta = {
  title: 'Components/FlipbookComponent',
  component: FlipbookComponent,
} satisfies Meta<typeof FlipbookComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
