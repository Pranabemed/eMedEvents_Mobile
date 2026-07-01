/**
 * Slider ref.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Sliders from '../../src/Components/SliderRef';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/SliderRef',
  component: Sliders,
} satisfies Meta<typeof Sliders>;

/**
 * Slider ref.stories default export.
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
