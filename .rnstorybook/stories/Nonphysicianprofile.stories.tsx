import type { Meta, StoryObj } from '@storybook/react';
import Nonphysicianprofile from '../../src/Components/Nonphysicianprofile';

const meta = {
  title: 'Components/Nonphysicianprofile',
  component: Nonphysicianprofile,
} satisfies Meta<typeof Nonphysicianprofile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
