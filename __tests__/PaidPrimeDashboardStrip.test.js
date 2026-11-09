describe('Paid 1-Year Prime Subscriber Dashboard Strip Logic', () => {
  const calculateMembershipState = ({
    endDateStringMain,
    isPrimePaymentSuccess = false,
    hasSubscribedStatus = false,
    _subUserStates = [],
    isPrimeSubscriptionActiveCheck = false,
    exploreTrialClicked = false,
    isSubscriptionExpiredSync = false,
  }) => {
    let daysDifferenceCalc = 0;
    if (endDateStringMain) {
      try {
        const endDate = new Date(endDateStringMain);
        const currentDate = new Date();
        const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
        const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
        daysDifferenceCalc = (normalizedEndDate - normalizedCurrentDate) / (1000 * 60 * 60 * 24);
      } catch (e) {
        daysDifferenceCalc = 0;
      }
    }

    const hasExplicitTrialStatus =
      !isPrimePaymentSuccess &&
      daysDifferenceCalc <= 35 &&
      (
        exploreTrialClicked ||
        _subUserStates.includes('free')
      );

    const isPaidOneYearPrime = Boolean(
      !isSubscriptionExpiredSync &&
      (
        isPrimePaymentSuccess ||
        hasSubscribedStatus ||
        _subUserStates.some(val => ['subscribed', 'premium'].includes(String(val || '').trim().toLowerCase())) ||
        (daysDifferenceCalc > 35 && isPrimeSubscriptionActiveCheck)
      )
    );

    let freeTrail = false;
    let daysleft = false;
    if (!isPaidOneYearPrime) {
      if (!endDateStringMain) {
        if (hasExplicitTrialStatus) {
          freeTrail = true;
          daysleft = 30;
        }
      } else if (daysDifferenceCalc > 35) {
        freeTrail = false;
        daysleft = false;
      } else if (daysDifferenceCalc > 0) {
        freeTrail = true;
        daysleft = Math.ceil(daysDifferenceCalc);
      }
    }

    const shouldShowGetPrimeMembershipStrip = !isPaidOneYearPrime && !freeTrail;
    const shouldShowSubscribeNowStrip = freeTrail && Boolean(daysleft);

    return {
      isPaidOneYearPrime,
      freeTrail,
      daysleft,
      shouldShowGetPrimeMembershipStrip,
      shouldShowSubscribeNowStrip,
    };
  };

  test('Paid Prime user who just completed purchase: strip is hidden and user is recognized as paid 1-year Prime', () => {
    const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    const result = calculateMembershipState({
      endDateStringMain: oneYearLater,
      isPrimePaymentSuccess: true,
      hasSubscribedStatus: false, // may not have re-fetched profile yet
      _subUserStates: ['free'],    // stale state from pre-payment profile
      isPrimeSubscriptionActiveCheck: false,
      exploreTrialClicked: false,
      isSubscriptionExpiredSync: false,
    });

    expect(result.isPaidOneYearPrime).toBe(true);
    expect(result.freeTrail).toBe(false);
    expect(result.shouldShowGetPrimeMembershipStrip).toBe(false);
    expect(result.shouldShowSubscribeNowStrip).toBe(false);
  });

  test('Returning paid Prime user with active 1-year subscription in PrimeCheckResponse: strip is hidden', () => {
    const oneYearLater = new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString();
    const result = calculateMembershipState({
      endDateStringMain: oneYearLater,
      isPrimePaymentSuccess: false,
      hasSubscribedStatus: true,
      _subUserStates: ['subscribed'],
      isPrimeSubscriptionActiveCheck: true,
      exploreTrialClicked: false,
      isSubscriptionExpiredSync: false,
    });

    expect(result.isPaidOneYearPrime).toBe(true);
    expect(result.freeTrail).toBe(false);
    expect(result.shouldShowGetPrimeMembershipStrip).toBe(false);
    expect(result.shouldShowSubscribeNowStrip).toBe(false);
  });

  test('Active 30-day trial user: should show Subscribe Now strip with days remaining, NOT Get Prime Membership', () => {
    const twentyDaysLater = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString();
    const result = calculateMembershipState({
      endDateStringMain: twentyDaysLater,
      isPrimePaymentSuccess: false,
      hasSubscribedStatus: false,
      _subUserStates: ['free'],
      isPrimeSubscriptionActiveCheck: true,
      exploreTrialClicked: false,
      isSubscriptionExpiredSync: false,
    });

    expect(result.isPaidOneYearPrime).toBe(false);
    expect(result.freeTrail).toBe(true);
    expect(result.daysleft).toBeGreaterThan(0);
    expect(result.shouldShowGetPrimeMembershipStrip).toBe(false);
    expect(result.shouldShowSubscribeNowStrip).toBe(true);
  });

  test('Non-subscribed user: should show Get Prime Membership strip', () => {
    const result = calculateMembershipState({
      endDateStringMain: null,
      isPrimePaymentSuccess: false,
      hasSubscribedStatus: false,
      _subUserStates: ['non-subscribed'],
      isPrimeSubscriptionActiveCheck: false,
      exploreTrialClicked: false,
      isSubscriptionExpiredSync: false,
    });

    expect(result.isPaidOneYearPrime).toBe(false);
    expect(result.freeTrail).toBe(false);
    expect(result.shouldShowGetPrimeMembershipStrip).toBe(true);
    expect(result.shouldShowSubscribeNowStrip).toBe(false);
  });
});

