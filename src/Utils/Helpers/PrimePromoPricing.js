// Prime promo validation uses promoDetails rather than conference coupon totals.
export const getPrimePromoPricing = (initialPrice, response) => {
    const gross = Number(initialPrice);
    const grossCents = Number.isFinite(gross) && gross > 0 ? Math.round(gross * 100) : 0;
    const details = response?.promoDetails || response?.data?.promoDetails;
    let discountCents = 0;
    if (details) {
        const value = Number(details.value);
        const type = String(details.type || '').trim().toLowerCase();
        if (Number.isFinite(value) && value >= 0) {
            if (type === 'percentage') discountCents = Math.round(grossCents * value / 100);
            else if (['fixed', 'flat', 'amount'].includes(type)) discountCents = Math.round(value * 100);
        }
    } else {
        const discount = Number(response?.discount_value);
        if (Number.isFinite(discount) && discount >= 0) discountCents = Math.round(discount * 100);
    }
    discountCents = Math.min(grossCents, Math.max(0, discountCents));
    return { grossPrice: grossCents / 100, discountAmount: discountCents / 100, finalTotalAmount: (grossCents - discountCents) / 100 };
};
