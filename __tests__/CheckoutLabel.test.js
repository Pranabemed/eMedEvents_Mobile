import {checkoutLabel} from '../src/Screen/DetailsPageWebcast/checkoutLabel';

test.each([
  '<b>Physician</b>',
  '&lt;b&gt;Physician&lt;/b&gt;',
  '&amp;lt;b&amp;gt;Physician&amp;lt;/b&amp;gt;',
  '&#60;b&#62;Physician&#60;/b&#62;',
  '&#x3c;b&#x3e;Physician&#x3c;/b&#x3e;',
  '\\<b>Physician\\</b>',
])('renders %s as plain checkout text', value => {
  expect(checkoutLabel(value)).toBe('Physician');
});

test('preserves ticket wording and handles empty labels', () => {
  expect(checkoutLabel('<b>Nurse / PA (Virtual)</b> &amp; Guest')).toBe('Nurse / PA (Virtual) & Guest');
  expect(checkoutLabel('<b> </b>')).toBe('');
  expect(checkoutLabel('<b></b>')).toBe('');
  expect(checkoutLabel('&lt;b&gt; &lt;/b&gt;')).toBe('');
  expect(checkoutLabel(undefined)).toBe('');
});
