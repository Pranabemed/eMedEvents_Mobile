/**
 * Cmemodal.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Cmemodal from '../../src/Components/Cmemodal';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Cmemodal',
  component: Cmemodal,
} satisfies Meta<typeof Cmemodal>;

/**
 * Cmemodal.stories default export.
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
