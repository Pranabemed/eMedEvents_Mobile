/**
 * Prime payment.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import PrimePayment from '../../src/Components/PrimePayment';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/PrimePayment',
  component: PrimePayment,
} satisfies Meta<typeof PrimePayment>;

/**
 * Prime payment.stories default export.
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
