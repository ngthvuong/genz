'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsFeed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NewsFeed.belongsTo(models.User, { foreignKey: 'authorID', as: "Author" })
      NewsFeed.belongsTo(models.Campaign, { foreignKey: 'campaignID' })

      NewsFeed.hasMany(models.NewsFeedComment, { foreignKey: 'newsFeedID' })
      NewsFeed.hasMany(models.NewsFeedFeeling, { foreignKey: 'newsFeedID' })
    }
  }
  NewsFeed.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imagePath: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'NewsFeed',
  });
  return NewsFeed;
};