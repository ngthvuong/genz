'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Campaign, {foreignKey: 'campaignId'})
      Review.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  Review.init({
    rating: {
      type:DataTypes.ENUM('1','2','3','4','5'),
      allowNull: false},
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};