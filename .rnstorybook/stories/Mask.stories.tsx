/**
 * Mask.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import MaskField from '../../src/Components/Mask';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Mask',
  component: MaskField,
} satisfies Meta<typeof MaskField>;

/**
 * Mask.stories default export.
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
