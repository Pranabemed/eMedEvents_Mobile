/**
 * Page.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default.
 */

import type { Meta, StoryObj } from '@storybook/react-native';

import { Page } from './Page';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Example/Page',
  component: Page,
} satisfies Meta<typeof Page>;

/**
 * Page.stories default export.
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
export const Default: Story = {};
