import { raffleApi } from "../api/raffle.api";

/**
 * Service Layer to manage business logic and data orchestration for raffles.
 * Bridges application interface components with raw API HTTP data modules.
 */
class RaffleService {
  /**
   * Fetch all active and available marketplace raffles.
   * @returns {Promise<Array>} Collection of raffle listing entities
   */
  static async getAllRaffles() {
    return await raffleApi.getAllRaffles();
  }

  /**
   * Fetch a single detailed raffle model profile by its identifier key.
   * @param {string|number} id - Unique raffle primary key
   * @returns {Promise<Object>} Completed raffle entity data with nested relationships
   */
  static async getRaffleById(id) {
    return await raffleApi.getById(id);
  }

  /**
   * Dispatches reservation transactional intent targeting a chosen ticket number slot.
   * @param {string|number} raffleId - Target raffle scope identifier
   * @param {number} number - Requested custom ticket number slot sequence
   * @param {Object} buyerData - Structured buyer credentials parameters { name, phone }
   * @returns {Promise<Object>} Transaction status message confirmation payload
   */
  static async purchaseNumber(raffleId, number, buyerData) {
    return await raffleApi.buyNumber(raffleId, number, buyerData);
  }

  /**
   * Create and register a new raffle entity listing inside the database.
   * @param {Object} raffleData - Completed structural raffle schema variables configuration
   * @returns {Promise<Object>} Created raffle backend instance records
   */
  static async createRaffle(raffleData) {
    return await raffleApi.create(raffleData);
  }

  /**
   * Remove a target raffle entry permanently from persistent records.
   * @param {string|number} id - Target raffle identifier key
   * @returns {Promise<Object>} Backend delete verification response metrics
   */
  static async deleteRaffle(id) {
    return await raffleApi.delete(id);
  }
}

export default RaffleService;