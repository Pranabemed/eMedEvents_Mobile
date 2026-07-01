/**
 * Cell modal.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CellModal from '../../src/Components/CellModal';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CellModal',
  component: CellModal,
} satisfies Meta<typeof CellModal>;

/**
 * Cell modal.stories default export.
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
