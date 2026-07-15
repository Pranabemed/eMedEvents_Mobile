/**
 * Linear button.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import GradientButton from '../../src/Components/LinearButton';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/LinearButton',
  component: GradientButton,
} satisfies Meta<typeof GradientButton>;

/**
 * Linear button.stories default export.
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
