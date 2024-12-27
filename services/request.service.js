const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Request = require("../models/request.model");
const paginate = require("../utils/paginate");

/**
 * Create a Request
 * @param {Object} RequestBody
 * @returns {Promise<Request>}
 */
const createRequest = async (requestBody) => {
  return await Request.create(requestBody);
};

/**
 * Query for Requests
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRequests = async (filters, options) => {
  const { page, limit, sortBy } = options;

  const requests = await Request.findAndCountAll({
    where: filters,
    ...paginate({ page, pageSize: limit }),
    order: [["createdAt", sortBy ? sortBy : "DESC"]],
  });

  return {
    data: requests.rows,
    meta: {
      pagination: {
        page,
        pageSize: limit,
        pageCount: Math.ceil(requests.count / limit),
        total: requests.count,
      },
    },
  };
};

/**
 * Get Request by id
 * @param {ObjectId} id
 * @returns {Promise<Request>}
 */
const getRequestById = async (id) => {
  const request = await Request.findOne({ where: { id } });

  return request;
};

/**
 * Update Request by id
 * @param {ObjectId} RequestId
 * @param {Object} updateBody
 * @returns {Promise<Request>}
 */
const updateRequestById = async (RequestId, updateBody) => {
  const request = await getRequestById(RequestId);

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  Object.assign(request, updateBody);

  await request.save();

  return request;
};

/**
 * Delete Request by id
 * @param {ObjectId} RequestId
 * @returns {Promise<Request>}
 */
const deleteRequestById = async (RequestId) => {
  const request = await getRequestById(RequestId);

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  const deletedRequest = await Request.destroy({ where: { id: RequestId } });

  return deletedRequest;
};

module.exports = {
  createRequest,
  queryRequests,
  getRequestById,
  updateRequestById,
  deleteRequestById,
};
