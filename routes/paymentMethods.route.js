const express = require("express");
const httpStatus = require("http-status");
const { mollieClient } = require("../config/mollie");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const methods = await mollieClient.methods.list({
    include: "issuers",
  });
  res.status(httpStatus.OK).send({
    methods,
  });
});

module.exports = router;
