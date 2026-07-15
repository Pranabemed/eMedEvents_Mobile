/**
 * State data component.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import StateDataComponent from '../../src/Components/StateDataComponent';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/StateDataComponent',
  component: StateDataComponent,
} satisfies Meta<typeof StateDataComponent>;

/**
 * State data component.stories default export.
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
