const auth = require("../middlewares/auth");
const express = require("express");
const chatController = require("../controllers/chat.controller");
const chatValidation = require("../validations/chat.validation");
const validate = require("../middlewares/validate");

const router = express.Router();

router
  .route("/")
  .post(validate(chatValidation.createChat), chatController.createChat);

router
  .route("/:chatId")
  .get(validate(chatValidation.getChat), chatController.getChat);

router
  .route("/user/:userId")
  .get(
    validate(chatValidation.getChatsByUserId),
    chatController.getChatsByUserId
  );

router
  .route("/messages/:userId")
  .get(
    validate(chatValidation.getChatsByUserId),
    chatController.getUnSeenMessages
  );

router
  .route("/:userId/:creatorId")
  .get(validate(chatValidation.getChatByUsers), chatController.getChatByUsers);

// router
//   .route("/:chatId")
//   .get(auth(), validate(chatValidation.getChat), chatController.getChat)
//   .patch(auth(), validate(chatValidation.updateChat), chatController.updateChat)
//   .delete(
//     auth(),
//     validate(chatValidation.deleteChat),
//     chatController.deleteChat
//   );

module.exports = router;
