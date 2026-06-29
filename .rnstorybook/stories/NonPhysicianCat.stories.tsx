import type { Meta, StoryObj } from '@storybook/react';
import NonPhysicianCat from '../../src/Components/NonPhysicianCat';

const meta = {
  title: 'Components/NonPhysicianCat',
  component: NonPhysicianCat,
} satisfies Meta<typeof NonPhysicianCat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
