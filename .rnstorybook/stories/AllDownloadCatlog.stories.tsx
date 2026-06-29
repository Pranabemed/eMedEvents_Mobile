import type { Meta, StoryObj } from '@storybook/react';
import AllDownloadCatalog from '../../src/Components/AllDownloadCatlog';

const meta = {
  title: 'Components/AllDownloadCatlog',
  component: AllDownloadCatalog,
} satisfies Meta<typeof AllDownloadCatalog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
