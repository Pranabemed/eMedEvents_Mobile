/**
 * Board carousel.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import BoardCarousel from '../../src/Components/BoardCarousel';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/BoardCarousel',
  component: BoardCarousel,
} satisfies Meta<typeof BoardCarousel>;

/**
 * Board carousel.stories default export.
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
