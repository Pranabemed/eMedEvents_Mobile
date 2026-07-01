/**
 * Custom button.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default, Disabled, Loading, WithIcon.
 */

import type { Meta, StoryObj } from '@storybook/react';
import Button from '../../src/Components/Button';
import Colorpath from '../../src/Themes/Colorpath';

/**
 * Meta value.
 * @returns {*}
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    onPress: { action: 'pressed' },
    backgroundColor: { control: 'color' },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Button>;

/**
 * Custom button.stories default export.
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
    text: 'Click Me',
    height: 50,
    width: 200,
    backgroundColor: Colorpath.ButtonColr,
    color: Colorpath.white,
    borderRadius: 8,
  },
};

/**
 * Disabled object.
 * @returns {Object}
 */
export const Disabled: Story = {
  args: {
    text: 'Disabled',
    height: 50,
    width: 200,
    backgroundColor: Colorpath.grey,
    color: Colorpath.white,
    borderRadius: 8,
    disabled: true,
  },
};

/**
 * Loading object.
 * @returns {Object}
 */
export const Loading: Story = {
  args: {
    text: 'Submit',
    height: 50,
    width: 200,
    backgroundColor: Colorpath.ButtonColr,
    color: Colorpath.white,
    borderRadius: 8,
    loading: true,
  },
};

/**
 * With icon object.
 * @returns {Object}
 */
export const WithIcon: Story = {
  args: {
    text: 'Next',
    height: 50,
    width: 200,
    backgroundColor: Colorpath.ButtonColr,
    color: Colorpath.white,
    borderRadius: 8,
    image: true,
    source: 'arrow-right',
    size: 20,
    imageMarginLeft: 10,
  },
};
