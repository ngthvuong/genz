'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Charity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Charity.belongsTo(models.User, {
        foreignKey: 'userID',
        scope: { role: 'charity' }
      })
    }
  }
  Charity.init({
    address: DataTypes.TEXT,
    status: DataTypes.ENUM('active', 'inactive')
  }, {
    sequelize,
    modelName: 'Charity',
  });
  return Charity;
};