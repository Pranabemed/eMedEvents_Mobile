import {getCmeWebLink} from '../src/Navigator/cmeWebLink';

test.each([
  'https://www.emedevents.com/cme',
  'https://www.emedevents.com/cme/',
  'https://emedevents.com/cme/course?RefID=123#tickets',
  'https://www.emedevents.com/cme?q=cardiology&source=email',
])('preserves the CME destination and query: %s', url => {
  expect(getCmeWebLink(url)).toBe(url);
});
test('upgrades HTTP CME links to HTTPS', () => {
  expect(getCmeWebLink('http://www.emedevents.com/cme')).toBe('https://www.emedevents.com/cme');
});
test.each(['https://example.com/cme', 'https://emedevents.com.evil.com/cme', 'https://www.emedevents.com/cmepackages', 'javascript:alert(1)', null])('does not claim unrelated links: %s', url => {
  expect(getCmeWebLink(url)).toBeNull();
});
