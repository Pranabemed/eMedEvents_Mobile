/**
 * Non physician cat.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import NonPhysicianCat from '../../src/Components/NonPhysicianCat';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/NonPhysicianCat',
  component: NonPhysicianCat,
} satisfies Meta<typeof NonPhysicianCat>;

/**
 * Non physician cat.stories default export.
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
