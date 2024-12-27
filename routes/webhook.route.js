const { orderService, invoiceService } = require("../services");
const { stripe } = require("../config/stripe");
const express = require("express");
const fs = require("fs");
const httpStatus = require("http-status");
const PDFDocument = require("pdfkit");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

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

const router = express.Router();

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

router
  .route("/webhook")
  .post(
    express.raw({ type: "application/json" }),
    async (request, response) => {
      const sig = request.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
        event = event;
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data.object;
          // Then define and call a function to handle the event payment_intent.succeeded
          break;

        case "application_fee.created":
          const applicationFeeCreated = event.data.object;

          break;

        case "checkout.session.completed":
          const checkoutSessionCompleted = event.data.object;

          if (checkoutSessionCompleted.payment_status === "paid") {
            const order = await orderService.updateOrderById(
              checkoutSessionCompleted.metadata.orderId,
              {
                status: "behandeling",
                stripePaymentId: checkoutSessionCompleted.id,
              }
            );

            // 1. create an invoice here for the order to save in db
            const invoice = await invoiceService.createInvoice({
              lineItems: [
                {
                  description: `Order #${order.id}`,
                  totalPriceWithTax: order.totalAmount,
                  priceExcludingTax: order.totalAmount / 1.21,
                  taxAmount: order.totalAmount - order.totalAmount / 1.21,
                },
              ],
              totalAmount: order.totalAmount,
              orderId: order.id,
              creatorId: order.creatorId,
              buyerId: order.buyerId,
              invoiceDate: new Date(),
            });

            //2. create a pdf and save to firestore here
            const doc = new PDFDocument();
            doc.fontSize(24).text(`Invoice for ${invoice.orderId}`);
            const pdfBuffer = await new Promise((resolve) => {
              const chunks = [];
              doc.on("data", (chunk) => {
                chunks.push(chunk);
              });
              doc.on("end", () => {
                resolve(Buffer.concat(chunks));
              });
              doc.end();
            });

            const storageRef = ref(
              storage,
              `invoices/invoice-${invoice.orderId}`
            );

            const metadata = {
              contentType: "application/pdf",
            };

            const snapshot = await uploadBytesResumable(
              storageRef,
              pdfBuffer,
              metadata
            );

            const downloadURL = await getDownloadURL(snapshot.ref);

            await invoiceService.updateInvoiceById(invoice.id, {
              fileUrl: downloadURL,
            });
          }

          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      response.send().end();
    }
  );

module.exports = router;
