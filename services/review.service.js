const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Review = require("../models/review.model");
const paginate = require("../utils/paginate");
const Package = require("../models/package.model");

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<review>}
 */
const createReview = async (reviewBody) => {
  const review = await Review.findOne({
    where: { userId: reviewBody.userId, orderId: reviewBody.orderId },
  });

  if (review) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Er is al een review geschreven"
    );
  }

  return await Review.create(reviewBody);
};

/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filters, options) => {
  const { page, limit, sortBy } = options;

  const reviews = await Review.findAndCountAll({
    where: filters,
    ...paginate({ page, pageSize: limit }),
    order: [["createdAt", sortBy ? sortBy : "DESC"]],
  });

  return {
    data: reviews.rows,
    meta: {
      pagination: {
        page,
        pageSize: limit,
        pageCount: Math.ceil(reviews.count / limit),
        total: reviews.count,
      },
    },
  };
};

/**
 * Get review by id
 * @param {ObjectId} id
 * @returns {Promise<review>}
 */
const getReviewById = async (id) => {
  const review = await Review.findOne({ where: { id } });

  return review;
};

/**
 * Update review by id
 * @param {ObjectId} reviewId
 * @param {Object} updateBody
 * @returns {Promise<review>}
 */
const updateReviewById = async (reviewId, updateBody) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "review not found");
  }

  Object.assign(review, updateBody);

  await review.save();

  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<review>}
 */
const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);

  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "review not found");
  }

  const deletedreview = await Review.destroy({ where: { id: reviewId } });

  return deletedreview;
};

module.exports = {
  createReview,
  queryReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
