/**
 * New profession.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import NewProfession from '../../src/Components/NewProfession';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/NewProfession',
  component: NewProfession,
} satisfies Meta<typeof NewProfession>;

/**
 * New profession.stories default export.
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
