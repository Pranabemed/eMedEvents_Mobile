import type { Meta, StoryObj } from '@storybook/react';
import Sliders from '../../src/Components/SliderRef';

const meta = {
  title: 'Components/SliderRef',
  component: Sliders,
} satisfies Meta<typeof Sliders>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
