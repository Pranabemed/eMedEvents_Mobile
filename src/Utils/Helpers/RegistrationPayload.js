// A website-created invoice already belongs to its website checkout session.
// Do not attach an unrelated native guest signup session to that purchase.
export const normalizeRegistrationPayload = (payload, {webCheckout = false, deviceType, deviceToken = ''} = {}) => {
  const normalized = {
    ...payload,
    invoice: typeof payload.invoice === 'string' ? payload.invoice.trim() : payload.invoice,
    attendee: payload.attendee.map(attendee => {
      const item = {...attendee};
      if (item.ticket_id != null) item.ticket_id = String(item.ticket_id);
      if (item.payment_ticket_id != null) item.payment_ticket_id = String(item.payment_ticket_id);
      if (webCheckout) {
        delete item.playerSessionID;
        if (!item.npi_number) delete item.npi_number;
      }
      return item;
    }),
    deviceType,
    deviceToken,
  };
  if (webCheckout) delete normalized.playerSessionID;
  return normalized;
};
