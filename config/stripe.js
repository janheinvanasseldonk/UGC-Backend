const stripe = require("stripe")(
  "sk_test_51O72OHBR0kgU45UaSnq0sHr0lFg3SNVRvp3rnqz1u1gTS7jSAReCFHerKmLXl2lMxyb8iCSDKyx3Jhf8C1YZpSDE004tNlu8le"
);

module.exports = {
  stripe,
};
