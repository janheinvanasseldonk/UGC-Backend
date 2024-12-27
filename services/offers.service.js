const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Offer = require("../models/offer.model");
const paginate = require("../utils/paginate");

/**
 * Create a Offer
 * @param {Object} OfferBody
 * @returns {Promise<Offer>}
 */
const createOffer = async (OfferBody) => {
  return await Offer.create(OfferBody);
};

/**
 * Query for Offers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOffers = async (filters, options) => {
  const { page, limit, sortBy } = options;

  const offers = await Offer.findAndCountAll({
    where: filters,
    ...paginate({ page, pageSize: limit }),
    order: [["createdAt", sortBy ? sortBy : "DESC"]],
  });

  return {
    data: offers.rows,
    meta: {
      pagination: {
        page,
        pageSize: limit,
        pageCount: Math.ceil(offers.count / limit),
        total: offers.count,
      },
    },
  };
};

/**
 * Get Offer by id
 * @param {ObjectId} id
 * @returns {Promise<Offer>}
 */
const getOfferById = async (id) => {
  const offer = await Offer.findOne({ where: { id } });

  return offer;
};

/**
 * Update Offer by id
 * @param {ObjectId} OfferId
 * @param {Object} updateBody
 * @returns {Promise<Offer>}
 */
const updateOfferById = async (OfferId, updateBody) => {
  const offer = await getOfferById(OfferId);
  if (!offer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Offer not found");
  }

  Object.assign(offer, updateBody);

  await offer.save();

  return offer;
};

/**
 * Delete Offer by id
 * @param {ObjectId} offerId
 * @returns {Promise<Offer>}
 */
const deleteOfferById = async (offerId) => {
  const offer = await getOfferById(offerId);

  if (!offer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Offer not found");
  }

  const deletedOffer = await Offer.destroy({ where: { id: offerId } });

  return deletedOffer;
};

module.exports = {
  createOffer,
  queryOffers,
  getOfferById,
  updateOfferById,
  deleteOfferById,
};
