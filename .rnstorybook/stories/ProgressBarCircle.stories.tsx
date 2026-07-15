/**
 * Progress bar circle.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import ProgressBarCircle from '../../src/Components/ProgressBarCircle';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/ProgressBarCircle',
  component: ProgressBarCircle,
} satisfies Meta<typeof ProgressBarCircle>;

/**
 * Progress bar circle.stories default export.
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
