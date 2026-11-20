import {getCheckoutQuantity, matchConferenceTickets} from '../src/Utils/Helpers/ConferenceTicketSelection';

test('counts one selected ticket once when both checkout aliases contain string quantities', () => {
  const purchase = {tickets: [{id: 7, quantity: '1'}]};
  expect(getCheckoutQuantity({finalTicket: purchase, inPersonTicket: purchase})).toBe(1);
});

test('adds numeric string quantities instead of concatenating them', () => {
  expect(getCheckoutQuantity({finalTicket: {tickets: [{quantity: '1'}, {quantity: '2'}, {quantity: '0'}]}})).toBe(3);
  expect(getCheckoutQuantity({inPersonTicket: {tickets: [{quantity: '2'}]}})).toBe(2);
  expect(getCheckoutQuantity({cartData: {total_qty: '3'}})).toBe(3);
});
const catalogue = [
  {id: '1609852', name: 'Physicians', available_quantity: 975},
  {id: '1609854', name: 'Nurses/APPs/Pharmacists', available_quantity: 996},
  {id: '1609862', name: 'Physicians (Virtual)', available_quantity: 999},
];
test('matches ID and name independently of catalogue order and preserves quantities', () => {
  expect(matchConferenceTickets(catalogue, [{id: '1609854', quantity: '2'}, {id: '1609852', quantity: '1'}]))
    .toEqual([{...catalogue[1], quantity: '2'}, {...catalogue[0], quantity: '1'}]);
});
test.each([
  [{id: 'unknown', quantity: 1}],
  [{id: '1609852', name: 'Physicians (Virtual)', quantity: 1}],
  [{id: '1609852', quantity: 976}],
  [{id: '1609852', quantity: 0}],
  [{id: '1609852', quantity: 1}, {id: '1609852', quantity: 1}],
])('rejects an invalid selection %j', (...selection) => {
  expect(() => matchConferenceTickets(catalogue, selection)).toThrow();
});
