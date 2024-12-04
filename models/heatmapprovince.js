'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HeatMapProvince extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HeatMapProvince.belongsTo(models.HeatMap, { foreignKey: "heatMapID" })
      HeatMapProvince.belongsTo(models.Province, {
        foreignKey: "provinceCode",
        targetKey: "code"
      })

    }
  }
  HeatMapProvince.init({
    value: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false
    },
    provinceCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'HeatMapProvince',
  });
  return HeatMapProvince;
};