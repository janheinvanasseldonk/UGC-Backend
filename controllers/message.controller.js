const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { messageService, chatService } = require("../services");
const Uploader = require("../utils/uploader");


const createMessage = catchAsync(async (req, res) => {
  let message
  console.log(req.files)
  if (!(req.files && Object.keys(req.files).length >= 1)) {
    message = await messageService.createMessage(req.body);
  } else {
    const { attachment } = req.files;
    let attachmentLink = null;
    if (attachment) {
      attachmentLink = await Uploader({
        location: "aws_s3",
        file: attachment[0],
        sizeLimit: true,
      });
    }
    console.log(req.body)
    const updatedMessage = {
      ...req.body,
      attachment: attachmentLink
    };
    message = await messageService.createMessage(updatedMessage);
  }

  if (!message) {
    res.send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to Send Message!",
    });
    return;
  }


  res.status(httpStatus.CREATED).send(message);
});

const getMessages = catchAsync(async (req, res) => {
  const messages = await messageService.getMessagesByChatId(req.params.chatId);

  if (!messages) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }

  res.send(messages);
});

const updateMessage = catchAsync(async (req, res) => {
  const message = await messageService.updateMessageById(
    req.params.messageId,
    req.body
  );
  res.send(message);
});

const deleteMessage = catchAsync(async (req, res) => {
  await messageService.deleteMessageById(req.params.MessageId);
  res
    .status(httpStatus.OK)
    .send({ code: httpStatus.OK, message: "Message was succesfully deleted" });
});

module.exports = {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
};
