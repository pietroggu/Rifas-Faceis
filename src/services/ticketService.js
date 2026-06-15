import { ticketApi } from "../api/ticket.api";

/**
 * Service Layer to manage formatting, filtering, and computed states for user tickets.
 */
class TicketService {
  /**
   * Fetch processed user purchases mapped with business presentation properties.
   * @returns {Promise<Array>} Cleanly formatted collection of tickets
   */
  static async getMyPurchasedTickets() {
    const rawTickets = await ticketApi.getUserTickets();
    
    // Sort by recent purchase order and map human-readable presentation parameters
    return rawTickets
      .map((ticket) => this._enrichTicketData(ticket))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * PRIVATE HELPER: Normalizes states, dates, and localized variables for tickets.
   * @param {Object} ticket
   * @returns {Object} Presentation-ready ticket schema
   */
  static _enrichTicketData(ticket) {
    return {
      ...ticket,
      // Human-friendly status translation for UI Badges (e.g., PENDING -> "Aguardando")
      statusLabel: ticket.status === "PAID" ? "Confirmado" : "Aguardando Pagamento",
      
      // Compute conditional styles markers directly on data layers
      isPaid: ticket.status === "PAID",
      
      // Standardized purchase date format mapping
      purchaseDate: ticket.createdAt 
        ? new Date(ticket.createdAt).toLocaleDateString("pt-BR") 
        : "N/A"
    };
  }
}

export default TicketService;