const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
const Chat = require("./chat.model");
const Offer = require("./offer.model"); // Assuming you have this model

class Message extends Model {}

Message.init(
  {
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Chat,
        key: "id",
      },
    },
    text: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    seen: {
      type: DataTypes.BOOLEAN,
    },
    attachment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    offerId: {
      // New column
      type: DataTypes.INTEGER,
      allowNull: true, // Assuming it can be null
      references: {
        model: Offer,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "message",
  }
);

// Associations
Message.belongsTo(Chat, { foreignKey: "chatId" });
Message.belongsTo(Offer, { foreignKey: "offerId", allowNull: true }); // Assuming Offer exists and can be nullable

module.exports = Message;
