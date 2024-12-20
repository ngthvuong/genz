'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsFeedComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NewsFeedComment.belongsTo(models.NewsFeed, { foreignKey: 'newsFeedID' })
      NewsFeedComment.belongsTo(models.User, { foreignKey: 'userID' })
    }
  }
  NewsFeedComment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'NewsFeedComment',
  });
  return NewsFeedComment;
};