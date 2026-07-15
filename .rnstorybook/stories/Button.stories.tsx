/**
 * Button.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default, Loading, Disabled, Small, Large.
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Buttons from '../../src/Components/Button';

/**
 * Storybook for the Buttons component.
 */
const meta: Meta<typeof Buttons> = {
  title: 'Components/Button',
  component: Buttons,
  argTypes: {
    onPress: { action: 'pressed' },
    backgroundColor: { control: 'color' },
    color: { control: 'color' },
    text: { control: 'text' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    height: 50,
    width: 200,
    borderRadius: 8,
    backgroundColor: '#009E38',
    color: '#FFFFFF',
    text: 'Click Me',
    fontSize: 16,
  },
  parameters: {
    docs: {
      description: {
        component: 'Reusable Button component that supports text, icons, and loading states.',
      },
    },
  },
};

/**
 * Button.stories default export.
 *
 * @returns {*}
 */
export default meta;
type Story = StoryObj<typeof Buttons>;

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
 * Loading object.
 * @returns {Object}
 */
/**
 * Loading object.
 * @returns {Object}
 */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/**
 * Disabled object.
 * @returns {Object}
 */
/**
 * Disabled object.
 * @returns {Object}
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    backgroundColor: '#CCCCCC',
  },
};

/**
 * Small object.
 * @returns {Object}
 */
/**
 * Small object.
 * @returns {Object}
 */
export const Small: Story = {
  args: {
    height: 30,
    width: 100,
    fontSize: 12,
    text: 'Small',
  },
};

/**
 * Large object.
 * @returns {Object}
 */
/**
 * Large object.
 * @returns {Object}
 */
export const Large: Story = {
  args: {
    height: 60,
    width: 300,
    fontSize: 20,
    text: 'Large Button',
  },
};
