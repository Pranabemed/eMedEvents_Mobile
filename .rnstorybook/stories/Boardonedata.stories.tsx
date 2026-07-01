/**
 * Boardonedata.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Boardonedata from '../../src/Components/Boardonedata';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Boardonedata',
  component: Boardonedata,
} satisfies Meta<typeof Boardonedata>;

/**
 * Boardonedata.stories default export.
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
