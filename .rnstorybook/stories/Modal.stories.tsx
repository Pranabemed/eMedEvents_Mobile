/**
 * Modal.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CustomModal from '../../src/Components/Modal';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Modal',
  component: CustomModal,
} satisfies Meta<typeof CustomModal>;

/**
 * Modal.stories default export.
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
