/**
 * Download.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import PDFViewer from '../../src/Components/Download';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Download',
  component: PDFViewer,
} satisfies Meta<typeof PDFViewer>;

/**
 * Download.stories default export.
 *
 * @returns {*}
 */
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default object.
 * @returns {Object}
 */
/**
 * Default object.
 * @returns {Object}
 */
export const Default: Story = {
  args: {
    // Add default props here
  },
};
