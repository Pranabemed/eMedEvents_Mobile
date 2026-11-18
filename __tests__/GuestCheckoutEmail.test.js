import React from 'react';
import {act, create} from 'react-test-renderer';
let mockAuth = {};
jest.mock('react-redux', () => ({useSelector: select => select({AuthReducer: mockAuth})}));
jest.mock('../src/Screen/DetailsPageWebcast/CheckoutInputbox', () => 'CheckoutInputbox');
jest.mock('../src/Screen/DetailsPageWebcast/CheckoutModalone', () => 'CheckoutModalone');
jest.mock('../src/Components/Button', () => 'Button');
jest.mock('../src/Utils/Helpers/Dimen', () => n => n);
const CheckoutMain = require('../src/Screen/DetailsPageWebcast/CheckoutMain').default;
let tree;
afterEach(async () => {if (tree) await act(async () => tree.unmount()); tree = null; jest.restoreAllMocks();});
test.each([
  [{}, {}, true],
  [{token: 'signed-in'}, {}, false],
  [{loginResponse: {token: 'signed-in'}}, {}, false],
  [{token: 'signed-in'}, {guestOrigin: 'guest'}, true],
  [{token: 'signed-in'}, {inpersonSpanrole: {Realback: ' GuestUser '}}, true],
])('checkout passes correct guest email editing permission for auth %j and route %j', async (auth, route, expected) => {
  mockAuth = auth;
  jest.spyOn(console, 'log').mockImplementation(() => {});
  await act(async () => {tree = create(<CheckoutMain spanroute={route} errors={{}} WebcastReducer={{}} formData={[]} customFields={[]} selectedSpecialities={[]} />);});
  expect(tree.root.findByType('CheckoutInputbox').props.isGuestCheckout).toBe(expected);
});
