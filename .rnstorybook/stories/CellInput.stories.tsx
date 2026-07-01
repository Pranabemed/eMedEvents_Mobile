/**
 * Cell input.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import toggleSecureEntry from '../../src/Components/CellInput';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CellInput',
  component: toggleSecureEntry,
} satisfies Meta<typeof toggleSecureEntry>;

/**
 * Cell input.stories default export.
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
