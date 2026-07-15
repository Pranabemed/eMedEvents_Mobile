/**
 * Payment failed.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CellModalPayemntFailed from '../../src/Components/PaymentFailed';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/PaymentFailed',
  component: CellModalPayemntFailed,
} satisfies Meta<typeof CellModalPayemntFailed>;

/**
 * Payment failed.stories default export.
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
