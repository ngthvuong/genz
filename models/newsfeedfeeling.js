'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsFeedFeeling extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NewsFeedFeeling.belongsTo(models.NewsFeed, { foreignKey: 'newsFeedID' })
      NewsFeedFeeling.belongsTo(models.User, { foreignKey: 'userID' })
    }
  }
  NewsFeedFeeling.init({
    type: {
      type: DataTypes.ENUM('like'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'NewsFeedFeeling',
  });
  return NewsFeedFeeling;
};