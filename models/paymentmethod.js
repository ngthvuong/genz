'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PaymentMethod.hasMany(models.Transaction,{foreignKey:'paymentMethodID'})
    }
  }
  PaymentMethod.init({
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
    modelName: 'PaymentMethod',
  });
  return PaymentMethod;
};