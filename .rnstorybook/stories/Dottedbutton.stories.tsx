/**
 * Dottedbutton.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import DottedButton from '../../src/Components/Dottedbutton';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Dottedbutton',
  component: DottedButton,
} satisfies Meta<typeof DottedButton>;

/**
 * Dottedbutton.stories default export.
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
