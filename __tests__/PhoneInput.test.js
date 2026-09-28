import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import InputField from '../src/Components/CellInput';

jest.mock('../src/Utils/Helpers/Dimen', () => value => value);
beforeEach(() => jest.useFakeTimers());
afterEach(() => { act(() => jest.runAllTimers()); jest.useRealTimers(); });

test('USA field accepts a full international paste and formats populated values', () => {
  const changed = jest.fn();
  const screen = render(<InputField testID="cell" keyboardType="phone-pad" countryCode="+1" value="+1 5779001234" maxlength={14} onChangeText={changed} />);
  const input = screen.getByTestId('cell');
  expect(input.props.value).toBe('(577) 900-1234');
  expect(input.props.maxLength).toBeUndefined();
  fireEvent.changeText(input, '+1 (577) 900-1234');
  expect(changed).toHaveBeenLastCalledWith('(577) 900-1234');
  screen.rerender(<InputField testID="cell" keyboardType="phone-pad" countryCode="+1" value="(577) 900-1234" onChangeText={changed} />);
  expect(screen.getByTestId('cell').props.value).toBe('(577) 900-1234');
});

test('regular text and international phone fields retain their values', () => {
  const screen = render(<InputField testID="name" value="Alice" maxlength={50} />);
  expect(screen.getByTestId('name').props.maxLength).toBe(50);
  screen.rerender(<InputField testID="phone" keyboardType="phone-pad" countryCode="+91" value="98765 43210" />);
  expect(screen.getByTestId('phone').props.value).toBe('98765 43210');
});

test('number-pad phone fields used by login and recovery do not truncate pastes', () => {
  const changed = jest.fn();
  const screen = render(<InputField testID="cell" keyboardType="number-pad" showCountryCode countryCode="+1" maxlength={14} value="" onChangeText={changed} />);
  const input = screen.getByTestId('cell');
  expect(input.props.maxLength).toBeUndefined();
  fireEvent.changeText(input, '+1 (577) 900-1234');
  expect(changed).toHaveBeenLastCalledWith('(577) 900-1234');
});

test('native maxLength cannot cut a masked phone to six digits', () => {
  let value = '';
  const changed = text => {value = text;};
  const screen = render(<InputField testID="cell" keyboardType="phone-pad" countryCode="+1" value={value} maxLength={10} onChangeText={changed} />);
  expect(screen.getByTestId('cell').props.maxLength).toBeUndefined();
  for (const digit of '4155552671') {
    fireEvent.changeText(screen.getByTestId('cell'), value + digit);
    screen.rerender(<InputField testID="cell" keyboardType="phone-pad" countryCode="+1" value={value} maxLength={10} onChangeText={changed} />);
  }
  expect(value).toBe('(415) 555-2671');
  expect(screen.getByTestId('cell').props.value).toBe('(415) 555-2671');
});

test('US input caps paste, ignores an eleventh digit, and backspaces to empty', () => {
  let value = '';
  const changed = text => { value = text; };
  const field = () => <InputField testID="cell" keyboardType="phone-pad" countryCode="+1" value={value} onChangeText={changed} />;
  const screen = render(field());
  fireEvent.changeText(screen.getByTestId('cell'), '12345678901234');
  screen.rerender(field());
  expect(value).toBe('(123) 456-7890');
  fireEvent.changeText(screen.getByTestId('cell'), value + '1');
  screen.rerender(field());
  expect(value).toBe('(123) 456-7890');
  for (let i = 0; i < 10; i++) {
    fireEvent.changeText(screen.getByTestId('cell'), value.slice(0, -1));
    screen.rerender(field());
  }
  expect(value).toBe('');
});

test('explicit Canadian country retains its input and limit despite sharing +1', () => {
  const changed = jest.fn();
  const screen = render(<InputField testID="cell" keyboardType="phone-pad" countryCode="+1" phoneCountry={{country_code: 'CA'}} value="4165551234" maxLength={15} onChangeText={changed} />);
  expect(screen.getByTestId('cell').props.value).toBe('4165551234');
  expect(screen.getByTestId('cell').props.maxLength).toBe(15);
  fireEvent.changeText(screen.getByTestId('cell'), '41655512345');
  expect(changed).toHaveBeenCalledWith('41655512345');
});
