/**
 * Dashboardmain.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Dashboardmain from '../../src/Components/Dashboardmain';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Dashboardmain',
  component: Dashboardmain,
} satisfies Meta<typeof Dashboardmain>;

/**
 * Dashboardmain.stories default export.
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
