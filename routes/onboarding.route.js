const express = require("express");
const httpStatus = require("http-status");
const { stripe } = require("../config/stripe");

const router = express.Router();

router.route("/").post(async (req, res) => {
  const { creatorId } = req.body;

  const account = await stripe.accounts.create({
    country: "NL",
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
    type: "express",
  });

  const accountLink = await stripe.accountLinks.create({
    account: `${account.id}`,
    refresh_url: "https://example.com/reauth",
    return_url: `${process.env.FRONTEND_URL}/dashboard/onboarding/return?stripeAccountId=${account.id}&creatorId=${creatorId}`,
    type: "account_onboarding",
  });

  res.send(accountLink);
});

router.route("/:stripeAccountId").get(async (req, res) => {
  const stripeAccountId = req.params.stripeAccountId;

  const account = await stripe.accounts.retrieve(stripeAccountId);

  res.send(account);
});

module.exports = router;
