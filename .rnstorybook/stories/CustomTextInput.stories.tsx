/**
 * Custom text input.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CustomInputWithDropdown from '../../src/Components/CustomTextInput';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CustomTextInput',
  component: CustomInputWithDropdown,
} satisfies Meta<typeof CustomInputWithDropdown>;

/**
 * Custom text input.stories default export.
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
