/**
 * Dashboard main shimmer.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import DashboardMainShimmer from '../../src/Components/DashboardMainShimmer';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/DashboardMainShimmer',
  component: DashboardMainShimmer,
} satisfies Meta<typeof DashboardMainShimmer>;

/**
 * Dashboard main shimmer.stories default export.
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
