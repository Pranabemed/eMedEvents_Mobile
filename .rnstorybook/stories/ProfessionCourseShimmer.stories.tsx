/**
 * Profession course shimmer.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import ProfessionCourseShimmer from '../../src/Components/ProfessionCourseShimmer';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/ProfessionCourseShimmer',
  component: ProfessionCourseShimmer,
} satisfies Meta<typeof ProfessionCourseShimmer>;

/**
 * Profession course shimmer.stories default export.
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
