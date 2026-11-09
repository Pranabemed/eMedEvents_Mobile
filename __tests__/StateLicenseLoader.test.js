describe('State License Loading & Skeleton Handling', () => {
  it('correctly detects when state licenses are in loading state', () => {
    // Initial mount when user logs in for the first time
    const checkStateLicenseLoading = ({ status, fetchInFlight, fulldashbaord, dashboardResponse, timedOut }) => {
      if (timedOut) return false;
      return (
        status === 'Dashboard/dashboardRequest' ||
        fetchInFlight ||
        (fulldashbaord === null && !dashboardResponse?.data)
      );
    };

    // Case 1: First login, dashboardRequest in flight, fulldashbaord is null
    expect(checkStateLicenseLoading({
      status: 'Dashboard/dashboardRequest',
      fetchInFlight: true,
      fulldashbaord: null,
      dashboardResponse: {},
      timedOut: false,
    })).toBe(true);

    // Case 2: Dashboard success with licensures loaded
    expect(checkStateLicenseLoading({
      status: 'Dashboard/dashboardSuccess',
      fetchInFlight: false,
      fulldashbaord: [{ state_id: 10, state_name: 'California' }],
      dashboardResponse: { data: { licensures: [{ state_id: 10 }] } },
      timedOut: false,
    })).toBe(false);

    // Case 3: Safety timeout elapsed
    expect(checkStateLicenseLoading({
      status: 'Dashboard/dashboardRequest',
      fetchInFlight: true,
      fulldashbaord: null,
      dashboardResponse: {},
      timedOut: true,
    })).toBe(false);
  });

  it('correctly detects when complete state license details (topics/credits/tasks) are loading in Dashboardmain', () => {
    const checkStateDetailsLoading = ({ status, finddata }) => {
      return (
        status === 'Dashboard/stateDashboardRequest' ||
        (!finddata && status !== 'Dashboard/stateDashboardFailure' && status !== 'Dashboard/stateDashboardSuccess')
      );
    };

    // Case 1: stateDashboardRequest in flight, finddata not yet available
    expect(checkStateDetailsLoading({
      status: 'Dashboard/stateDashboardRequest',
      finddata: undefined,
    })).toBe(true);

    // Case 2: stateDashboardSuccess with data
    expect(checkStateDetailsLoading({
      status: 'Dashboard/stateDashboardSuccess',
      finddata: { my_recommendations: { mandatory_courses: [] }, my_activities: [] },
    })).toBe(false);

    // Case 3: Request failed, should not stay stuck in loading
    expect(checkStateDetailsLoading({
      status: 'Dashboard/stateDashboardFailure',
      finddata: undefined,
    })).toBe(false);
  });
});

