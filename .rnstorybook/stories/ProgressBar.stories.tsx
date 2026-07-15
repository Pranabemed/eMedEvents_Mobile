/**
 * Progress bar.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default, ZeroPercent, FullPercent.
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CircularProgress from '../../src/Components/ProgressBar';

/**
 * Meta object.
 * @returns {Object}
 */
const meta: Meta<typeof CircularProgress> = {
  title: 'Components/ProgressBar',
  component: CircularProgress,
  argTypes: {
    percentage: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: {
    percentage: 50,
  },
  parameters: {
    docs: {
      description: {
        component: 'Circular progress indicator showing a percentage of completion.',
      },
    },
  },
};

/**
 * Progress bar.stories default export.
 *
 * @returns {*}
 */
export default meta;
type Story = StoryObj<typeof CircularProgress>;

/**
 * Default object.
 * @returns {Object}
 */
/**
 * Default object.
 * @returns {Object}
 */
export const Default: Story = {};

/**
 * Zero percent object.
 * @returns {Object}
 */
/**
 * Zero percent object.
 * @returns {Object}
 */
export const ZeroPercent: Story = {
  args: {
    percentage: 0,
  },
};

/**
 * Full percent object.
 * @returns {Object}
 */
/**
 * Full percent object.
 * @returns {Object}
 */
export const FullPercent: Story = {
  args: {
    percentage: 100,
  },
};
