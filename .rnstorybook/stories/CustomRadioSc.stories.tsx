/**
 * Custom radio sc.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CustomRadioButtons from '../../src/Components/CustomRadioSc';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CustomRadioSc',
  component: CustomRadioButtons,
} satisfies Meta<typeof CustomRadioButtons>;

/**
 * Custom radio sc.stories default export.
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
