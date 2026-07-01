/**
 * Drop down header.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import DropDownHeader from '../../src/Components/DropDownHeader';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/DropDownHeader',
  component: DropDownHeader,
} satisfies Meta<typeof DropDownHeader>;

/**
 * Drop down header.stories default export.
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
