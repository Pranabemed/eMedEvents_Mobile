import reducer, { logoutSuccess } from '../src/Redux/Reducers/AuthReducer';

test('logout removes tokens and cached sign-in and verification responses', () => {
  const initial = reducer(undefined, { type: '@@init' });
  const state = reducer({
    ...initial,
    token: 'old-token',
    refreshToken: 'old-refresh-token',
    loginsiginResponse: { success: true, phone_verified: '1', token: 'old-token' },
    loginResponse: { user: { id: 42 } },
    verifyResponse: { email: 'previous@example.com' },
    tokenResponse: 'old-token',
  }, logoutSuccess('logout'));

  expect(state).toEqual({
    ...initial,
    isLoading: false,
    status: 'Auth/logoutSuccess',
    logoutResponse: 'logout',
  });
});

import rootReducer from '../src/Redux/Reducers/RootReducer';

test('logout clears previous account data from every Redux slice', () => {
  const initial = rootReducer(undefined, { type: '@@init' });
  const previousAccount = Object.fromEntries(
    Object.entries(initial).map(([key, value]) => [key, {
      ...value,
      previousAccountData: { email: 'previous@example.com' },
    }]),
  );
  previousAccount.DashboardReducer.dashboardResponse = { data: { licensures: [{ state_id: 1 }] } };
  previousAccount.ProfileReducer.status = 'Profile/profileSuccess';

  const loggedOut = rootReducer(previousAccount, logoutSuccess('logout'));
  expect(loggedOut).toEqual({
    ...initial,
    AuthReducer: reducer(undefined, logoutSuccess('logout')),
  });
});
