import { getPrimePromoPricing } from '../src/Utils/Helpers/PrimePromoPricing';
const promo = (type, value) => ({success: true, promoDetails: {type, value, amount: 0}});
test('100 percent discount produces zero without treating amount:0 as a fixed discount', () => {
  expect(getPrimePromoPricing(99, promo('Percentage', '100'))).toEqual({grossPrice:99,discountAmount:99,finalTotalAmount:0});
});
test('partial percentage subtracts from initial price with cent rounding', () => {
  expect(getPrimePromoPricing(99, promo('Percentage', '25'))).toEqual({grossPrice:99,discountAmount:24.75,finalTotalAmount:74.25});
});
test('fixed discounts cannot make the total negative', () => {
  expect(getPrimePromoPricing(99, promo('Fixed', '20')).finalTotalAmount).toBe(79);
  expect(getPrimePromoPricing(99, promo('Fixed', '200')).finalTotalAmount).toBe(0);
});
test('removed, malformed or unknown discounts retain the original price', () => {
  for (const response of [null, promo('Percentage', 'bad'), promo('Percentage', -10), promo('unknown', 100)]) {
    expect(getPrimePromoPricing(99, response).finalTotalAmount).toBe(99);
  }
});
