import type { Meta, StoryObj } from '@storybook/react';
import AddressField from '../../src/Components/AutoData';

const meta = {
  title: 'Components/AutoData',
  component: AddressField,
} satisfies Meta<typeof AddressField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
