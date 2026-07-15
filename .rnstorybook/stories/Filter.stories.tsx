/**
 * Filter.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import FilterModal from '../../src/Components/Filter';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Filter',
  component: FilterModal,
} satisfies Meta<typeof FilterModal>;

/**
 * Filter.stories default export.
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
