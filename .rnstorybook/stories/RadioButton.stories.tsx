import type { Meta, StoryObj } from '@storybook/react';
import CustomRadioButton from '../../src/Components/RadioButton';

const meta = {
  title: 'Components/RadioButton',
  component: CustomRadioButton,
} satisfies Meta<typeof CustomRadioButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
