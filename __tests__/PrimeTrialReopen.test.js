import fs from 'fs';
import path from 'path';
import {isPrimeSubscriptionActive} from '../src/Utils/Helpers/primeSubscription';

// Exercise the dashboard's actual membership calculation and modal condition
// without mounting unrelated native dashboard widgets.
const source = fs.readFileSync(path.resolve(__dirname, '../src/Screen/Dashboard/Main.js'), 'utf8');
const start = source.indexOf('  const subscription = WebcastReducer?.PrimeCheckResponse?.subscription;');
const end = source.indexOf('\n', source.indexOf('  const isPrimeMembershipResolved =', start));
const modalCondition = source.match(/return \(([^\n]+)\) && <PrimeCard/)[1];
const evaluate = new Function('state', 'isPrimeSubscriptionActive', `
  const {WebcastReducer = {}, DashboardReducer = {}, AuthReducer = {},
    finalProfessionmain = null, finalverifyvaultmain = null,
    isSubscriptionExpiredSync = false} = state;
  ${source.slice(start, end)}
  const isAccreditationUser = false, isPrimeLocationEligible = true,
    isEligibleToRenderPrimeCard = true, allProfTake = true,
    isPhysicianFlow = true, hasAllProfTake = true, primeadd = true,
    isDrawerVisible = false;
  return {active: hasActivePrimeMembership, visible: (${modalCondition})};
`);
const check = state => evaluate(state, isPrimeSubscriptionActive);

test('reopened app waits for subscription data even if the popup was requested', () => {
  expect(check({})).toEqual({active: false, visible: false});
});

test('restored active trial hides Prime card without an in-memory trial success action', () => {
  expect(check({
    WebcastReducer: {PrimeCheckResponse: {subscription: {end_date: '2099-01-01'}}},
    DashboardReducer: {mainprofileResponse: {subscription_user: 'free'}},
  })).toEqual({active: true, visible: false});
});

test('subscription response suppresses popup while cached account still says non-subscribed', () => {
  expect(check({
    WebcastReducer: {PrimeCheckResponse: {subscription: {end_date: '2099-01-01'}}},
    AuthReducer: {loginResponse: {user: {subscription_user: 'non-subscribed'}}},
  })).toEqual({active: true, visible: false});
});

test('direct login trial is recognized during account hydration', () => {
  expect(check({AuthReducer: {dircetloginResponse: {user: {subscription_user: 'free'}}}}))
    .toEqual({active: true, visible: false});
});

test('confirmed non-member can still see the Prime card', () => {
  expect(check({WebcastReducer: {PrimeCheckResponse: {msg: 'No active subscription is there.'}}}))
    .toEqual({active: false, visible: true});
});

test('expired trial can still see the Prime card', () => {
  expect(check({
    isSubscriptionExpiredSync: true,
    WebcastReducer: {PrimeCheckResponse: {subscription: {end_date: '2020-01-01'}}},
    DashboardReducer: {mainprofileResponse: {subscription_user: 'free'}},
  })).toEqual({active: false, visible: true});
});
