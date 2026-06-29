import type { Meta, StoryObj } from '@storybook/react';
import DownloadCertificate from '../../src/Components/FinalCertificate';

const meta = {
  title: 'Components/FinalCertificate',
  component: DownloadCertificate,
} satisfies Meta<typeof DownloadCertificate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
