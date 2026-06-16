import { ticketApi } from "../api/ticket.api";

/**
 * Service Layer to manage formatting, sorting, and analytical metrics resolution for User Tickets.
 * Adjusted to handle reality boundaries where tickets do not hold a 'status' field in Prisma.
 */
class TicketService {
  /**
   * Fetches all purchases made by the current authenticated scope user.
   * @returns {Promise<Array>} Cleanly formatted and ordered collection of tickets.
   */
  static async getMyPurchasedTickets() {
    const rawTickets = await ticketApi.getUserTickets();
    
    // Sorts listings descending by chronological checkout parameters
    return rawTickets
      .map((ticket) => this._enrichTicketData(ticket))
      .sort((a, b) => new Date(b.purchasedAt || 0) - new Date(a.purchasedAt || 0));
  }

  /**
   * PRIVATE HELPER: Extrapolates conditional variables dynamically from relational Prisma parameters.
   * @param {Object} ticket - Raw relational Ticket layout model.
   * @returns {Object} Business-ready UI compatible structural object.
   * @private
   */
  static _enrichTicketData(ticket) {
    // Evaluate purchase context dynamically based on relational schema properties
    const hasBeenPaid = ticket.userId !== null && ticket.purchasedAt !== null;

    return {
      ...ticket,
      // Emulates status indicators on top of structural database values
      statusLabel: hasBeenPaid ? "Confirmado" : "Disponível / Aguardando",
      isPaid: hasBeenPaid,
      
      // Regional date mapping translation wrapper
      purchaseDate: ticket.purchasedAt 
        ? new Date(ticket.purchasedAt).toLocaleDateString("pt-BR")
        : ""
    };
  }
}

export default TicketService;