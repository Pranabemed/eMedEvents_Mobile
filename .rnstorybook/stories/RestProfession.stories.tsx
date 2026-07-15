/**
 * Rest profession.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import RestProfession from '../../src/Components/RestProfession';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/RestProfession',
  component: RestProfession,
} satisfies Meta<typeof RestProfession>;

/**
 * Rest profession.stories default export.
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
