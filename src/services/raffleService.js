import { raffleApi } from "../api/raffle.api";
import { getRaffleImageUrl } from "../utils/raffleImage";

/**
 * Manages business logic, inputs validation, and data formatting for raffles.
 */
class RaffleService {
  /**
   * Fetch and format all active raffles for UI consumption.
   * @returns {Promise<Array>} Enriched raffle entities
   */
  static async getAllRaffles() {
    const raffles = await raffleApi.getAllRaffles();
    return raffles.map((raffle) => this._enrichRaffleData(raffle));
  }

  /**
   * Fetch and format a single raffle by ID.
   * @param {string|number} id
   * @returns {Promise<Object>} Enriched raffle data
   */
  static async getRaffleById(id) {
    const raffle = await raffleApi.getById(id);
    return this._enrichRaffleData(raffle);
  }

  /**
   * Validate buyer parameters and execute ticket purchase.
   * @param {string|number} raffleId
   * @param {number} number
   * @param {Object} buyerData - { name, phone }
   */
  static async purchaseNumber(raffleId, number, buyerData) {
    if (!buyerData?.name?.trim()) {
      throw new Error("Buyer name is required to reserve a ticket.");
    }

    const cleanPhone = buyerData?.phone?.replace(/\D/g, "") || "";
    if (cleanPhone.length < 10) {
      throw new Error("Please enter a valid phone number with area code.");
    }

    if (number <= 0) {
      throw new Error("Invalid ticket number selected.");
    }

    return await raffleApi.buyNumber(raffleId, number, {
      name: buyerData.name.trim(),
      phone: cleanPhone,
    });
  }

  /**
   * Validate and dispatch new raffle registration.
   * @param {Object} raffleData
   */
  static async createRaffle(raffleData) {
    const title = raffleData.title ?? raffleData.nome;
    const price = raffleData.price ?? raffleData.ticketPrice ?? raffleData.valor_numero;

    if (!title || !price) {
      throw new Error("Title and price are required fields.");
    }

    return await raffleApi.create(raffleData);
  }

  /**
   * Dispatch raffle deletion request.
   * @param {string|number} id
   */
  static async deleteRaffle(id) {
    if (!id) throw new Error("Invalid raffle ID for deletion.");
    return await raffleApi.delete(id);
  }

  /**
   * PRIVATE HELPER: Injects calculated presentation-ready properties.
   * Prevents math and formatting replication inside UI components.
   * @param {Object} raffle
   * @returns {Object} Enriched raffle model
   */
  static _enrichRaffleData(raffle) {
    const totalTickets = raffle.totalTickets || 100;
    const soldTickets = raffle.soldNumbers?.length || 0;

    return {
      ...raffle,
      imageUrl: getRaffleImageUrl(raffle),
      formattedPrice: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(raffle.ticketPrice ?? raffle.price ?? raffle.valor_numero ?? 0),
      salesProgress: Math.round((soldTickets / totalTickets) * 100),
      isSoldOut: soldTickets >= totalTickets,
      formattedDrawDate: raffle.drawDate
        ? new Date(raffle.drawDate).toLocaleDateString("pt-BR")
        : "To be defined",
    };
  }
}

export default RaffleService;