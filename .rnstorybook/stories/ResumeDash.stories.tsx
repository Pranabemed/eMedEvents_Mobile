/**
 * Resume dash.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import ResumeDash from '../../src/Components/ResumeDash';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/ResumeDash',
  component: ResumeDash,
} satisfies Meta<typeof ResumeDash>;

/**
 * Resume dash.stories default export.
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
