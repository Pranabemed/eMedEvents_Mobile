/**
 * Payemnt modal.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CellModalPayemnt from '../../src/Components/PayemntModal';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/PayemntModal',
  component: CellModalPayemnt,
} satisfies Meta<typeof CellModalPayemnt>;

/**
 * Payemnt modal.stories default export.
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
