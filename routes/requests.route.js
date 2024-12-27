const { permissions } = require("../config/roles");
const auth = require("../middlewares/auth");
const express = require("express");
const multer = require("multer");
const requestController = require("../controllers/requests.controller");
const requestValidation = require("../validations/request.validation");
const router = express.Router();
const upload = multer();
const validate = require("../middlewares/validate");

router
  .route("/")
  .post(
    auth(permissions.CREATE_REQUESTS),
    upload.array("images"),
    requestController.createRequest
  )
  .get(
    auth(permissions.GET_REQUESTS),
    validate(requestValidation.getRequests),
    requestController.getRequests
  );

router
  .route("/:requestId")
  .get(
    auth(permissions.GET_REQUESTS),
    validate(requestValidation.getRequest),
    requestController.getRequest
  )
  .patch(
    auth(permissions.UPDATE_REQUESTS),
    validate(requestValidation.updateRequest),
    requestController.updateRequest
  )
  .delete(
    auth(permissions.DELETE_REQUESTS),
    validate(requestValidation.deleteRequest),
    requestController.deleteRequest
  );

module.exports = router;
