import reducer, {
  mainprofileRequest,
  mainprofileSuccess,
  mainprofileFailure,
} from '../src/Redux/Reducers/DashboardReducer';

test('profile stays visible during refresh and is replaced by fresh data', () => {
  const profile = {id: 1, professional_information: {profession: 'Physician'}};
  const loaded = reducer(undefined, mainprofileSuccess(profile));
  const refreshing = reducer(loaded, mainprofileRequest({}));
  expect(refreshing.mainprofileResponse).toEqual(profile);
  expect(refreshing.mainProfileLoading).toBe(true);
  const fresh = {id: 1, professional_information: {profession: 'Dentist'}};
  const updated = reducer(refreshing, mainprofileSuccess(fresh));
  expect(updated.mainprofileResponse).toEqual(fresh);
  expect(updated.mainProfileLoading).toBe(false);
});

test('failed refresh retains the profile and ends loading', () => {
  const profile = {id: 1};
  const loaded = reducer(undefined, mainprofileSuccess(profile));
  const failed = reducer(reducer(loaded, mainprofileRequest({})), mainprofileFailure({}));
  expect(failed.mainprofileResponse).toEqual(profile);
  expect(failed.mainProfileLoading).toBe(false);
});

test('first load has no cached profile and failure ends loading', () => {
  const loading = reducer(undefined, mainprofileRequest({}));
  expect(loading.mainprofileResponse).toEqual({});
  expect(loading.mainProfileLoading).toBe(true);
  expect(reducer(loading, mainprofileFailure({})).mainProfileLoading).toBe(false);
});
