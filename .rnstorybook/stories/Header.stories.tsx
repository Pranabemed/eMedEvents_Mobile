/**
 * Header.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default, DarkTheme.
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Header from '../../src/Components/Header';

/**
 * Meta object.
 * @returns {Object}
 */
const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    onPress: { action: 'pressed' },
    tintColor: { control: 'color' },
  },
  args: {
    tintColor: '#333333',
  },
  parameters: {
    docs: {
      description: {
        component: 'Reusable Header component.',
      },
    },
  },
};

/**
 * Header.stories default export.
 *
 * @returns {*}
 */
export default meta;
type Story = StoryObj<typeof Header>;

/**
 * Default object.
 * @returns {Object}
 */
export const Default: Story = {};

/**
 * Dark theme object.
 * @returns {Object}
 */
export const DarkTheme: Story = {
  args: {
    tintColor: '#FFFFFF',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
