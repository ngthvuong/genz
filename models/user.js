'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Charity, {
        foreignKey: 'userID',
        scope: { role: 'charity' }
      })
    }
  }
  User.init({
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    avatarPath: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'donor', 'recipient', 'charity'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};