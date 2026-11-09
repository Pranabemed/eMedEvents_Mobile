import { isValidStateLicense, filterValidLicensures } from '../src/Utils/Helpers/primeSubscription';

describe('License Filtering and Validation Logic', () => {
  test('isValidStateLicense rejects null, undefined, empty, or "null" state_name', () => {
    expect(isValidStateLicense(null)).toBe(false);
    expect(isValidStateLicense({})).toBe(false);
    expect(isValidStateLicense({ state_name: null, state_id: 1 })).toBe(false);
    expect(isValidStateLicense({ state_name: 'null', state_id: 1 })).toBe(false);
    expect(isValidStateLicense({ state_name: 'undefined', state_id: 1 })).toBe(false);
    expect(isValidStateLicense({ state_name: '   ', state_id: 1 })).toBe(false);
    expect(isValidStateLicense({ state_name: '', state_id: 1 })).toBe(false);
    expect(isValidStateLicense({ state_name: 'California', state_id: null })).toBe(false);
    expect(isValidStateLicense({ state_name: 'California', state_id: 0 })).toBe(false);
    expect(isValidStateLicense({ state_name: 'California', state_id: '0' })).toBe(false);
    expect(isValidStateLicense({ state_name: 'California', state_id: 1, is_deleted: 1 })).toBe(false);
    expect(isValidStateLicense({ state_name: 'California', state_id: 1, status: 'deleted' })).toBe(false);
  });

  test('isValidStateLicense accepts valid state licenses', () => {
    expect(isValidStateLicense({ state_name: 'Florida', state_id: 10 })).toBe(true);
    expect(isValidStateLicense({ state: 'Texas', id: 43 })).toBe(true);
    expect(isValidStateLicense({ name: 'New York', state_id: 32 })).toBe(true);
  });

  test('filterValidLicensures drops items with null state_name', () => {
    const rawLicensures = [
      { id: 1, state_id: 10, state_name: 'Florida' },
      { id: 2, state_id: 20, state_name: null },
      { id: 3, state_id: 30, state_name: 'California' },
    ];
    const filtered = filterValidLicensures(rawLicensures);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(l => l.state_name)).toEqual(['Florida', 'California']);
  });

  test('filterValidLicensures drops items deleted from profile', () => {
    const dashboardLicensures = [
      { id: 1, state_id: 10, state_name: 'Florida' },
      { id: 2, state_id: 20, state_name: 'Texas' },
      { id: 3, state_id: 30, state_name: 'California' },
    ];
    // Texas was deleted in profile
    const profileLicensures = [
      { id: 1, state_id: 10, state_name: 'Florida' },
      { id: 3, state_id: 30, state_name: 'California' },
    ];
    const filtered = filterValidLicensures(dashboardLicensures, profileLicensures);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(l => l.state_name)).toEqual(['Florida', 'California']);
  });

  test('filterValidLicensures handles both null state_name and deleted profile states simultaneously', () => {
    const dashboardLicensures = [
      { id: 1, state_id: 10, state_name: 'Florida' },
      { id: 2, state_id: 20, state_name: null },
      { id: 3, state_id: 30, state_name: 'Texas' },
      { id: 4, state_id: 40, state_name: 'California' },
    ];
    // Profile only has Florida and California
    const profileLicensures = [
      { id: 1, state_id: 10, state_name: 'Florida' },
      { id: 4, state_id: 40, state_name: 'California' },
    ];
    const filtered = filterValidLicensures(dashboardLicensures, profileLicensures);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(l => l.state_name)).toEqual(['Florida', 'California']);
  });

  test('deduplicates duplicate entries of the same state (fixing: profile shows 2 states, dashboard shows 3 states with duplicate state)', () => {
    // Scenario: User has Florida and California, but California appears twice with different board_id / id
    const dashboardLicensuresWithDuplicates = [
      { id: 101, state_id: 10, state_name: 'Florida', board_id: 1 },
      { id: 102, state_id: 20, state_name: 'California', board_id: 2, license_number: 'CA123' },
      { id: 103, state_id: 20, state_name: 'California', board_id: 5, credits_data: { total: 50 } },
    ];
    // Profile only has Florida and California
    const profileLicensures = [
      { id: 101, state_id: 10, state_name: 'Florida' },
      { id: 102, state_id: 20, state_name: 'California' },
    ];
    const filtered = filterValidLicensures(dashboardLicensuresWithDuplicates, profileLicensures);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(l => l.state_name)).toEqual(['Florida', 'California']);
    // Verify data merge from duplicate
    const ca = filtered.find(l => l.state_name === 'California');
    expect(ca.license_number).toBe('CA123');
    expect(ca.credits_data).toEqual({ total: 50 });
  });

  test('deduplicates duplicate states even without profileLicensures passed', () => {
    const rawLicensures = [
      { id: 1, state_id: 10, state_name: 'Florida', board_id: 1 },
      { id: 2, state_id: 20, state_name: 'California', board_id: 2 },
      { id: 3, state_id: 20, state_name: 'California', board_id: 3 },
    ];
    const filtered = filterValidLicensures(rawLicensures);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(l => l.state_name)).toEqual(['Florida', 'California']);
  });
});

