'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Province.hasMany(models.HeatMapProvince, { foreignKey: "provinceCode" })

    }
  }
  Province.init({
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Province',
  });
  return Province;
};