import type { Meta, StoryObj } from '@storybook/react';
import Button from '../../src/Components/Button';
import Colorpath from '../../src/Themes/Colorpath';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    onPress: { action: 'pressed' },
    backgroundColor: { control: 'color' },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

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
