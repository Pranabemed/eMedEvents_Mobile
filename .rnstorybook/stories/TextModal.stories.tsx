/**
 * Text modal.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import TextModal from '../../src/Components/TextModal';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/TextModal',
  component: TextModal,
} satisfies Meta<typeof TextModal>;

/**
 * Text modal.stories default export.
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
