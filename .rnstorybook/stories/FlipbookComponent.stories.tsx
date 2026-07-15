/**
 * Flipbook component.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import FlipbookComponent from '../../src/Components/FlipbookComponent';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/FlipbookComponent',
  component: FlipbookComponent,
} satisfies Meta<typeof FlipbookComponent>;

/**
 * Flipbook component.stories default export.
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
