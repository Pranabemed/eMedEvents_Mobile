import reducer, {licesensRequest, licesensSuccess, licesensFailure} from '../src/Redux/Reducers/AuthReducer';

test('same-profession refresh keeps license availability until the response arrives', () => {
  const requested = reducer(undefined, licesensRequest('Physician - MD'));
  const loaded = reducer(requested, licesensSuccess({licensure_states: [{id: 1}]}));
  const refreshing = reducer(loaded, licesensRequest('Physician - MD'));
  expect(refreshing.licesensResponse).toEqual(loaded.licesensResponse);
  expect(refreshing.licesensLoading).toBe(true);
  const updated = reducer(refreshing, licesensSuccess({licensure_states: []}));
  expect(updated.licesensResponse.licensure_states).toEqual([]);
  expect(updated.licesensLoading).toBe(false);
  expect(reducer(loaded, licesensRequest('Physician - DO')).licesensResponse).toBeNull();
});

test('failed availability request releases initial loading', () => {
  const requested = reducer(undefined, licesensRequest('Physician - MD'));
  expect(reducer(requested, licesensFailure({})).licesensLoading).toBe(false);
});
