const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./user.model");
const Message = require("./message.model");
const Chat = require("./chat.model");
const Order = require("./order.model");
const Review = require("./review.model");
const Offer = require("./offer.model");
const Activity = require("./activity.model");
const { LineItem, Invoice } = require("./invoice.model");
const Notifications = require("./notifications.model");

class Package extends Model { }

Package.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
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
      allowNull: false,
    },
    tiktokVideo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    instagramStory: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    instagramReels: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    snapchatAds: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    voiceover: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    music: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    subtitle: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    script: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    videoEditing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rawContent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    physicalProducts: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    description: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    usageRights: {
      type: DataTypes.STRING,
    },
    deliveryTime: {
      type: DataTypes.STRING,
    },
    revisions: {
      type: DataTypes.INTEGER,
    },
    niche: {
      type: DataTypes.ENUM(
        "app",
        "games",
        "marketing",
        "food",
        "fashion",
        "beauty",
        "wellness",
        "pets",
        "sport",
        "huis&tuin",
        "overig"
      ),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: "package",
  }
);

Package.belongsTo(User);
Notifications.belongsTo(User);
User.hasMany(Package);
User.hasMany(Notifications);
Message.belongsTo(Chat);
Chat.hasMany(Message);
Chat.belongsTo(User, {
  as: "creator",
  foreignKey: "creatorId",
});
Chat.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});
Message.belongsTo(Chat);
Order.belongsTo(Package);
Order.belongsTo(Offer);
Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Order, { foreignKey: 'orderId' });
User.hasMany(Review, { foreignKey: 'userId' });
Order.hasOne(Review, { foreignKey: 'orderId' });
User.hasMany(Order, {
  foreignKey: "creatorId",
});
Order.belongsTo(User, {
  as: "user",
  foreignKey: "buyerId",
});
Order.belongsTo(User, {
  as: "creator",
  foreignKey: "creatorId",
});
Offer.belongsTo(Chat);
Message.belongsTo(Offer);
Offer.belongsTo(Message);
Invoice.hasMany(LineItem, {
  foreignKey: "invoiceId",
  as: "lineItems",
});

LineItem.belongsTo(Invoice, {
  foreignKey: "invoiceId",
});
Invoice.belongsTo(User, {
  as: "creator",
  foreignKey: "creatorId",
});
Invoice.belongsTo(User, {
  as: "user",
  foreignKey: "buyerId",
});
Invoice.belongsTo(Order);
Order.hasOne(Invoice);

Activity.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(Activity, { foreignKey: 'userId' });
Order.hasMany(Activity, {
  foreignKey: "orderId"
});
module.exports = Package;
