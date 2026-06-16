import { raffleApi } from "../api/raffle.api";

/**
 * Service class orchestrating database entity communications, payload schema validations, 
 * and structural presentation-ready conversions for Raffle records.
 * * @class RaffleService
 */
class RaffleService {
  /**
   * Fetches all registered database raffle entries and enriches them for interface consumption.
   * * @static
   * @async
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of enriched, layout-ready raffle objects.
   * @throws {Error} If the API request fails.
   */
  static async getAllRaffles() {
    const raffles = await raffleApi.getAllRaffles();
    return raffles.map((raffle) => this._enrichRaffleData(raffle));
  }

  /**
   * Fetches a single database raffle row matched against its primary tracking ID key.
   * * @static
   * @async
   * @param {string|number} id - Target lookup primary identifier.
   * @returns {Promise<Object>} A promise that resolves to the formatted and enriched raffle model object.
   * @throws {Error} If the raffle is not found or the API request fails.
   */
  static async getRaffleById(id) {
    const raffle = await raffleApi.getById(id);
    return this._enrichRaffleData(raffle);
  }

  /**
   * Validates authentication parameters and dispatches a single ticket slot purchase.
   * * @static
   * @async
   * @param {string|number} raffleId - Target raffle database tracking key.
   * @param {number} number - Matrix index position of the chosen ticket element.
   * @param {Object} buyerData - Persona context schema fields.
   * @param {number} buyerData.userId - The authenticated user ID performing the purchase.
   * @param {string} [buyerData.name] - Optional buyer name for logs or display.
   * @param {string} [buyerData.phone] - Optional buyer phone number.
   * @returns {Promise<Object>} A promise that resolves to the purchase confirmation payload.
   * @throws {Error} If the user session is missing or unauthenticated.
   */
  static async purchaseNumber(raffleId, number, buyerData) {
    if (!buyerData?.userId) {
      throw new Error("Authentication is required to reserve a ticket.");
    }

    return await raffleApi.buyNumber(raffleId, number, {
      userId: buyerData.userId,
      name: buyerData.name?.trim(),
      phone: buyerData.phone?.replace(/\D/g, ""),
    });
  }

  /**
   * Validates required data structures and dispatches a new raffle registration.
   * * @static
   * @async
   * @param {Object} raffleData - The raffle payload configuration.
   * @param {string} raffleData.name - Title/Name of the raffle.
   * @param {string} raffleData.prize - Description of the prize.
   * @param {number} raffleData.ticketPrice - Cost per single ticket unit.
   * @param {number} raffleData.totalTickets - Total available capacity of ticket spots.
   * @param {number} raffleData.authorId - User ID of the administrator creating the raffle.
   * @returns {Promise<Object>} A promise that resolves to the created raffle instance.
   * @throws {Error} If any mandatory schema field is missing.
   */
  static async createRaffle(raffleData) {
    const { name, prize, ticketPrice, totalTickets, authorId } = raffleData;
    
    if (!name || !prize || !ticketPrice || !totalTickets || !authorId) {
      throw new Error("Missing required fields: name, prize, ticketPrice, totalTickets, and authorId are mandatory.");
    }
    
    return await raffleApi.create(raffleData);
  }

  /**
   * Dispatches a raffle deletion request to the API layer.
   * * @static
   * @async
   * @param {string|number} id - Target instance tracking key identifier.
   * @returns {Promise<Object>} A promise that resolves to the deletion metrics response.
   * @throws {Error} If the provided identifier is invalid or missing.
   */
  static async deleteRaffle(id) {
    if (!id) {
      throw new Error("Invalid raffle ID provided for deletion.");
    }
    return await raffleApi.delete(id);
  }

  /**
   * PRIVATE UTILITY HELPER: Appends real-time metrics, localized formatting, 
   * and backwards-compatible attributes onto raw database results.
   * * @static
   * @private
   * @param {Object} raffle - Raw data model dictionary from backend data sources.
   * @returns {Object} Enriched view-ready composite object tailored for UI components.
   */
  static _enrichRaffleData(raffle) {
    const totalTickets = raffle.totalTickets || 100;
    
    // Filters and counts only tickets that have a buyer assigned (Prisma relation)
    const soldTickets = raffle.tickets 
      ? raffle.tickets.filter(ticket => ticket.userId !== null).length 
      : 0;

    const price = raffle.ticketPrice || 0;
    const drawDate = raffle.drawDate;

    return {
      ...raffle,
      // Mapping database 'name' to UI 'title' to maintain backwards compatibility with legacy layout components
      title: raffle.name, 

      // Regional BRL currency formatter mask localization injection
      formattedPrice: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price),
      
      // Analytical performance ratios computation for visual progress bars
      salesProgress: totalTickets > 0 ? Math.round((soldTickets / totalTickets) * 100) : 0,
      isSoldOut: soldTickets >= totalTickets,
      
      // Translates backend date objects or ISO strings safely to Brazilian localized labels
      formattedDrawDate: drawDate ? new Date(drawDate).toLocaleDateString("pt-BR") : ""
    };
  }
}

export default RaffleService;