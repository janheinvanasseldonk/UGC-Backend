const auth = require("../middlewares/auth");
const express = require("express");
const messageController = require("../controllers/message.controller");
const messageValidation = require("../validations/message.validation");
const validate = require("../middlewares/validate");
const upload = require("../utils/multer");

const router = express.Router();

router
  .route("/")
  .post(
    upload.fields([
      { name: "attachment"}
    ]),
    validate(messageValidation.createMessage),
    messageController.createMessage
  );

router
  .route("/:chatId")
  .get(validate(messageValidation.getMessages), messageController.getMessages)
  .patch(
    auth(),
    validate(messageValidation.updateMessage),
    messageController.updateMessage
  )
  .delete(
    auth(),
    validate(messageValidation.deleteMessage),
    messageController.deleteMessage
  );

module.exports = router;
