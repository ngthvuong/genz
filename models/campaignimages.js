'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CampaignImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CampaignImages.belongsTo(models.Campaign, { foreignKey: 'campaignId'})
    }
  }
  CampaignImages.init({
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imagePath: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, 
  {
    sequelize,
    modelName: 'CampaignImages',
  });
  return CampaignImages;
};