/**
 * Paper input.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CustomInputs from '../../src/Components/PaperInput';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/PaperInput',
  component: CustomInputs,
} satisfies Meta<typeof CustomInputs>;

/**
 * Paper input.stories default export.
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
