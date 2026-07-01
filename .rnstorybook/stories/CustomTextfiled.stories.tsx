/**
 * Custom textfiled.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import onChangeText from '../../src/Components/CustomTextfiled';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CustomTextfiled',
  component: onChangeText,
} satisfies Meta<typeof onChangeText>;

/**
 * Custom textfiled.stories default export.
 *
 * @returns {*}
 */
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default object.
 * @returns {Object}
 */
export const Default: Story = {
  args: {
    // Add default props here
  },
};
