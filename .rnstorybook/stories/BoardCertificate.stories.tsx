import type { Meta, StoryObj } from '@storybook/react';
import BoardCertificate from '../../src/Components/BoardCertificate';

const meta = {
  title: 'Components/BoardCertificate',
  component: BoardCertificate,
} satisfies Meta<typeof BoardCertificate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
