import type { Meta, StoryObj } from '@storybook/react';
import Carouselcarditem from '../../src/Components/Carouselcarditem';

const meta = {
  title: 'Components/Carouselcarditem',
  component: Carouselcarditem,
} satisfies Meta<typeof Carouselcarditem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
