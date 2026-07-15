/**
 * Nonphysicianprofile.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Nonphysicianprofile from '../../src/Components/Nonphysicianprofile';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Nonphysicianprofile',
  component: Nonphysicianprofile,
} satisfies Meta<typeof Nonphysicianprofile>;

/**
 * Nonphysicianprofile.stories default export.
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
