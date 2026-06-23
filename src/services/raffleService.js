import { raffleApi } from "../api/raffle.api";
import { ticketApi } from "../api/ticket.api";

/**
 * Service class orchestrating raffle operations.
 * Handles data enrichment, validation, and API coordination.
 * Updated to use new API endpoints.
 */
class RaffleService {
  /**
   * Fetches all raffles and enriches them for UI consumption.
   * @returns {Promise<Array<Object>>} Enriched raffle objects
   * @throws {Error} If the API request fails
   */
  static async getAllRaffles() {
    const raffles = await raffleApi.getAllRaffles();
    return raffles.map((raffle) => this._enrichRaffleData(raffle));
  }

  /**
   * Fetches a single raffle by ID.
   * @param {string|number} id - Raffle identifier
   * @returns {Promise<Object>} Enriched raffle object
   * @throws {Error} If the raffle is not found
   */
  static async getRaffleById(id) {
    const raffle = await raffleApi.getById(id);
    return this._enrichRaffleData(raffle);
  }
  static async drawRaffle(id) {
    return await raffleApi.draw(id);
  }

  /**
   * Creates a new raffle.
   * @param {Object} raffleData - Raffle creation payload
   * @returns {Promise<Object>} Created raffle instance
   * @throws {Error} If validation fails
   */
  static async createRaffle(raffleData) {
    const { name, prize, ticketPrice, totalTickets, authorId } = raffleData;
    
    if (!name || !prize || !ticketPrice || !totalTickets || !authorId) {
      throw new Error("Missing required fields: name, prize, ticketPrice, totalTickets, and authorId are mandatory.");
    }
    
    return await raffleApi.create(raffleData);
  }

  /**
   * Updates an existing raffle.
   * @param {string|number} id - Raffle identifier
   * @param {Object} raffleData - Updated raffle data
   * @returns {Promise<Object>} Updated raffle
   * @throws {Error} If validation fails
   */
  static async updateRaffle(id, raffleData) {
    if (!id) {
      throw new Error("Invalid raffle ID provided for update.");
    }
    return await raffleApi.update(id, raffleData);
  }

  /**
   * Deletes a raffle.
   * @param {string|number} id - Raffle identifier
   * @returns {Promise<Object>} Deletion confirmation
   * @throws {Error} If the ID is invalid
   */
  static async deleteRaffle(id) {
    if (!id) {
      throw new Error("Invalid raffle ID provided for deletion.");
    }
    return await raffleApi.delete(id);
  }

  /**
   * Purchases a ticket using the new standalone endpoint.
   * @param {string|number} raffleId - Raffle identifier
   * @param {number} number - Ticket number
   * @param {Object} buyerData - { userId, name?, phone? }
   * @returns {Promise<Object>} Purchase confirmation
   * @throws {Error} If authentication is missing
   */
  static async purchaseNumber(raffleId, number, buyerData) {
    if (!buyerData?.userId) {
      throw new Error("Authentication is required to purchase a ticket.");
    }

    // Use the new purchase endpoint
    return await ticketApi.purchase({
      raffleId: Number(raffleId),
      number: Number(number),
      userId: Number(buyerData.userId),
      name: buyerData.name?.trim(),
      phone: buyerData.phone?.replace(/\D/g, ""),
    });
  }

  /**
   * Private helper: Enriches raw raffle data with computed metrics.
   * @param {Object} raffle - Raw raffle data
   * @returns {Object} Enriched raffle object
   * @private
   */
  static _enrichRaffleData(raffle) {
    const totalTickets = raffle.totalTickets || 100;
    
    const soldTickets = raffle.tickets 
      ? raffle.tickets.filter(ticket => ticket.userId !== null).length 
      : 0;

    const price = raffle.ticketPrice || 0;
    const drawDate = raffle.drawDate;

    return {
      ...raffle,
      title: raffle.name,
      formattedPrice: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price),
      salesProgress: totalTickets > 0 ? Math.round((soldTickets / totalTickets) * 100) : 0,
      isSoldOut: soldTickets >= totalTickets,
      formattedDrawDate: drawDate ? new Date(drawDate).toLocaleDateString("pt-BR") : "",
      soldCount: soldTickets,
      availableTickets: totalTickets - soldTickets
    };
  }
}

export default RaffleService;