/**
 * Textfield.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default, SecureEntry, WithIcons, DarkTheme.
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TextFieldIn from '../../src/Components/Textfield';

/**
 * Meta object.
 * @returns {Object}
 */
const meta: Meta<typeof TextFieldIn> = {
  title: 'Components/TextField',
  component: TextFieldIn,
  argTypes: {
    onChangeText: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
    placeholder: { control: 'text' },
    isSecure: { control: 'boolean' },
    eye: { control: 'boolean' },
    backgroundColor: { control: 'color' },
  },
  args: {
    placeholder: 'Enter text here',
    height: 50,
    width: '90%',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    paddingLeft: 10,
  },
  parameters: {
    docs: {
      description: {
        component: 'Customizable text input field with optional icons and secure entry toggling.',
      },
    },
  },
};

/**
 * Textfield.stories default export.
 *
 * @returns {*}
 */
export default meta;
type Story = StoryObj<typeof TextFieldIn>;

/**
 * Default object.
 * @returns {Object}
 */
export const Default: Story = {};

/**
 * Secure entry object.
 * @returns {Object}
 */
export const SecureEntry: Story = {
  args: {
    placeholder: 'Password',
    isSecure: true,
    eye: true,
  },
};

/**
 * With icons object.
 * @returns {Object}
 */
export const WithIcons: Story = {
  args: {
    placeholder: 'Search...',
    searchIcon: true,
  },
};

/**
 * Dark theme object.
 * @returns {Object}
 */
export const DarkTheme: Story = {
  args: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    placeholderTextColor: '#AAAAAA',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
