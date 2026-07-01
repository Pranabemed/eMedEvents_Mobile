/**
 * Noboardfound.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Noboardfound from '../../src/Components/Noboardfound';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Noboardfound',
  component: Noboardfound,
} satisfies Meta<typeof Noboardfound>;

/**
 * Noboardfound.stories default export.
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
