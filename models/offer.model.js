const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class Offer extends Model {}

Offer.init(
  {
    numberOfVideos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    durationPerVideo: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    voiceOver: {
      type: DataTypes.BOOLEAN,
    },
    music: {
      type: DataTypes.BOOLEAN,
    },
    voiceOver: {
      type: DataTypes.BOOLEAN,
    },
    deliveryTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("Accepted", "Withdrawn","Pending"),
    }
  },

  {
    sequelize,
    modelName: "offer",
  }
);


module.exports = Offer;
