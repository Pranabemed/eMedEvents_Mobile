/**
 * Taskcarditem.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import TaskCardItem from '../../src/Components/Taskcarditem';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Taskcarditem',
  component: TaskCardItem,
} satisfies Meta<typeof TaskCardItem>;

/**
 * Taskcarditem.stories default export.
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
