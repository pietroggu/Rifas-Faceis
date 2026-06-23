import { ticketApi } from "../api/ticket.api";
import { userApi } from "../api/user.api";

/**
 * Service Layer managing ticket operations.
 * Handles formatting, enrichment, and API coordination.
 * Updated to use new RESTful endpoints.
 */
class TicketService {
  /**
   * Fetches all tickets purchased by the current user.
   * Uses the new GET /api/users/me/tickets endpoint.
   * @returns {Promise<Array>} Enriched ticket collection
   */
  static async getMyPurchasedTickets() {
    const rawTickets = await userApi.getMyTickets();
    
    return rawTickets
      .map((ticket) => this._enrichTicketData(ticket))
      .sort((a, b) => new Date(b.purchasedAt || 0) - new Date(a.purchasedAt || 0));
  }

  /**
   * Cancels a ticket.
   * @param {string|number} id - Ticket identifier
   */
  static async cancelTicket(id) {
    return await ticketApi.cancel(id);
  }

  /**
   * Fetches all tickets (Administrative use).
   * @returns {Promise<Array>} Collection of all tickets
   */
  static async getAllTickets() {
    const rawTickets = await ticketApi.getAll();
    return rawTickets.map((ticket) => this._enrichTicketData(ticket));
  }

  /**
   * Fetches a specific ticket by ID.
   * @param {string|number} id - Ticket identifier
   * @returns {Promise<Object>} Enriched ticket data
   */
  static async getTicketById(id) {
    const ticket = await ticketApi.getById(id);
    return this._enrichTicketData(ticket);
  }

  /**
   * Updates a ticket.
   * @param {string|number} id - Ticket identifier
   * @param {Object} ticketData - Updated ticket data
   * @returns {Promise<Object>} Updated ticket
   */
  static async updateTicket(id, ticketData) {
    return await ticketApi.update(id, ticketData);
  }

  /**
   * Deletes a ticket.
   * @param {string|number} id - Ticket identifier
   * @returns {Promise<Object>} Deletion confirmation
   */
  static async deleteTicket(id) {
    return await ticketApi.delete(id);
  }

  /**
   * Private helper: Enriches raw ticket data with computed status.
   * @param {Object} ticket - Raw ticket data
   * @returns {Object} Enriched ticket object
   * @private
   */
  static _enrichTicketData(ticket) {
    const isCancelled = ticket.validation === 1;
    const hasBeenPaid = !isCancelled && ticket.userId !== null && ticket.purchasedAt !== null;

    let label = "Disponível / Aguardando";
    if (isCancelled) label = "Cancelado";
    else if (hasBeenPaid) label = "Confirmado";

    return {
      ...ticket,
      statusLabel: label,
      isPaid: hasBeenPaid,
      isCancelled: isCancelled,
      purchaseDate: ticket.purchasedAt 
        ? new Date(ticket.purchasedAt).toLocaleDateString("pt-BR")
        : "",
      raffleName: ticket.raffle?.name || ticket.raffleName || "N/A"
    };
  }
}

export default TicketService;