const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class Invoice extends Model {}

Invoice.init(
  {
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING(1000),
    },
  },
  {
    sequelize,
    modelName: "invoice",
  }
);

class LineItem extends Model {}

LineItem.init(
  {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priceExcludingTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalPriceWithTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "lineItem",
  }
);

module.exports = { Invoice, LineItem };
