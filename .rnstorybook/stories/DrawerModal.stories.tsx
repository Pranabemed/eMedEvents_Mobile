/**
 * Drawer modal.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import DrawerModal from '../../src/Components/DrawerModal';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/DrawerModal',
  component: DrawerModal,
} satisfies Meta<typeof DrawerModal>;

/**
 * Drawer modal.stories default export.
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
