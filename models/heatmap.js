'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HeatMap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HeatMap.hasMany(models.HeatMapProvince, { foreignKey: "heatMapID" })
    }
  }
  HeatMap.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('enable', 'disable'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'HeatMap',
  });
  return HeatMap;
};