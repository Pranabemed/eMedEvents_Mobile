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

test.each([false, true])('shows both ticket amounts and their combined subtotal (in-person route: %s)', async inPerson => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  const ticketSave = {discounts: true, tickets: [
    {ticket_id: 'one', ticket_name: '<b>Physician</b>', quantity: '1', itemamt: '380.00'},
    {ticket_id: 'two', ticket_name: 'Nurse / PA', quantity: '1', itemamt: '50.00'},
  ]};
  const route = inPerson ? {inPersonTicket: ticketSave, inpersonSpanrole: {title: "Conference"}} : {finalTicket: ticketSave};
  await act(async () => {tree = create(<CheckoutMain spanroute={route} ticketSave={ticketSave} errors={{}} WebcastReducer={{}} formData={[]} customFields={[]} selectedSpecialities={[]} />);});
  const text = tree.root.findAllByType(require('react-native').Text).map(node => node.props.children);
  expect(text).toContain('US$430');
  if (!inPerson) {
    expect(text).toContain('Physician');
    expect(text).toContain('Nurse / PA');
    expect(text).toContain('US$380');
    expect(text).toContain('US$50');
  }
});
