import { computeNonOverlappingSubscriptions } from '../src/Utils/Helpers/primeSubscription';

describe('Prime Subscription Sequential Chaining (Non-Overlapping)', () => {
  it('chains new subscription to start after existing subscription expires (exact user example)', () => {
    // Existing subscription: 09-Nov-2026 to 10-Nov-2027
    // New subscription purchased while active (nominal created/start: 09-Nov-2026)
    const rawSubscriptions = [
      {
        id: 1,
        start_date: '09-Nov-2026',
        expiry_date: '10-Nov-2027',
        created_date: '09-Nov-2026',
        subscription_type: 'Premium',
        subscription_status: 'Active',
      },
      {
        id: 2,
        start_date: '09-Nov-2026',
        expiry_date: '10-Nov-2027',
        created_date: '09-Nov-2026',
        subscription_type: 'Premium',
        subscription_status: 'Active',
      },
    ];

    const result = computeNonOverlappingSubscriptions(rawSubscriptions);

    expect(result).toHaveLength(2);

    // Existing subscription
    expect(result[0].displayStartDate).toBe('09-Nov-2026');
    expect(result[0].displayExpiryDate).toBe('10-Nov-2027');
    expect(result[0].periodString).toBe('09-Nov-2026 to 10-Nov-2027');

    // New subscription chained to the next year
    expect(result[1].displayStartDate).toBe('10-Nov-2027');
    expect(result[1].displayExpiryDate).toBe('11-Nov-2028');
    expect(result[1].periodString).toBe('10-Nov-2027 to 11-Nov-2028');
  });

  it('chains 3 consecutive subscriptions without any overlap', () => {
    const rawSubscriptions = [
      { id: 10, start_date: '09-Nov-2026', expiry_date: '10-Nov-2027' },
      { id: 11, start_date: '09-Nov-2026', expiry_date: '10-Nov-2027' },
      { id: 12, start_date: '09-Nov-2026', expiry_date: '10-Nov-2027' },
    ];

    const result = computeNonOverlappingSubscriptions(rawSubscriptions);

    expect(result[0].periodString).toBe('09-Nov-2026 to 10-Nov-2027');
    expect(result[1].periodString).toBe('10-Nov-2027 to 11-Nov-2028');
    expect(result[2].periodString).toBe('11-Nov-2028 to 12-Nov-2029');
  });

  it('leaves already non-overlapping subscriptions unchanged', () => {
    const rawSubscriptions = [
      { id: 1, start_date: '01-Jan-2024', expiry_date: '02-Jan-2025' },
      { id: 2, start_date: '01-Jun-2025', expiry_date: '02-Jun-2026' },
    ];

    const result = computeNonOverlappingSubscriptions(rawSubscriptions);

    expect(result[0].displayStartDate).toBe('01-Jan-2024');
    expect(result[0].displayExpiryDate).toBe('02-Jan-2025');
    expect(result[1].displayStartDate).toBe('01-Jun-2025');
    expect(result[1].displayExpiryDate).toBe('02-Jun-2026');
  });

  it('handles empty or invalid subscription lists gracefully', () => {
    expect(computeNonOverlappingSubscriptions(null)).toEqual([]);
    expect(computeNonOverlappingSubscriptions([])).toEqual([]);
    expect(computeNonOverlappingSubscriptions('invalid')).toEqual([]);
  });

  it('parses MMM DD, YYYY format correctly', () => {
    const rawSubscriptions = [
      { id: 1, created_date: 'Nov 09, 2026', expiry_date: 'Nov 10, 2027' },
      { id: 2, created_date: 'Nov 09, 2026', expiry_date: 'Nov 10, 2027' },
    ];

    const result = computeNonOverlappingSubscriptions(rawSubscriptions);

    expect(result[0].periodString).toBe('09-Nov-2026 to 10-Nov-2027');
    expect(result[1].periodString).toBe('10-Nov-2027 to 11-Nov-2028');
  });
});

