import type { Meta, StoryObj } from '@storybook/react';
import PDFViewer from '../../src/Components/Download';

const meta = {
  title: 'Components/Download',
  component: PDFViewer,
} satisfies Meta<typeof PDFViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
