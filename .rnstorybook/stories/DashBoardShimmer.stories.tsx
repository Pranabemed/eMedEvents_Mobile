/**
 * Dash board shimmer.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import HomeShimmer from '../../src/Components/DashBoardShimmer';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/DashBoardShimmer',
  component: HomeShimmer,
} satisfies Meta<typeof HomeShimmer>;

/**
 * Dash board shimmer.stories default export.
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
