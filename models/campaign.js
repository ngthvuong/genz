'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Campaign.hasMany(models.CampaignImage, { foreignKey: 'campaignID' })
      Campaign.hasOne(models.CampaignImage, { foreignKey: 'campaignID', as: 'firstImage' })

      Campaign.hasMany(models.Review, { foreignKey: 'campaignID' })
      Campaign.hasMany(models.Comment, { foreignKey: 'campaignID' })
      Campaign.belongsTo(models.Charity, { foreignKey: 'charityID' })
    }
  }
  Campaign.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    goal: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    budget: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Planning', 'Running', 'Closed', 'Finished'),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Campaign',
  });
  return Campaign;
};