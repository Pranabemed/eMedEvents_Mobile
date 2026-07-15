/**
 * Final certificate.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import DownloadCertificate from '../../src/Components/FinalCertificate';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/FinalCertificate',
  component: DownloadCertificate,
} satisfies Meta<typeof DownloadCertificate>;

/**
 * Final certificate.stories default export.
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
