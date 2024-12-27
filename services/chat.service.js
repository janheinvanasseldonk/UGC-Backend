const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Chat = require("../models/chat.model");
const { Op } = require("sequelize");
const { Message, User } = require("../models");
const { userService } = require("../services/index");
const Offer = require("../models/offer.model");


/**
 * Create a Chat
 * @param {Object} chatBody
 * @returns {Promise<Chat>}
 */
const createChat = async (chatBody) => {
  return await Chat.create(chatBody);
};

/**
 * Query for Chats
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryChats = async (filter, options) => {
  // @TODO: Create some pagination logic here
  const chats = await Chat.findAll();
  return chats;
};

/**
 * Get Chat by id
 * @param {ObjectId} id
 * @returns {Promise<Chat>}
 */
const getChatById = async (id) => {
  const chat = await Chat.findOne({
    where: { id },
    include: [
      { model: Message, include: [Offer] },
      { model: User, as: "user" },
      { model: User, as: "creator" },
    ],
    order: [[{ model: Message, as: "messages" }, "createdAt", "ASC"]],
  });

  return chat;
};

const getChatByUsers = async (creatorId, userId) => {
  const chat = await Chat.findOne({ where: { creatorId, userId } });

  return chat;
};

const getChatsByUserId = async (id) => {
  const chats = await Chat.findAll({
    where: {
      [Op.or]: [
        {
          creatorId: {
            [Op.eq]: id,
          },
        },
        {
          userId: {
            [Op.eq]: id,
          },
        },
      ],
    },
    include: [
      { model: User, as: "user" },
      { model: User, as: "creator" },
      { model: Message, as: "messages", include: [Offer] },
    ],
    order: [[{ model: Message, as: "messages" }, "createdAt", "ASC"]],
  });

  return chats;
};

/**
 * Update Chat by id
 * @param {ObjectId} chatId
 * @param {Object} updateBody
 * @returns {Promise<Chat>}
 */
const updateChatById = async (chatId, updateBody) => {
  const chat = await getChatById(chatId);

  if (!chat) {
    throw new ApiError(httpStatus.NOT_FOUND, "Chat not found");
  }

  Object.assign(chat, updateBody);

  await Chat.save();
  return Chat;
};

/**
 * Delete Chat by id
 * @param {ObjectId} chatId
 * @returns {Promise<Chat>}
 */
const deleteChatById = async (chatId) => {
  const chat = await getChatById(chatId);

  if (!chat) {
    throw new ApiError(httpStatus.NOT_FOUND, "Chat not found");
  }

  const deletedChat = await Chat.destroy({ where: { id: chatId } });

  return deletedChat;
};

const countUnseenMessages = async (userId) => {
  try {
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { creatorId: userId },
          { userId: userId }
        ]
      },
      attributes: ['id']
    });

    const chatIds = chats.map(chat => chat.id);

    const unseenMessagesCount = await Message.count({
      where: {
        chatId: { [Op.in]: chatIds },
        senderId: { [Op.ne]: userId },
        seen: false
      }
    });

    return unseenMessagesCount;
  } catch (error) {
    console.error(`Failed to count unseen messages: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createChat,
  queryChats,
  getChatByUsers,
  getChatsByUserId,
  getChatById,
  updateChatById,
  deleteChatById,
  countUnseenMessages
};
