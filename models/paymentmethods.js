'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentMethods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PaymentMethods.hasMany(models.Transaction,{foreignKey:'paymentMethodID'})
    }
  }
  PaymentMethods.init({
    code: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('online', 'offline'),
      allowNull: false,
    }

  }, {
    sequelize,
    modelName: 'PaymentMethods',
  });
  return PaymentMethods;
};