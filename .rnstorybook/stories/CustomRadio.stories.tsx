/**
 * Custom radio.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CustomPaymentradio from '../../src/Components/CustomRadio';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CustomRadio',
  component: CustomPaymentradio,
} satisfies Meta<typeof CustomPaymentradio>;

/**
 * Custom radio.stories default export.
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
