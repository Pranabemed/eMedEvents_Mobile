/**
 * Progress perce.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import ProgressBarLine from '../../src/Components/ProgressPerce';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/ProgressPerce',
  component: ProgressBarLine,
} satisfies Meta<typeof ProgressBarLine>;

/**
 * Progress perce.stories default export.
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
