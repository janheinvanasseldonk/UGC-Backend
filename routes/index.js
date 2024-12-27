const express = require("express");
const authRoute = require("./auth.route");
const usersRoute = require("./user.route");
const packagesRoute = require("./package.route");
const messagesRoute = require("./message.route");
const chatsRoute = require("./chat.route");
const ordersRoute = require("./order.route");
const paymentMethodsRoute = require("./paymentMethods.route");
const reviewsRoute = require("./reviews.route");
const requestsRoute = require("./requests.route");
const offersRoutes = require("./offers.route");
const onboardingRoutes = require("./onboarding.route");
const invoicesRoutes = require("./invoice.route");
const webhookRoutes = require("./webhook.route");
const contactRoutes = require("./contact.route");
const activityRoutes = require("./activity.route");
const notificationsRoutes = require("./notifications.route");
const oneSignalRoutes = require("./onesignalPush.route");


const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: usersRoute,
  },
  {
    path: "/packages",
    route: packagesRoute,
  },
  {
    path: "/messages",
    route: messagesRoute,
  },
  {
    path: "/chats",
    route: chatsRoute,
  },
  {
    path: "/orders",
    route: ordersRoute,
  },
  {
    path: "/paymentMethods",
    route: paymentMethodsRoute,
  },
  {
    path: "/reviews",
    route: reviewsRoute,
  },
  {
    path: "/requests",
    route: requestsRoute,
  },
  {
    path: "/offers",
    route: offersRoutes,
  },
  {
    path: "/onboarding",
    route: onboardingRoutes,
  },
  {
    path: "/invoices",
    route: invoicesRoutes,
  },
  {
    path: "/stripe",
    route: webhookRoutes,
  },
  {
    path: "/contact",
    route: contactRoutes,
  },
  {
    path: "/acitivity",
    route: activityRoutes,
  },
  {
    path: "/notifications",
    route: notificationsRoutes,
  },
  {
    path: "/onesignal",
    route: oneSignalRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
