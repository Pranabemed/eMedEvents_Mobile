/**
 * Radio button.stories Storybook module. Defines stories and controls for component previews. Exported members: meta, Default, Selected, CustomLabel.
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CustomRadioButton from '../../src/Components/RadioButton';

/**
 * Meta object.
 * @returns {Object}
 */
const meta: Meta<typeof CustomRadioButton> = {
  title: 'Components/RadioButton',
  component: CustomRadioButton,
  argTypes: {
    onPress: { action: 'pressed' },
    selected: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    label: 'Option 1',
    selected: false,
  },
  parameters: {
    docs: {
      description: {
        component: 'Customizable radio button with a label.',
      },
    },
  },
    /**
 * Render helper.
 * @param {*} args - Input value.
 * @returns {JSX.Element}
 */
render: (args) => {
    const [selected, setSelected] = useState(args.selected);
    return (
      <CustomRadioButton
        {...args}
        selected={selected}
        onPress={() => {
          setSelected(!selected);
          args.onPress && args.onPress();
        }}
      />
    );
  },
};

/**
 * Radio button.stories default export.
 *
 * @returns {*}
 */
export default meta;
type Story = StoryObj<typeof CustomRadioButton>;

/**
 * Default object.
 * @returns {Object}
 */
export const Default: Story = {};

/**
 * Selected object.
 * @returns {Object}
 */
export const Selected: Story = {
  args: {
    selected: true,
  },
};

/**
 * Custom label object.
 * @returns {Object}
 */
export const CustomLabel: Story = {
  args: {
    label: 'Accept Terms & Conditions',
  },
};
