'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Campaign, {foreignKey:'campaignID'})
      Transaction.belongsTo(models.PaymentMethod, {foreignKey:'paymentMethodID'})
      Transaction.belongsTo(models.User, {foreignKey:'donorID'})
    }
  }
  Transaction.init({
    amount: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false
    },
    madeAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sender: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    receiver: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Contribution','Distribution'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Pending','Success','Failed'),
      allowNull: false
    },
    apptransid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },   
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};