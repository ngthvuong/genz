'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class License extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      License.belongsTo(models.Charity, {
        foreignKey: "charityID"
      })
    }
  }
  License.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    imgPath: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'License',
  });
  return License;
};