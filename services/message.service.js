const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Message = require("../models/message.model");

/**
 * Create a message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const createMessage = async (messageBody) => {
  return await Message.create(messageBody);
};

/**
 * Query for messages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMessages = async (filter, options) => {
  // @TODO: Create some pagination logic here
  const messages = await Message.findAll();
  return messages;
};

/**
 * Get message by id
 * @param {ObjectId} id
 * @returns {Promise<Message>}
 */
const getMessageById = async (id) => {
  const message = await Message.findOne({ where: { id } });

  return message;
};

/**
 * Get message by id
 * @param {ObjectId} id
 * @returns {Promise<Message>}
 */
const getMessagesByChatId = async (chatId) => {
  const messages = await Message.findAll({ where: { chatId } });

  return messages;
};

/**
 * Update message by id
 * @param {ObjectId} messageId
 * @param {Object} updateBody
 * @returns {Promise<Message>}
 */
const updateMessageById = async (messageId, updateBody) => {
  const message = await getMessageById(messageId);

  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, "message not found");
  }

  Object.assign(message, updateBody);

  await message.save();
  return message;
};

/**
 * Delete message by id
 * @param {ObjectId} messageId
 * @returns {Promise<Message>}
 */
const deleteMessageById = async (messageId) => {
  const message = await getMessageById(messageId);

  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }

  const deletedMessage = await Message.destroy({ where: { id: messageId } });

  return deletedMessage;
};

const markAsSeen = async (messageId) => {
  try {
    const updatedMessage = await updateMessageById(messageId, { seen: true });
    return updatedMessage;
  } catch (error) {
    console.error(`Failed to mark message as seen: ${error.message}`);
    throw error;
  }
};


module.exports = {
  createMessage,
  queryMessages,
  getMessageById,
  getMessagesByChatId,
  updateMessageById,
  deleteMessageById,
  markAsSeen,
};
