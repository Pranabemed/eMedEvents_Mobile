/**
 * Course shimmer.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CourseShimmer from '../../src/Components/CourseShimmer';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CourseShimmer',
  component: CourseShimmer,
} satisfies Meta<typeof CourseShimmer>;

/**
 * Course shimmer.stories default export.
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
