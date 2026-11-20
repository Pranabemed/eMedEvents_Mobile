// finalTicket and inPersonTicket are aliases for the same purchase, not additive.
export const getCheckoutQuantity = route => {
  const positiveQuantity = value => {
    const quantity = Number(value);
    return Number.isInteger(quantity) && quantity > 0 ? quantity : 0;
  };
  if (route?.cartData?.total_qty != null) return positiveQuantity(route.cartData.total_qty);
  if (Array.isArray(route?.cartData?.tickets)) return route.cartData.tickets.length;
  const tickets = route?.finalTicket?.tickets ?? route?.inPersonTicket?.tickets ?? [];
  return tickets.reduce((total, ticket) => total + positiveQuantity(ticket.quantity), 0);
};

// Resolve the selected IDs against this conference's catalogue, never by array position.
export const matchConferenceTickets = (registrationTickets, selectedTickets) => {
  const seen = new Set();
  return selectedTickets.map(selected => {
    const id = String(selected.id);
    const matches = registrationTickets.filter(ticket => String(ticket.id ?? ticket.ticket_id) === id);
    if (matches.length !== 1 || seen.has(id)) {
      throw new Error('A selected ticket does not match this conference. Please select your tickets again.');
    }
    seen.add(id);
    const ticket = matches[0];
    if (selected.name != null && String(selected.name).trim() !== String(ticket.name).trim()) {
      throw new Error('The selected ticket name does not match its ID. Please select your tickets again.');
    }
    const quantity = Number(selected.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0 ||
      (ticket.available_quantity != null && quantity > Number(ticket.available_quantity)) ||
      (Number(ticket.min_tickets_purchase) > 0 && quantity < Number(ticket.min_tickets_purchase)) ||
      (Number(ticket.max_tickets_purchase) > 0 && quantity > Number(ticket.max_tickets_purchase))) {
      throw new Error(`Please select an available quantity for ${ticket.name || 'this ticket'}.`);
    }
    return {...ticket, quantity: selected.quantity};
  });
};
