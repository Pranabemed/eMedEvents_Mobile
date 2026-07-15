/**
 * Dashboardmaintwo.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Dashboardmaintwo from '../../src/Components/Dashboardmaintwo';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Dashboardmaintwo',
  component: Dashboardmaintwo,
} satisfies Meta<typeof Dashboardmaintwo>;

/**
 * Dashboardmaintwo.stories default export.
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
