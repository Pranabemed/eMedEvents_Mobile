/**
 * Carouselcarditem.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Carouselcarditem from '../../src/Components/Carouselcarditem';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Carouselcarditem',
  component: Carouselcarditem,
} satisfies Meta<typeof Carouselcarditem>;

/**
 * Carouselcarditem.stories default export.
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
