/**
 * Cmecard.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CMECard from '../../src/Components/CMECard';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/CMECard',
  component: CMECard,
} satisfies Meta<typeof CMECard>;

/**
 * Cmecard.stories default export.
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
