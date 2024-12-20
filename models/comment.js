'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Campaign, {foreignKey: 'campaignID'})
      Comment.belongsTo(models.User, {foreignKey: 'userID'})
    }
  }
  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};