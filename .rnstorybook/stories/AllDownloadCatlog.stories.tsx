/**
 * All download catlog.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import AllDownloadCatalog from '../../src/Components/AllDownloadCatlog';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/AllDownloadCatlog',
  component: AllDownloadCatalog,
} satisfies Meta<typeof AllDownloadCatalog>;

/**
 * All download catlog.stories default export.
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
