/**
 * Flatlist shimmer.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import FlatListShimmer from '../../src/Components/FlatlistShimmer';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/FlatlistShimmer',
  component: FlatListShimmer,
} satisfies Meta<typeof FlatListShimmer>;

/**
 * Flatlist shimmer.stories default export.
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
