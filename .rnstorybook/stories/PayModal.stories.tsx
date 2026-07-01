/**
 * Pay modal.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import PayModal from '../../src/Components/PayModal';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/PayModal',
  component: PayModal,
} satisfies Meta<typeof PayModal>;

/**
 * Pay modal.stories default export.
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
