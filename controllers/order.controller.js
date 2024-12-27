const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { orderService, userService } = require("../services");
const { stripe } = require("../config/stripe");
const Uploader = require("../utils/uploader");


const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { LineItem } = require("../models");
const { getOfferById } = require("../services/offers.service");
const { createInvoice } = require("../services/invoice.service");
const { getPackageById } = require("../services/package.service");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

const storage = getStorage();

// const createOrder = catchAsync(async (req, res) => {
//   const { body, file } = req;

//   const storageRef = ref(storage, `files/${file.originalname}`);

//   const metadata = {
//     contentType: file.mimetype,
//   };

//   const snapshot = await uploadBytesResumable(
//     storageRef,
//     file.buffer,
//     metadata
//   );

//   const downloadURL = await getDownloadURL(snapshot.ref);

//   const order = await orderService.createOrder({
//     ...body,
//     scriptFileUrl: downloadURL,
//     buyerId: Number(body.buyerId),
//     packageId: Number(body.packageId),
//     creatorId: Number(body.creatorId),
//     totalAmount: Number(body.totalAmount),
//     fastDelivery1Day: Boolean(body.fastDelivery1Day),
//     status: "open",
//   });

//   const user = await userService.getUserById(body.buyerId);
//   const creator = await userService.getUserById(body.creatorId);

//   const session = await stripe.checkout.sessions.create({
//     success_url: `${process.env.FRONTEND_URL}/order/success?orderId=${order.id}`,
//     cancel_url: `${process.env.FRONTEND_URL}/order/cancel?orderId=${order.id}`,
//     payment_method_types: ["ideal", "card"],
//     customer_email: user.email,
//     automatic_tax: {
//       enabled: true,
//     },
//     line_items: [
//       {
//         price_data: {
//           unit_amount: Math.ceil(Number(body.totalAmount) * 100),
//           currency: "eur",
//           product_data: {
//             name: `UGC.nl order #${order.id}`,
//           },
//         },
//         quantity: 1,
//       },
//     ],
//     metadata: {
//       orderId: order.id,
//     },
//     //@TODO: if the creator id has not stripe account connected yet, it should not send this object
//     payment_intent_data: {
//       application_fee_amount: Math.ceil(Number(body.totalAmount * 100 * 0.2)),
//       transfer_data: {
//         destination: creator.stripeAccountId,
//       },
//     },
//     mode: "payment",
//   });

//   res.status(httpStatus.CREATED).send(session);
// });


const createOrder = catchAsync(async (req, res) => {
  const { body } = req;


  if (body.buyerId.toString() === body.creatorId.toString()) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, "Error");
  }

  const order = await orderService.createOrder({
    ...body,
    buyerId: Number(body.buyerId),
    packageId: body.packageId ? Number(body.packageId) : null,
    offerId: body.offerId ? Number(body.offerId) : null,
    creatorId: Number(body.creatorId),
    totalAmount: Number(body.totalAmount),
    fastDelivery1Day: Boolean(body.fastDelivery1Day),
    status: "open",
  });

  let packageData
  if (body.packageId) {
    packageData = await getPackageById(body.packageId)
  } else {
    packageData = await getOfferById(body.offerId)
  }

  // Create the invoice
  const lineItems = [{
    description: packageData.description,
    priceExcludingTax: Number(body.totalAmount),
    taxAmount: 0,
    totalPriceWithTax: Number(body.totalAmount),
  }]
  const invoiceData = {
    invoiceDate: order.createdAt,
    totalAmount: Number(body.totalAmount),
    creatorId: Number(body.creatorId),
    buyerId: Number(body.buyerId),
    orderId: order.id,
    lineItems
  }

  const invoice = await createInvoice(invoiceData);
  console.log(invoice)

  res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "buyerId", "creatorId"]);
  let filters = {
    ...filter,
    ...((req.query.status && req.query.status !== 'All') && {
      status: req.query.status,
    }),
  }
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await orderService.queryOrders(filters, options);
  res.send(result);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "order not found");
  }
  res.send(order);
});

const updateOrder = catchAsync(async (req, res) => {
  let order;
  console.log("Submission: ", req.body.submission)
  if (!(req.files && Object.keys(req.files).length >= 1)) {
    order = await orderService.updateOrderById(req.params.orderId, req.body);
  } else {
    let uploads = [];
    let filesArray = [];
    if (Array.isArray(req.files)) {
      filesArray = req.files;
    } else if (req.files && typeof req.files === 'object') {
      filesArray = Object.values(req.files);
    }
    await Promise.all(filesArray.map(async (file) => {
      let url = await Uploader({
        location: "aws_s3",
        file: file,
        sizeLimit: true,
      });
      uploads.push(url);
    }));
    let body
    if (req.body.submission) {
      body = {
        ...req.body,
        submittedVideos: uploads,
        // status: 'afgerond'
      };
    } else {
      body = {
        ...req.body,
        uploadVideos: uploads,
      };
    }

    order = await orderService.updateOrderById(req.params.orderId, body);
  }

  res.send(order);
});


const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);
  res
    .status(httpStatus.OK)
    .send({ code: httpStatus.OK, message: "order was succesfully deleted" });
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
