import type { Meta, StoryObj } from '@storybook/react';
import normalizeVideoSource from '../../src/Components/Video';

const meta = {
  title: 'Components/Video',
  component: normalizeVideoSource,
} satisfies Meta<typeof normalizeVideoSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
