import {mergeConferencePage} from '../src/Utils/Helpers/conferencePagination';
const page = (start, length = 9) => Array.from({length}, (_, index) => ({id: start + index}));

test('full new page permits pagination and appends results', () => {
  expect(mergeConferencePage(page(1), page(10), 1, 9)).toEqual({items: page(1, 18), hasMore: true});
});
test('empty page stops pagination even when existing count is a multiple of limit', () => {
  expect(mergeConferencePage(page(1), [], 1, 9)).toEqual({items: page(1), hasMore: false});
});
test('repeated full response stops pagination without duplicating cards', () => {
  expect(mergeConferencePage(page(1), page(1), 1, 9)).toEqual({items: page(1), hasMore: false});
});
test('partial final page stops pagination', () => {
  expect(mergeConferencePage(page(1), page(10, 2), 1, 9)).toEqual({items: page(1, 11), hasMore: false});
});
test('refresh replaces old results and permits new pages', () => {
  expect(mergeConferencePage(page(1), page(20), 0, 9)).toEqual({items: page(20), hasMore: true});
});
test('numeric and string IDs are deduplicated and overlapping pages retain new results', () => {
  const incoming = page(5).map(item => ({id: String(item.id)}));
  const result = mergeConferencePage(page(1), incoming, 1, 9);
  expect(result.items).toHaveLength(13);
  expect(result.hasMore).toBe(true);
});
