const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const User = require("../models/user.model");
const paginate = require("../utils/paginate");
const Package = require("../models/package.model");
const Review = require("../models/review.model");
const Order = require("../models/order.model");
const { Sequelize, Op } = require('sequelize');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  let user
  if (userBody.role === 'company') {
    user = await User.findOne({ where: { email: userBody.email, role: 'company' } });
  } else {
    user = await User.findOne({ where: { email: userBody.email, role: 'creator' } });
  }

  if (user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Dit emailadres is al geregistreerd"
    );
  }

  return await User.create(userBody);
};
const validateEmail = async (userBody) => {
  let user
  if (userBody.role === 'company') {
    user = await User.findOne({ where: { email: userBody.email, role: 'company' } });
  } else {
    user = await User.findOne({ where: { email: userBody.email, role: 'creator' } });
  }

  if (user) {
    return false
  } else {
    return true
  }

};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filters, options) => {
  const { page, limit, sortBy } = options;

  const users = await User.findAndCountAll({
    where: {
      ...filters,
      availability: true,
      email: {
        [Op.ne]: '',
        [Op.not]: null,
      },
    },
    ...paginate({ page, pageSize: limit }),
    order: [["createdAt", sortBy ? sortBy : "DESC"]],
    include: [{
      model: Package,
      as: 'packages',
      required: false
    }, Review],
  });

  return {
    data: users.rows,
    meta: {
      pagination: {
        page,
        pageSize: limit,
        pageCount: Math.ceil(users.count / limit),
        total: users.count,
      },
    },
  };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await User.findOne({
    where: { id },
    include: [{ model: Review }, { model: Package }],
    order: [[Package, "id", "ASC"]],
  });

  return user;
};


const getUserByIdMoneySummary = async (creatorId) => {
  const user = Order.findAll({
    attributes: [
      [Sequelize.literal(`COUNT(CASE WHEN status = 'open' THEN 1 ELSE NULL END)`), 'activeOrder'],
      [Sequelize.literal(`SUM(CASE WHEN status = 'afgerond' THEN "totalAmount" ELSE 0 END)`), 'payable'],
      [Sequelize.literal(`SUM(CASE WHEN  EXTRACT(MONTH FROM  "order"."createdAt") = 6 THEN "totalAmount" ELSE 0 END)`), 'monthly']
    ],
    where: { creatorId },
    // group: ['user.id'],
    // include: [{ model: User, as: "user" }],
  })
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ where: { email }, include: [Review, Order] });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.role === 'creator') {
    await Order.update(
      { status: 'geannuleerd' },
      { where: { creatorId: userId } }
    );
  } else if (user.role === 'company') {
    await Order.update(
      { status: 'geannuleerd' },
      { where: { buyerId: userId } }
    );
  }
  // Anonymize the user data
  const fieldsToAnonymize = {};
  const userAttributes = User.rawAttributes;

  Object.keys(userAttributes).forEach((attribute) => {
    if (
      attribute !== 'id' &&
      attribute !== 'createdAt' &&
      attribute !== 'updatedAt' &&
      attribute !== 'dayOfBirth' &&
      attribute !== 'role'
    ) {
      const attributeType = userAttributes[attribute].type;
      if (attributeType instanceof Sequelize.BOOLEAN) {
      } else if (attributeType instanceof Sequelize.INTEGER || attributeType instanceof Sequelize.FLOAT) {
      } else {
        fieldsToAnonymize[attribute] = '';
      }
    }
  });

  const deletedUser = await User.update(
    {
      ...fieldsToAnonymize,
      firstName: 'Onbekende',
      lastName: "gebruiker"
    },
    { where: { id: userId } }
  );

  return deletedUser;
};


const updateUserRankById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  console.log("User: ", user.dataValues)
  const successfulOrdersCount = await Order.count({
    where: { creatorId: userId, status: 'afgerond' },
  });
  console.log("successfulOrdersCount", successfulOrdersCount)

  const totalRating = user.dataValues.reviews.reduce((acc, review) => Number(acc) + Number(review.stars), 0);
  const averageRating = user.dataValues.reviews.length ? totalRating / user.dataValues.reviews.length : 0;
  console.log("averageRating", averageRating)

  // Determine the rank based on the criteria
  let newRank = '0'; // Default rank

  if (successfulOrdersCount >= 15 && averageRating >= 4.2) {
    newRank = '2';
  } else if (successfulOrdersCount >= 5 && averageRating >= 3.5) {
    newRank = '1';
  }
  console.log('RANKS: ', user.dataValues.rank, newRank)
  // Update the user's rank if it has changed
  if (user.dataValues.rank !== newRank) {
    console.log('newRank', newRank)
    user.dataValues.rank = newRank;
    await user.save();
  }

  return user;
};



module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserByIdMoneySummary,
  validateEmail,
  updateUserRankById
};
