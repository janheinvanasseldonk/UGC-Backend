const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
const Offer = require("./offer.model");
const Package = require("./package.model");

class Order extends Model { }

Order.init(
  {
    scriptFileUrl: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    sceneLocation: {
      type: DataTypes.STRING,
    },
    moreInformation: {
      type: DataTypes.STRING,
    },
    fastDelivery1Day: {
      type: DataTypes.BOOLEAN,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("behandeling", "afgerond", "geannuleerd", "open"),
    },
    stripePaymentId: {
      type: DataTypes.STRING,
    },
    uploadVideos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    uploadMessage: {
      type: DataTypes.STRING,
    },
    briefing: {
      type: DataTypes.STRING,
    },
    script: {
      type: DataTypes.STRING,
    },
    submittedVideos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },


  },

  {
    sequelize,
    modelName: "order",
  }
);


module.exports = Order;
