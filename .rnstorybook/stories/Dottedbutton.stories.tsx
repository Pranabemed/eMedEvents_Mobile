import type { Meta, StoryObj } from '@storybook/react';
import DottedButton from '../../src/Components/Dottedbutton';

const meta = {
  title: 'Components/Dottedbutton',
  component: DottedButton,
} satisfies Meta<typeof DottedButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
