'use strict';
const encrypt = require('../services/cipher')

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
      Charity.hasOne(models.License, {
        foreignKey: 'charityID'
      })
      Charity.hasMany(models.Campaign, { foreignKey: 'charityID'})
    }
  }
  Charity.init({
    representative: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    establishedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    merchantAppID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        const encryptedValue = encrypt.encrypt(value);
        this.setDataValue('merchantAppID', encryptedValue);
      },
      get() {
        const rawValue = this.getDataValue('merchantAppID');
        return rawValue ? encrypt.decrypt(rawValue) : null;
      }
    },
    merchantKey1: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        const encryptedValue = encrypt.encrypt(value);
        this.setDataValue('merchantKey1', encryptedValue);
      },
      get() {
        const rawValue = this.getDataValue('merchantKey1');
        return rawValue ? encrypt.decrypt(rawValue) : null;
      }
    },
    merchantKey2: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        const encryptedValue = encrypt.encrypt(value);
        this.setDataValue('merchantKey2', encryptedValue);
      },
      get() {
        const rawValue = this.getDataValue('merchantKey2');
        return rawValue ? encrypt.decrypt(rawValue) : null;
      }
    }
  }, {
    sequelize,
    modelName: 'Charity',
  });
  return Charity;
};