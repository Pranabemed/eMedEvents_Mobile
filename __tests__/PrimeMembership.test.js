import React from 'react';
import {act, create} from 'react-test-renderer';
import {TouchableOpacity} from 'react-native';
import {hasUsaPrimeProfile, isPrimePhysicianProfile, isPrimeSubscriptionActive} from '../src/Utils/Helpers/primeSubscription';
import PrimeCard from '../src/Components/PrimeCard';

const mockDispatch = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({dispatch: mockDispatch}),
  CommonActions: {reset: payload => ({type: 'RESET', payload})},
}));
jest.mock('react-native-modal', () => 'Modal');
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');

const usaUser = {user_address: {country_code: 'US'}, profession: 'Physician', profession_type: 'MD', subscription_user: 'non-subscribed'};

test('USA account remains Prime eligible when current IP is India', () => {
  expect(hasUsaPrimeProfile({...usaUser, ip_country: 'IN'})).toBe(true);
  expect(isPrimePhysicianProfile(usaUser)).toBe(true);
});

test.each(['US', 'USA', 'UNITED STATES', 'United States of America'])('recognizes existing USA profile format %s', country => {
  expect(hasUsaPrimeProfile({user_address: {country_name: country}})).toBe(true);
});

test('live direct login supplies country and profession before profile/storage is populated', () => {
  expect(hasUsaPrimeProfile({}, {user: usaUser}, null)).toBe(true);
  expect(isPrimePhysicianProfile({}, {user: usaUser}, null)).toBe(true);
});

test('late profile data is evaluated on rerender without storage or remount', async () => {
  const values = [];
  function Probe({profile}) {
    values.push(hasUsaPrimeProfile(profile) && isPrimePhysicianProfile(profile));
    return null;
  }
  let tree;
  await act(async () => {tree = create(<Probe profile={{}} />);});
  expect(values[values.length - 1]).toBe(false);
  await act(async () => tree.update(<Probe profile={usaUser} />));
  expect(values[values.length - 1]).toBe(true);
  await act(async () => tree.unmount());
});

test('non-USA/unknown accounts and unsupported professions do not gain eligibility', () => {
  expect(hasUsaPrimeProfile({country_name: 'India', ip_country: 'IN'})).toBe(false);
  expect(hasUsaPrimeProfile({})).toBe(false);
  expect(isPrimePhysicianProfile({...usaUser, profession: 'Nurse'})).toBe(false);
  expect(isPrimePhysicianProfile({...usaUser, profession_type: 'Other'})).toBe(false);
});

test('current profile overrides stale cached country and profession', () => {
  expect(hasUsaPrimeProfile({country_name: 'India'}, usaUser)).toBe(false);
  expect(isPrimePhysicianProfile({profession: 'Nurse'}, usaUser)).toBe(false);
});

test('Prime and free trial membership data is not changed by account resolution', () => {
  for (const subscription_user of ['subscribed', 'free', 'non-subscribed']) {
    const user = {...usaUser, subscription_user};
    expect(hasUsaPrimeProfile(user)).toBe(true);
    expect(user.subscription_user).toBe(subscription_user);
  }
  expect(isPrimeSubscriptionActive({subscription: {end_date: '2027-01-01'}})).toBe(true);
});

test('existing Get Prime Membership action opens PrimePayment with unchanged params', async () => {
  const close = jest.fn();
  let tree;
  await act(async () => {tree = create(<PrimeCard primeadd setPrimeadd={close} />);});
  const button = tree.root.findAllByType(TouchableOpacity).find(node =>
    node.findAll(n => n.props.children === 'Get Prime Membership').length > 0);
  expect(button).toBeDefined();
  await act(async () => button.props.onPress());
  expect(close).toHaveBeenCalledWith(false);
  expect(mockDispatch).toHaveBeenCalledWith({type: 'RESET', payload: {index: 0, routes: [{name: 'PrimePayment'}]}});
  await act(async () => tree.unmount());
});
