/**
 * Specialized.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Specialized from '../../src/Components/Specialized';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Specialized',
  component: Specialized,
} satisfies Meta<typeof Specialized>;

/**
 * Specialized.stories default export.
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
