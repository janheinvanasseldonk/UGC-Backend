const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { chatService, userService } = require("../services");

const createChat = catchAsync(async (req, res) => {
  const { creatorId, userId } = req.body;


  if (creatorId === userId) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, "Error");
  }

  const chat = await chatService.getChatByUsers(creatorId, userId);

  if (chat) {
    res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      chat,
    });
  } else {
    const newChat = await chatService.createChat(req.body);
    res.status(httpStatus.CREATED).send(newChat);
  }
});

const getChatByUsers = catchAsync(async (req, res) => {
  const chat = await chatService.getChatByUsers(
    req.params.creatorId,
    req.params.userId
  );

  if (!chat) {
    return res.status(httpStatus.NOT_FOUND).send({
      code: httpStatus.NOT_FOUND,
      message: "Chat already exists",
    });
  }

  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    chat,
  });
});

const getChatsByUserId = catchAsync(async (req, res) => {
  const chats = await chatService.getChatsByUserId(req.params.userId);

  if (!chats) {
    throw new ApiError(httpStatus.NOT_FOUND, "Chat not found");
  }

  res.send(chats);
});

const getChat = catchAsync(async (req, res) => {
  const chat = await chatService.getChatById(req.params.chatId);

  if (!chat) {
    throw new ApiError(httpStatus.NOT_FOUND, "Chat not found");
  }

  res.send(chat);
});

const updateChat = catchAsync(async (req, res) => {
  const chat = await chatService.updateChatById(req.params.chatId, req.body);
  res.send(chat);
});

const deleteChat = catchAsync(async (req, res) => {
  await chatService.deleteChatById(req.params.ChatId);
  res
    .status(httpStatus.OK)
    .send({ code: httpStatus.OK, Chat: "Chat was succesfully deleted" });
});


const getUnSeenMessages = catchAsync(async (req, res) => {

  let response = await chatService.countUnseenMessages(req.params.userId);
  res
    .status(httpStatus.OK)
    .send({ code: httpStatus.OK, count: response });
});

module.exports = {
  createChat,
  getChatByUsers,
  getChatsByUserId,
  getChat,
  updateChat,
  deleteChat,
  getUnSeenMessages
};
