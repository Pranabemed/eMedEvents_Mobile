/**
 * Rate review.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import RateReview from '../../src/Components/RateReview';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/RateReview',
  component: RateReview,
} satisfies Meta<typeof RateReview>;

/**
 * Rate review.stories default export.
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
