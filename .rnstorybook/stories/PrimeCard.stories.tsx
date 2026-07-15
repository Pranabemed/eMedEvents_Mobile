/**
 * Prime card.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import PrimeCard from '../../src/Components/PrimeCard';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/PrimeCard',
  component: PrimeCard,
} satisfies Meta<typeof PrimeCard>;

/**
 * Prime card.stories default export.
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
