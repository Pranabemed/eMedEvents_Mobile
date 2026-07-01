/**
 * Drop down sec.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import onChangeText from '../../src/Components/DropDownSec';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/DropDownSec',
  component: onChangeText,
} satisfies Meta<typeof onChangeText>;

/**
 * Drop down sec.stories default export.
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
